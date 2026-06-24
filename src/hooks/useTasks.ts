import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, TaskStatus } from '../types'
import { logActivity } from './useActivity'

export function useTasks() {
  const [tasks,   setTasks]   = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else       setTasks(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const createTask = async (payload: {
    title:       string
    description: string
    status:      TaskStatus
    priority:    string
    due_date:    string | null
    assignee_id: string | null
  }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()
    if (error) throw error
    setTasks(prev => [data as Task, ...prev])
    await logActivity(data.id, 'Created task')
    return data as Task
  }

  const updateTask = async (taskId: string, changes: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'due_date' | 'assignee_id'>>, oldTask?: Task) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(changes)
      .eq('id', taskId)
      .select()
      .single()
    if (error) throw error
    setTasks(prev => prev.map(t => t.id === taskId ? data as Task : t))

    if (oldTask) {
      if (changes.status && changes.status !== oldTask.status) {
        const from = changes.status === 'todo' ? 'To Do' : changes.status === 'in_progress' ? 'In Progress' : changes.status === 'in_review' ? 'In Review' : 'Done'
        const to   = oldTask.status  === 'todo' ? 'To Do' : oldTask.status  === 'in_progress' ? 'In Progress' : oldTask.status  === 'in_review' ? 'In Review' : 'Done'
        await logActivity(taskId, `Moved from ${to} → ${from}`)
      }
      if (changes.assignee_id !== undefined && changes.assignee_id !== oldTask.assignee_id) {
        await logActivity(taskId, changes.assignee_id ? 'Assignee updated' : 'Assignee removed')
      }
      if (changes.title && changes.title !== oldTask.title) {
        await logActivity(taskId, 'Title updated')
      }
      if (changes.priority && changes.priority !== oldTask.priority) {
        await logActivity(taskId, `Priority set to ${changes.priority}`)
      }
    }

    return data as Task
  }

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const old = tasks.find(t => t.id === taskId)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
    const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId)
    if (error) { fetchTasks(); throw error }
    if (old) {
      const labels: Record<TaskStatus, string> = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' }
      await logActivity(taskId, `Moved from ${labels[old.status]} → ${labels[status]}`)
    }
  }

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) { fetchTasks(); throw error }
  }

  return { tasks, loading, error, createTask, updateTask, updateTaskStatus, deleteTask, refetch: fetchTasks }
}
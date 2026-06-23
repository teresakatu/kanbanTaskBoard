import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, TaskStatus } from '../types'

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
  }) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    setTasks(prev => [data, ...prev])
    return data as Task
  }

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
    if (error) { fetchTasks(); throw error }
  }

  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) { fetchTasks(); throw error }
  }

  return { tasks, loading, error, createTask, updateTaskStatus, deleteTask, refetch: fetchTasks }
}
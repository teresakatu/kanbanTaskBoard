import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Comment } from '../types'

export function useComments(taskId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading,  setLoading]  = useState(false)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
    setLoading(false)
  }, [taskId])

  const addComment = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('comments')
      .insert({ task_id: taskId, user_id: user.id, content })
      .select()
      .single()
    if (error) throw error
    setComments(prev => [...prev, data as Comment])
  }

  const deleteComment = async (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
    await supabase.from('comments').delete().eq('id', commentId)
  }

  return { comments, loading, fetchComments, addComment, deleteComment }
}
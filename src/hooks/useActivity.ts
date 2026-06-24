import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ActivityLog } from '../types'

export function useActivity(taskId: string) {
  const [activity, setActivity] = useState<ActivityLog[]>([])

  const fetchActivity = useCallback(async () => {
    const { data } = await supabase
      .from('task_activity')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
    setActivity(data ?? [])
  }, [taskId])

  return { activity, fetchActivity }
}

export async function logActivity(taskId: string, action: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('task_activity').insert({ task_id: taskId, user_id: user.id, action })
}
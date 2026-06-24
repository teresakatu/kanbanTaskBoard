import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { TeamMember } from '../types'

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => setMembers(data ?? []))
  }, [])

  const addMember = async (name: string, color: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('team_members')
      .insert({ user_id: user.id, name, color })
      .select()
      .single()
    if (error) throw error
    setMembers(prev => [...prev, data as TeamMember])
    return data as TeamMember
  }

  const removeMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id))
    await supabase.from('team_members').delete().eq('id', id)
  }

  return { members, addMember, removeMember }
}
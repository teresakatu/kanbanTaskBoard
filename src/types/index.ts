export type TaskStatus   = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'low'  | 'normal'      | 'high'

export interface Task {
  id:          string
  title:       string
  description: string | null
  status:      TaskStatus
  priority:    TaskPriority
  due_date:    string | null
  user_id:     string
  assignee_id: string | null
  created_at:  string
  updated_at:  string
}

export interface TeamMember {
  id:         string
  user_id:    string
  name:       string
  color:      string
  created_at: string
}

export const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo',        label: 'To Do',       color: 'var(--s-todo)'   },
  { id: 'in_progress', label: 'In Progress', color: 'var(--s-prog)'   },
  { id: 'in_review',   label: 'In Review',   color: 'var(--s-review)' },
  { id: 'done',        label: 'Done',        color: 'var(--s-done)'   },
]
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Task, TeamMember } from '../../types'  // ← fixed: TeamMember imported

function PriorityIcon({ priority }: { priority: string }) {
  const colors = {
    low:    ['#C9CDD3', '#34383D', '#34383D'],
    normal: ['#C9CDD3', '#C9CDD3', '#34383D'],
    high:   ['#C9CDD3', '#C9CDD3', '#C9CDD3'],
  }[priority] ?? ['#C9CDD3', '#C9CDD3', '#34383D']

  return (
    <span style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 11, marginTop: 3, flexShrink: 0 }}>
      <i style={{ width: 2.5, height: 4,  borderRadius: 1, background: colors[0], display: 'block' }} />
      <i style={{ width: 2.5, height: 7,  borderRadius: 1, background: colors[1], display: 'block' }} />
      <i style={{ width: 2.5, height: 10, borderRadius: 1, background: colors[2], display: 'block' }} />
    </span>
  )
}

function DueDateBadge({ due_date }: { due_date: string }) {
  const due  = new Date(due_date)
  const now  = new Date()
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  const label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const isOverdue = diff < 0
  const isSoon    = diff >= 0 && diff <= 3

  const color = isOverdue ? 'var(--red)'  : isSoon ? 'var(--amber)' : 'var(--text-2)'
  const bg    = isOverdue ? 'rgba(229,83,75,.12)' : isSoon ? 'rgba(224,162,59,.12)' : 'transparent'

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, color, fontWeight: isOverdue || isSoon ? 600 : 500,
      background: bg, borderRadius: 5, padding: isOverdue || isSoon ? '2px 6px' : 0,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" /><path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
      </svg>
      {label}
    </span>
  )
}

interface Props {
  task:       Task
  members:    TeamMember[]
  onClick:    (task: Task) => void
  isOverlay?: boolean
}

export function TaskCard({ task, onClick, members, isOverlay }: Props) {  // ← fixed: members destructured
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id:   task.id,
    data: { task },
  })

  const style: React.CSSProperties = {
    transform:     CSS.Transform.toString(transform),
    opacity:       isDragging ? 0.4 : 1,
    background:    isOverlay ? 'var(--surface-3)' : 'var(--surface-2)',
    border:        `1px solid ${isOverlay ? 'var(--border-2)' : 'var(--border)'}`,
    borderRadius:  10,
    padding:       13,
    display:       'flex',
    flexDirection: 'column',
    gap:           8,
    cursor:        'pointer',
    transition:    isDragging ? 'none' : 'border-color .12s, background .12s, transform .12s',
    boxShadow:     isOverlay ? '0 8px 24px rgba(0,0,0,.5)' : 'none',
    touchAction:   'none',
  }

  const assignee = members.find(m => m.id === task.assignee_id)

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      {...listeners}
      {...attributes}
      onMouseEnter={e => {
        if (isDragging) return
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-2)'
        el.style.background  = 'var(--surface-3)'
        el.style.transform   = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        if (isDragging) return
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.background  = 'var(--surface-2)'
        el.style.transform   = 'none'
      }}
    >
      {/* Priority + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <PriorityIcon priority={task.priority} />
        <span style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)' }}>
          {task.title}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          margin: 0, fontSize: 12, lineHeight: 1.45, color: 'var(--text-2)',
          display: '-webkit-box', overflow: 'hidden',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-3)' }}>
          #{task.id.slice(-4).toUpperCase()}
        </span>
        {task.due_date && <DueDateBadge due_date={task.due_date} />}
        {assignee && (
          <span title={assignee.name} style={{
            marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%',
            background: assignee.color, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0,
          }}>
            {assignee.name[0].toUpperCase()}
          </span>
        )}
      </div>
    </article>
  )
}
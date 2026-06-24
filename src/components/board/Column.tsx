import { useDroppable } from '@dnd-kit/core'
import type { Task, TeamMember } from '../../types'  // ← add TeamMember
import { TaskCard } from './TaskCard'

function StatusDot({ color, status }: { color: string; status: string }) {
  const base: React.CSSProperties = {
    width: 13, height: 13, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
  }
  if (status === 'todo') {
    return <span style={{ ...base, border: `2px solid ${color}` }} />
  }
  if (status === 'in_progress') {
    return <span style={{ ...base, border: `2px solid ${color}`, background: `conic-gradient(${color} 0 50%, transparent 50% 100%)` }} />
  }
  if (status === 'in_review') {
    return <span style={{ ...base, border: `2px solid ${color}`, background: `conic-gradient(${color} 0 75%, transparent 75% 100%)` }} />
  }
  return <span style={{ ...base, background: color }} />
}

interface Props {
  id:          string
  label:       string
  color:       string
  tasks:       Task[]
  members:     TeamMember[]   // ← add
  onCardClick: (task: Task) => void
  onAddTask:   () => void
}

export function Column({ id, label, color, tasks, members, onCardClick, onAddTask }: Props) {  // ← add members
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <section style={{ width: 296, flexShrink: 0, display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      {/* Column header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '2px 6px 12px' }}>
        <StatusDot color={color} status={id} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{tasks.length}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          <button
            onClick={onAddTask}
            style={{
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6, background: 'transparent', border: 'none',
              color: 'var(--text-3)', cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Droppable card list */}
      <div
        ref={setNodeRef}
        style={{
          display: 'flex', flexDirection: 'column', gap: 7,
          overflowY: 'auto', padding: '2px 4px 8px', minHeight: 80,
          borderRadius: 10,
          border: isOver ? '1.5px dashed var(--accent)' : '1.5px dashed transparent',
          transition: 'border-color .15s',
          flex: 1,
        }}
      >
        {tasks.length === 0 && !isOver && (
          <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 12.5, color: 'var(--text-3)' }}>
            No tasks
          </div>
        )}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} members={members} onClick={onCardClick} />  // ← add members
        ))}
      </div>
    </section>
  )
}
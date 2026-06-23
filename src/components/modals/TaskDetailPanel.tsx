import type { Task } from '../../types'
import { COLUMNS } from '../../types'

interface Props {
  task:     Task
  onClose:  () => void
  onDelete: () => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function TaskDetailPanel({ task, onClose, onDelete }: Props) {
  const col      = COLUMNS.find(c => c.id === task.status)!
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(4,5,6,.5)', animation: 'overlayIn .15s ease' }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 444, maxWidth: '94vw', zIndex: 91,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border-2)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn .24s cubic-bezier(.16,1,.3,1)',
        boxShadow: '-24px 0 60px rgba(0,0,0,.45)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--text-3)' }}>
            #{task.id.slice(-4).toUpperCase()}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 9px', borderRadius: 6, fontSize: 11.5, fontWeight: 600,
            color: col.color, background: `color-mix(in srgb, ${col.color} 15%, transparent)`,
          }}>
            {col.label}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
            <button
              onClick={onDelete}
              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer' }}
              title="Delete task"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </button>
            <button onClick={onClose} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 8px' }}>
          <h1 style={{ margin: '0 0 11px', fontSize: 19, fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.01em', color: 'var(--text)' }}>
            {task.title}
          </h1>
          {task.description && (
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-2)' }}>
              {task.description}
            </p>
          )}

          {/* Properties */}
          <div style={{ margin: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5px 0' }}>
            <Row label="Status">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--text)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                {col.label}
              </span>
            </Row>
            <Row label="Priority">
              <span style={{ fontSize: 13, color: 'var(--text)', textTransform: 'capitalize' }}>{task.priority}</span>
            </Row>
            {task.due_date && (
              <Row label="Due date">
                <span style={{ fontSize: 13, color: isOverdue ? 'var(--red)' : 'var(--text)', fontWeight: isOverdue ? 600 : 400 }}>
                  {formatDate(task.due_date)}{isOverdue ? ' · Overdue' : ''}
                </span>
              </Row>
            )}
            <Row label="Created">
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{formatDate(task.created_at)}</span>
            </Row>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)', margin: '4px 0 12px' }}>
            Activity
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Comments coming soon.</p>
        </div>
      </aside>
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 36 }}>
      <span style={{ width: 92, flexShrink: 0, fontSize: 12.5, color: 'var(--text-3)' }}>{label}</span>
      {children}
    </div>
  )
}
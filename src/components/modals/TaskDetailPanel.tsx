import { useState } from 'react'
import type { Task, TaskStatus } from '../../types'
import { COLUMNS } from '../../types'

const PRIORITIES = ['low', 'normal', 'high'] as const

interface Props {
  task:       Task
  onClose:    () => void
  onDelete:   () => void
  onUpdate:   (changes: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'due_date'>>) => Promise<Task>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function TaskDetailPanel({ task, onClose, onDelete, onUpdate }: Props) {
  const [title,       setTitle]       = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [status,      setStatus]      = useState<TaskStatus>(task.status)
  const [priority,    setPriority]    = useState<'low' | 'normal' | 'high'>(task.priority)
  const [dueDate,     setDueDate]     = useState(task.due_date ?? '')
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [confirmDel,  setConfirmDel]  = useState(false)

  const col      = COLUMNS.find(c => c.id === status)!
  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'done'

  const isDirty =
    title.trim()  !== task.title ||
    description   !== (task.description ?? '') ||
    status        !== task.status ||
    priority      !== task.priority ||
    dueDate       !== (task.due_date ?? '')

  async function handleSave() {
    if (!title.trim()) { setError('Title cannot be empty'); return }
    setSaving(true)
    setError('')
    try {
      await onUpdate({
        title:       title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date:    dueDate || null,
      })
    } catch {
      setError('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

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
          <button onClick={onClose} style={{ marginLeft: 'auto', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 8px' }}>
          {/* Editable title */}
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setError('') }}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              borderBottom: '1.5px solid transparent', borderRadius: 0,
              color: 'var(--text)', fontSize: 19, fontWeight: 600,
              lineHeight: 1.32, letterSpacing: '-0.01em',
              padding: '0 0 4px', margin: '0 0 11px',
              transition: 'border-color .15s',
            }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
            onBlur={e  => (e.currentTarget.style.borderBottomColor = 'transparent')}
          />

          {/* Editable description */}
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description…"
            rows={3}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              borderBottom: '1.5px solid transparent', borderRadius: 0,
              color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.6,
              resize: 'vertical', padding: '0 0 4px', margin: '0 0 4px',
              transition: 'border-color .15s',
            }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
            onBlur={e  => (e.currentTarget.style.borderBottomColor = 'transparent')}
          />

          {error && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--red)' }}>{error}</p>}

          {/* Properties */}
          <div style={{ margin: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5px 0' }}>
            <Row label="Status">
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: 0, width: 10, height: 10, borderRadius: '50%', background: col.color, pointerEvents: 'none' }} />
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as TaskStatus)}
                  style={{ appearance: 'none', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, paddingLeft: 16, cursor: 'pointer' }}
                >
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </Row>

            <Row label="Priority">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as 'low' | 'normal' | 'high')}
                style={{ appearance: 'none', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, textTransform: 'capitalize', cursor: 'pointer' }}
              >
                {PRIORITIES.map(p => <option key={p} value={p} style={{ textTransform: 'capitalize' }}>{p}</option>)}
              </select>
            </Row>

            <Row label="Due date">
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  color: dueDate ? (isOverdue ? 'var(--red)' : 'var(--text)') : 'var(--text-3)',
                  fontSize: 13, cursor: 'pointer', colorScheme: 'dark',
                  fontWeight: isOverdue ? 600 : 400,
                }}
              />
            </Row>

            <Row label="Created">
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{formatDate(task.created_at)}</span>
            </Row>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '13px 18px', borderTop: '1px solid var(--border)',
          background: 'var(--surface)', flexShrink: 0,
        }}>
          {confirmDel ? (
            <>
              <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>Delete this task?</span>
              <button
                onClick={onDelete}
                style={{ marginLeft: 'auto', height: 32, padding: '0 14px', borderRadius: 8, background: 'var(--red)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >Delete</button>
              <button
                onClick={() => setConfirmDel(false)}
                style={{ height: 32, padding: '0 14px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--text-2)', fontSize: 13, cursor: 'pointer' }}
              >Cancel</button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirmDel(true)}
                style={{ height: 32, padding: '0 14px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--red)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              >Delete</button>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button
                  onClick={onClose}
                  style={{ height: 32, padding: '0 14px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--text-2)', fontSize: 13, cursor: 'pointer' }}
                >Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  style={{ height: 32, padding: '0 16px', borderRadius: 8, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: isDirty && !saving ? 'pointer' : 'default', opacity: !isDirty || saving ? 0.45 : 1 }}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </>
          )}
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
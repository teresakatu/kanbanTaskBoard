import { useState, useEffect, type KeyboardEvent } from 'react'
import type { TaskStatus } from '../../types'
import { COLUMNS } from '../../types'

const PRIORITIES = [
  { value: 'low',    label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high',   label: 'High' },
]

interface Props {
  onClose:  () => void
  onCreate: (task: {
    title:       string
    description: string
    status:      TaskStatus
    priority:    string
    due_date:    string | null
  }) => Promise<unknown>
}

export function NewTaskModal({ onClose, onCreate }: Props) {
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [status,      setStatus]      = useState<TaskStatus>('todo')
  const [priority,    setPriority]    = useState('normal')
  const [dueDate,     setDueDate]     = useState('')
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleCreate()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [title, description, status, priority, dueDate])

  async function handleCreate() {
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    try {
      await onCreate({
        title:       title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date: dueDate || null,
      })
      onClose()
    } catch {
      setError('Failed to create task. Try again.')
      setSaving(false)
    }
  }

  const selectedCol = COLUMNS.find(c => c.id === status)!

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(4,5,6,.62)', backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '12vh 16px 16px', animation: 'overlayIn .15s ease',
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: 520, maxWidth: '92vw',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-2)',
            borderRadius: 14,
            boxShadow: '0 24px 60px rgba(0,0,0,.55)',
            animation: 'modalIn .18s cubic-bezier(.16,1,.3,1)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 18px', borderBottom: '1px solid var(--border)' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: 'var(--text-3)', background: 'var(--surface-3)',
              border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px',
            }}>NP</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>New task</span>
            <button onClick={onClose} style={{
              marginLeft: 'auto', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 7, background: 'transparent', border: 'none',
              color: 'var(--text-3)', cursor: 'pointer',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 18px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <input
              autoFocus
              placeholder="Task title"
              value={title}
              onChange={e => { setTitle(e.target.value); setError('') }}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 17, fontWeight: 600, padding: '4px 0',
              }}
            />
            <textarea
              placeholder="Add a description…"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.5,
                resize: 'none', padding: '2px 0',
              }}
            />
            {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
          </div>

          {/* Options */}
          <div style={{ padding: '6px 18px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {/* Status */}
            <div style={{ position: 'relative' }}>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                style={{
                  appearance: 'none', display: 'inline-flex', alignItems: 'center',
                  height: 30, padding: '0 28px 0 11px',
                  borderRadius: 8, background: 'var(--surface-3)',
                  border: '1px solid var(--border-2)', color: 'var(--text-2)',
                  fontSize: 12.5, fontWeight: 500, cursor: 'pointer', outline: 'none',
                }}
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <span style={{
                position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                width: 9, height: 9, borderRadius: '50%',
                background: selectedCol.color, pointerEvents: 'none',
              }} />
            </div>

            {/* Priority */}
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              style={{
                appearance: 'none', height: 30, padding: '0 11px',
                borderRadius: 8, background: 'var(--surface-3)',
                border: '1px solid var(--border-2)', color: 'var(--text-2)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', outline: 'none',
              }}
            >
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label} priority</option>)}
            </select>

            {/* Due date */}
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{
                height: 30, padding: '0 11px',
                borderRadius: 8, background: 'var(--surface-3)',
                border: '1px solid var(--border-2)', color: dueDate ? 'var(--text)' : 'var(--text-2)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '13px 18px', borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Press <span style={{ fontFamily: "'JetBrains Mono', monospace", border: '1px solid var(--border-2)', borderRadius: 4, padding: '1px 5px', color: 'var(--text-2)' }}>⌘ ↵</span> to create
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={onClose} style={{
                height: 32, padding: '0 14px', borderRadius: 8,
                background: 'transparent', border: '1px solid var(--border-2)',
                color: 'var(--text-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleCreate} disabled={saving} style={{
                height: 32, padding: '0 16px', borderRadius: 8,
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Creating…' : 'Create task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
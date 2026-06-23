import { useState } from 'react'
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import type { Task, TaskStatus } from '../../types'
import { COLUMNS } from '../../types'
import { useTasks } from '../../hooks/useTasks'
import { Column } from './Column'
import { TaskCard } from './TaskCard'
import { NewTaskModal } from '../modals/NewTaskModal'
import { TaskDetailPanel } from '../modals/TaskDetailPanel'

export function Board() {
    const { tasks, loading, error, createTask, updateTask, updateTaskStatus, deleteTask, refetch } = useTasks()
    const [activeTask,    setActiveTask]    = useState<Task | null>(null)
    const [selectedTask,  setSelectedTask]  = useState<Task | null>(null)
    const [modalOpen,     setModalOpen]     = useState(false)
    const [search,        setSearch]        = useState('')

    function handleDragStart(e: DragStartEvent) {
        setActiveTask(e.active.data.current?.task ?? null)
    }

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e
        if (over && active.id !== over.id) {
        updateTaskStatus(active.id as string, over.id as TaskStatus)
        }
        setActiveTask(null)
    }

    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
    )

    const done      = tasks.filter(t => t.status === 'done').length
    const inProg    = tasks.filter(t => t.status === 'in_progress').length
    const overdue   = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length

    /* ── Loading ── */
    if (loading) return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{
            width: 36, height: 36, border: '3px solid var(--border-2)',
            borderTopColor: 'var(--accent)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>Loading your board…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    )

    /* ── Error ── */
    if (error) return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 360 }}>
            <div style={{
            width: 62, height: 62, borderRadius: 16,
            background: 'rgba(229,83,75,.1)', border: '1px solid rgba(229,83,75,.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
            }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" /><path d="M12 17h.01" />
            </svg>
            </div>
            <h2 style={{ margin: '0 0 7px', fontSize: 16.5, fontWeight: 600, color: 'var(--text)' }}>Couldn't load your board</h2>
            <p style={{ margin: '0 0 14px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-2)' }}>
            Something went wrong while fetching your tasks. Check your connection and try again.
            </p>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-3)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px' }}>
            {error}
            </span>
            <button
            onClick={refetch}
            style={{
                display: 'flex', alignItems: 'center', gap: 7,
                height: 36, padding: '0 15px', marginTop: 20,
                borderRadius: 8, background: 'var(--surface-3)',
                border: '1px solid var(--border-2)', color: 'var(--text)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
            >
            Try again
            </button>
        </div>
        </div>
    )

    return (
        <>
        {/* Topbar */}
        <header style={{
            height: 56, flexShrink: 0, borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px',
            background: 'var(--surface)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--text-2)' }}>
            <span>Workspace</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
            </svg>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>Task Board</span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginLeft: 'auto', width: 280, maxWidth: '34vw' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--text-3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
            </span>
            <input
                placeholder="Search tasks…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                width: '100%', height: 34, padding: '0 12px 0 32px',
                borderRadius: 8, background: 'var(--surface-2)',
                border: '1px solid var(--border)', color: 'var(--text)',
                fontSize: 13, outline: 'none',
                }}
            />
            </div>

            {/* New task */}
            <button
            onClick={() => setModalOpen(true)}
            style={{
                display: 'flex', alignItems: 'center', gap: 7,
                height: 34, padding: '0 13px 0 11px',
                borderRadius: 8, background: 'var(--accent)',
                border: 'none', color: '#fff',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
            >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            New task
            </button>
        </header>

        {/* Toolbar and stats */}
        <div style={{
            height: 54, flexShrink: 0, borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
        }}>
            <h1 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)' }}>Task Board</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginLeft: 6 }}>
            <Pill>{tasks.length} tasks</Pill>
            {inProg > 0  && <Pill><span style={{ color: 'var(--s-prog)' }}>●</span> {inProg} in progress</Pill>}
            {done > 0    && <Pill><span style={{ color: 'var(--s-done)' }}>●</span> {done} done</Pill>}
            {overdue > 0 && (
                <span style={{
                fontSize: 12, color: 'var(--red)',
                background: 'rgba(229,83,75,.1)', border: '1px solid rgba(229,83,75,.25)',
                borderRadius: 6, padding: '3px 9px', fontWeight: 500,
                }}>
                {overdue} overdue
                </span>
            )}
            </div>
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 340 }}>
                <div style={{
                width: 62, height: 62, borderRadius: 16,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                </div>
                <h2 style={{ margin: '0 0 7px', fontSize: 16.5, fontWeight: 600, color: 'var(--text)' }}>Your board is empty</h2>
                <p style={{ margin: '0 0 18px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-2)' }}>
                Create your first task to get started. Drag cards between columns to update their status.
                </p>
                <button
                onClick={() => setModalOpen(true)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    height: 36, padding: '0 15px',
                    borderRadius: 8, background: 'var(--accent)',
                    border: 'none', color: '#fff',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
                >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                </svg>
                Create first task
                </button>
            </div>
            </div>
        )}

        {/* ── Kanban board ── */}
        {tasks.length > 0 && (
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '16px 18px 4px' }}>
                <div style={{ display: 'flex', gap: 14, height: '100%', alignItems: 'flex-start', minWidth: 'max-content' }}>
                {COLUMNS.map(col => (
                    <Column
                    key={col.id}
                    id={col.id}
                    label={col.label}
                    color={col.color}
                    tasks={filtered.filter(t => t.status === col.id)}
                    onCardClick={setSelectedTask}
                    onAddTask={() => setModalOpen(true)}
                    />
                ))}
                </div>
            </div>

            <DragOverlay>
                {activeTask && (
                <TaskCard task={activeTask} onClick={() => {}} isOverlay />
                )}
            </DragOverlay>
            </DndContext>
        )}

        {/* ── Modals ── */}
        {modalOpen && (
            <NewTaskModal
            onClose={() => setModalOpen(false)}
            onCreate={createTask}
            />
        )}
        {selectedTask && (
            <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDelete={async () => { await deleteTask(selectedTask.id); setSelectedTask(null) }}
            onUpdate={async (changes) => {
            const updated = await updateTask(selectedTask.id, changes)
            setSelectedTask(updated)
            return updated
            }}
            />
        )}
        </>
    )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 12, color: 'var(--text-2)',
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 6, padding: '3px 9px', fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {children}
    </span>
  )
}
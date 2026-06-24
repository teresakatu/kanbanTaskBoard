import { useState } from 'react'
import { useTeamMembers } from '../../hooks/useTeamMembers'

const MEMBER_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#14b8a6']

const navItems = [
  { label: 'Inbox',    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  { label: 'My tasks', icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
]

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

export function Sidebar() {
  const { members, addMember, removeMember } = useTeamMembers()
  const [newName,    setNewName]    = useState('')
  const [addingMember, setAddingMember] = useState(false)
  const [pickedColor,  setPickedColor]  = useState(MEMBER_COLORS[0])

  async function handleAddMember() {
    if (!newName.trim()) return
    await addMember(newName.trim(), pickedColor)
    setNewName('')
    setPickedColor(MEMBER_COLORS[0])
    setAddingMember(false)
  }

  return (
    <aside style={{
      width: 236, flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '14px 12px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8, cursor: 'pointer' }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
        </span>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>Next Play</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', margin: '14px 4px 16px' }}>
        <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--text-3)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, padding: '0 9px 0 30px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 12.5 }}>
          Search
          <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--text-3)', border: '1px solid var(--border-2)', borderRadius: 4, padding: '1px 5px' }}>⌘K</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 32, padding: '0 9px', borderRadius: 7, color: 'var(--text-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <Icon>{item.icon}</Icon>
            {item.label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 32, padding: '0 9px', borderRadius: 7, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'var(--surface-3)', boxShadow: 'inset 2px 0 0 var(--accent)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
          Board
        </div>
      </nav>

      {/* Team Members */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 9px', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Team</span>
          <button onClick={() => setAddingMember(v => !v)} style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: 5, background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>

        {addingMember && (
          <div style={{ margin: '6px 4px 10px', padding: '10px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              autoFocus
              placeholder="Member name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddMember()}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, borderBottom: '1px solid var(--border-2)', paddingBottom: 4 }}
            />
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {MEMBER_COLORS.map(c => (
                <span key={c} onClick={() => setPickedColor(c)} style={{
                  width: 18, height: 18, borderRadius: '50%', background: c, cursor: 'pointer',
                  outline: pickedColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2,
                }} />
              ))}
            </div>
            <button onClick={handleAddMember} style={{ height: 28, borderRadius: 6, background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Add</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 30, padding: '0 9px', borderRadius: 7, color: 'var(--text-2)', fontSize: 13 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: m.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                {m.name[0].toUpperCase()}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
              <button onClick={() => removeMember(m.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1, opacity: 0.6 }}>×</button>
            </div>
          ))}
          {members.length === 0 && !addingMember && (
            <span style={{ fontSize: 12, color: 'var(--text-3)', padding: '2px 9px' }}>No members yet</span>
          )}
        </div>
      </div>

      {/* Settings */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 9px', borderRadius: 7, color: 'var(--text-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Settings
      </div>
    </aside>
  )
}
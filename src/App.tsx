import { Sidebar } from './components/layout/Sidebar'
import { Board }   from './components/board/Board'
import { useAuth } from './context/AuthContext'
import { useTeamMembers } from './hooks/useTeamMembers'

function App() {
  const { loading } = useAuth()
  const { members, addMember, removeMember } = useTeamMembers()

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>Setting up your session…</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar members={members} addMember={addMember} removeMember={removeMember} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Board members={members} />
      </main>
    </div>
  )
}

export default App
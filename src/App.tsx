import { useAuth } from './context/AuthContext'

function App() {
  const { session, loading } = useAuth()

  if (loading) return <p>Setting up your session...</p>

  return (
    <div>
      <p>Guest session active</p>
      <p>User ID: {session?.user.id}</p>
    </div>
  )
}

export default App
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Personnel from './components/Personnel'
import Directory from './components/Directory'
import Masterlist from './components/Masterlist'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const views = {
    dashboard: <Dashboard />,
    personnel: <Personnel />,
    directory: <Directory />,
    masterlist: <Masterlist />,
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex flex-col flex-1" style={{ marginLeft: '280px' }}>
        <Header />
        <main className="flex-1">
          {views[activeView]}
        </main>
      </div>
    </div>
  )
}

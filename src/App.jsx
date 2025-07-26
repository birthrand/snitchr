import { useState, useEffect } from 'react'
import Home from './components/Home'
import AddConfession from './components/AddConfession'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [confessions, setConfessions] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load confessions from localStorage on app start
  useEffect(() => {
    const savedConfessions = localStorage.getItem('snitchr-confessions')
    if (savedConfessions) {
      try {
        setConfessions(JSON.parse(savedConfessions))
      } catch (error) {
        console.error('Error loading confessions:', error)
        setConfessions([])
      }
    }
  }, [])

  // Save confessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('snitchr-confessions', JSON.stringify(confessions))
  }, [confessions])

  // Check for dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('snitchr-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const addConfession = (newConfession) => {
    setConfessions(prev => [newConfession, ...prev])
    setCurrentScreen('home')
  }

  const deleteConfession = (id) => {
    setConfessions(prev => prev.filter(confession => confession.id !== id))
  }

  const updateReactions = (confessionId, reactionType) => {
    setConfessions(prev => prev.map(confession => {
      if (confession.id === confessionId) {
        const reactions = confession.reactions || {}
        const currentCount = reactions[reactionType] || 0
        const hasReacted = reactions[`${reactionType}_reacted`] || false
        
        return {
          ...confession,
          reactions: {
            ...reactions,
            [reactionType]: hasReacted ? currentCount - 1 : currentCount + 1,
            [`${reactionType}_reacted`]: !hasReacted
          }
        }
      }
      return confession
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Snitchr</h1>
              <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <button
                onClick={() => setCurrentScreen(currentScreen === 'home' ? 'add' : 'home')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-press touch-target"
              >
                {currentScreen === 'home' ? 'Add' : 'Back'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 safe-area-bottom">
        <div className="screen-transition">
          {currentScreen === 'home' ? (
            <Home 
              confessions={confessions} 
              onDelete={deleteConfession}
              onAddNew={() => setCurrentScreen('add')}
              onReaction={updateReactions}
            />
          ) : (
            <AddConfession 
              onAdd={addConfession}
              onCancel={() => setCurrentScreen('home')}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {currentScreen === 'home' && (
        <button
          onClick={() => setCurrentScreen('add')}
          className="fab btn-press"
          aria-label="Add new confession"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Screen Transition Overlay */}
      {currentScreen === 'add' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in-up" />
      )}
    </div>
  )
}

export default App
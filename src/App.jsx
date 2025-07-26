import { useState, useEffect } from 'react'
import Home from './components/Home'
import AddConfession from './components/AddConfession'
import DarkModeToggle from './components/DarkModeToggle'
import PullToRefresh from './components/PullToRefresh'
import { createConfetti, createSuccessAnimation } from './utils/confetti'
import { hapticFeedback } from './utils/haptics'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [confessions, setConfessions] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    setIsLoading(false)
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
    hapticFeedback.success()
    setConfessions(prev => [newConfession, ...prev])
    setCurrentScreen('home')
    
    // Trigger confetti animation
    setTimeout(() => {
      createConfetti(0.5, 0.3)
    }, 100)
  }

  const deleteConfession = (id) => {
    hapticFeedback.delete()
    setConfessions(prev => prev.filter(confession => confession.id !== id))
  }

  const updateReactions = (confessionId, reactionType) => {
    hapticFeedback.reaction()
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

  const handleRefresh = async () => {
    hapticFeedback.pull()
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    hapticFeedback.success()
  }

  const handleScreenChange = (screen) => {
    hapticFeedback.navigate()
    setCurrentScreen(screen)
  }

  const handleThemeToggle = () => {
    hapticFeedback.toggle()
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('snitchr-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('snitchr-theme', 'light')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Snitchr...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Snitchr</h1>
              <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full animate-pulse-slow">
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleThemeToggle}
                className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors touch-target"
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                <span className="sr-only">Toggle dark mode</span>
                
                {/* Toggle Track */}
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                    isDarkMode ? 'translate-x-11' : 'translate-x-1'
                  }`}
                >
                  {/* Sun Icon */}
                  <svg
                    className={`absolute inset-0 h-6 w-6 p-1 text-yellow-500 transition-opacity duration-200 ${
                      isDarkMode ? 'opacity-0' : 'opacity-100'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 10 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  
                  {/* Moon Icon */}
                  <svg
                    className={`absolute inset-0 h-6 w-6 p-1 text-blue-500 transition-opacity duration-200 ${
                      isDarkMode ? 'opacity-100' : 'opacity-0'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => handleScreenChange(currentScreen === 'home' ? 'add' : 'home')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-press touch-target focus-ring"
              >
                {currentScreen === 'home' ? 'Add' : 'Back'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 safe-area-bottom">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="screen-transition">
            {currentScreen === 'home' ? (
              <Home 
                confessions={confessions} 
                onDelete={deleteConfession}
                onAddNew={() => handleScreenChange('add')}
                onReaction={updateReactions}
              />
            ) : (
              <AddConfession
                onAdd={addConfession}
                onCancel={() => handleScreenChange('home')}
              />
            )}
          </div>
        </PullToRefresh>
      </main>

      {/* Floating Action Button */}
      {currentScreen === 'home' && (
        <button
          onClick={() => handleScreenChange('add')}
          className="fab btn-press focus-ring"
          aria-label="Add new confession"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Screen Transition Overlay */}
      {currentScreen === 'add' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in-up modal-overlay" />
      )}
    </div>
  )
}

export default App
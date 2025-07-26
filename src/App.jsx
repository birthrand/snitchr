import { useState, useEffect } from 'react'
import Home from './components/Home'
import AddConfession from './components/AddConfession'
import DarkModeToggle from './components/DarkModeToggle'
import PullToRefresh from './components/PullToRefresh'
import SkeletonLoader from './components/SkeletonLoader'
import { useConfessions } from './useConfessions'
import { createConfetti, createSuccessAnimation } from './utils/confetti'
import { hapticFeedback } from './utils/haptics'
import { analyticsAPI } from './supabase'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Use the custom hook for confessions management
  const {
    confessions,
    loading: confessionsLoading,
    error: confessionsError,
    hasMore,
    loadMore,
    refresh,
    addConfession,
    updateReactions,
    deleteConfession
  } = useConfessions()

  // Check for dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('snitchr-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    
    setIsLoading(false)
    
    // Track app launch
    analyticsAPI.trackAppUsage('app_launched')
  }, [])

  const handleAddConfession = async (newConfession) => {
    try {
      hapticFeedback.success()
      await addConfession(newConfession)
      setCurrentScreen('home')
      
      // Trigger confetti animation
      setTimeout(() => {
        createConfetti(0.5, 0.3)
      }, 100)
      
      // Track success
      analyticsAPI.trackAppUsage('confession_added')
    } catch (error) {
      console.error('Error adding confession:', error)
      hapticFeedback.error()
      throw error
    }
  }

  const handleDeleteConfession = async (id) => {
    try {
      hapticFeedback.delete()
      await deleteConfession(id)
      analyticsAPI.trackAppUsage('confession_deleted')
    } catch (error) {
      console.error('Error deleting confession:', error)
      hapticFeedback.error()
      throw error
    }
  }

  const handleUpdateReactions = async (confessionId, reactionType) => {
    try {
      hapticFeedback.reaction()
      await updateReactions(confessionId, reactionType)
    } catch (error) {
      console.error('Error updating reactions:', error)
      hapticFeedback.error()
    }
  }

  const handleRefresh = async () => {
    try {
      hapticFeedback.pull()
      await refresh()
      hapticFeedback.success()
      analyticsAPI.trackAppUsage('confessions_refreshed')
    } catch (error) {
      console.error('Error refreshing confessions:', error)
      hapticFeedback.error()
    }
  }

  const handleScreenChange = (screen) => {
    hapticFeedback.navigate()
    setCurrentScreen(screen)
    analyticsAPI.trackAppUsage(`screen_changed_to_${screen}`)
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
    
    analyticsAPI.trackAppUsage(`theme_changed_to_${newTheme ? 'dark' : 'light'}`)
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

      {/* Error Banner */}
      {confessionsError && (
        <div className="bg-red-50 dark:bg-red-900 border-b border-red-200 dark:border-red-800 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">
              {confessionsError}
            </p>
            <button
              onClick={refresh}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 safe-area-bottom">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="screen-transition">
            {currentScreen === 'home' ? (
              confessionsLoading && confessions.length === 0 ? (
                <SkeletonLoader type="confession" count={3} />
              ) : (
                <Home 
                  confessions={confessions} 
                  onDelete={handleDeleteConfession}
                  onAddNew={() => handleScreenChange('add')}
                  onReaction={handleUpdateReactions}
                  onLoadMore={loadMore}
                  hasMore={hasMore}
                  loading={confessionsLoading}
                />
              )
            ) : (
              <AddConfession
                onAdd={handleAddConfession}
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
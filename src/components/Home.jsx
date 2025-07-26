import { useState, useEffect, useRef, useCallback } from 'react'
import ReactionButton from './ReactionButton'
import SearchFilter from './SearchFilter'
import SwipeActions from './SwipeActions'
import { getCityFromCoordinates } from '../utils/geocoding'
import { hapticFeedback } from '../utils/haptics'
import { analyticsAPI } from '../supabase'

const Home = ({ 
  confessions, 
  onDelete, 
  onAddNew, 
  onReaction, 
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [resolvedLocations, setResolvedLocations] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [confessionToDelete, setConfessionToDelete] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef()
  const lastConfessionRef = useRef()

  // Intersection Observer for infinite scroll
  const lastConfessionElementRef = useCallback(node => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true)
        onLoadMore().finally(() => setIsLoadingMore(false))
      }
    })
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, isLoadingMore, onLoadMore])

  // Resolve locations for confessions
  useEffect(() => {
    const resolveLocations = async () => {
      const newLocations = {}
      
      for (const confession of confessions) {
        if (confession.location && !resolvedLocations[confession.id]) {
          try {
            const cityName = await getCityFromCoordinates(
              confession.location.latitude,
              confession.location.longitude
            )
            newLocations[confession.id] = cityName
          } catch (error) {
            console.error('Error resolving location:', error)
            newLocations[confession.id] = 'Unknown location'
          }
        }
      }
      
      if (Object.keys(newLocations).length > 0) {
        setResolvedLocations(prev => ({ ...prev, ...newLocations }))
      }
    }

    resolveLocations()
  }, [confessions, resolvedLocations])

  const handleDeleteClick = (confession) => {
    hapticFeedback.warning()
    setConfessionToDelete(confession)
    setShowDeleteModal(true)
    analyticsAPI.trackAppUsage('delete_confession_clicked')
  }

  const handleDeleteConfirm = async () => {
    if (!confessionToDelete) return
    
    try {
      await onDelete(confessionToDelete.id)
      setShowDeleteModal(false)
      setConfessionToDelete(null)
      hapticFeedback.success()
      analyticsAPI.trackAppUsage('confession_deleted_confirmed')
    } catch (error) {
      console.error('Error deleting confession:', error)
      hapticFeedback.error()
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setConfessionToDelete(null)
    hapticFeedback.light()
  }

  const handleReaction = (confessionId, reactionType) => {
    onReaction(confessionId, reactionType)
    analyticsAPI.trackAppUsage(`reaction_${reactionType}_clicked`)
  }

  const handleShare = (confession) => {
    hapticFeedback.medium()
    
    if (navigator.share) {
      navigator.share({
        title: 'Snitchr Confession',
        text: confession.message,
        url: window.location.href
      }).then(() => {
        analyticsAPI.trackAppUsage('confession_shared_native')
      }).catch((error) => {
        console.log('Error sharing:', error)
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(confession.message).then(() => {
        hapticFeedback.success()
        analyticsAPI.trackAppUsage('confession_copied_to_clipboard')
      }).catch((error) => {
        console.error('Error copying to clipboard:', error)
        hapticFeedback.error()
      })
    }
  }

  const handleFavorite = (confession) => {
    hapticFeedback.medium()
    // Toggle favorite status (you can implement this with a favorites table)
    analyticsAPI.trackAppUsage('confession_favorited')
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getAvatarColor = (nickname) => {
    if (!nickname) return 'bg-gray-400'
    
    const colors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
      'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-teal-400'
    ]
    
    const hash = nickname.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  }

  const getInitials = (nickname) => {
    if (!nickname) return '?'
    return nickname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (confessions.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No confessions yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be the first to share an anonymous confession!
        </p>
        <button
          onClick={onAddNew}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors btn-press touch-target focus-ring"
        >
          Share Your First Confession
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Confessions List */}
      <div className="space-y-4">
        {confessions.map((confession, index) => {
          const isLast = index === confessions.length - 1
          const locationName = resolvedLocations[confession.id] || 'Loading location...'
          
          return (
            <div
              key={confession.id}
              ref={isLast ? lastConfessionElementRef : null}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SwipeActions
                onFavorite={() => handleFavorite(confession)}
                onShare={() => handleShare(confession)}
                onDelete={() => handleDeleteClick(confession)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(confession.nickname)}`}>
                        {getInitials(confession.nickname)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {confession.nickname || 'Anonymous'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatTimestamp(confession.created_at)}</span>
                          {locationName && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {locationName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {confession.mood && (
                      <div className="text-2xl" role="img" aria-label={`Mood: ${confession.mood.emoji}`}>
                        {confession.mood.emoji}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                    {confession.message}
                  </p>

                  {/* Reactions */}
                  <div className="flex items-center space-x-2">
                    <ReactionButton
                      emoji="❤️"
                      count={confession.reactions?.heart || 0}
                      isActive={confession.reactions?.heart_reacted || false}
                      onClick={() => handleReaction(confession.id, 'heart')}
                    />
                    <ReactionButton
                      emoji="😂"
                      count={confession.reactions?.laugh || 0}
                      isActive={confession.reactions?.laugh_reacted || false}
                      onClick={() => handleReaction(confession.id, 'laugh')}
                    />
                    <ReactionButton
                      emoji="🤔"
                      count={confession.reactions?.think || 0}
                      isActive={confession.reactions?.think_reacted || false}
                      onClick={() => handleReaction(confession.id, 'think')}
                    />
                  </div>
                </div>
              </SwipeActions>
            </div>
          )
        })}
      </div>

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more confessions...</span>
          </div>
        </div>
      )}

      {/* End of List */}
      {!hasMore && confessions.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            You've reached the end of confessions
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete Confession?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The confession will be permanently deleted.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 btn-press touch-target"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors btn-press touch-target"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
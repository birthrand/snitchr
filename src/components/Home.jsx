import { useState, useEffect } from 'react'
import ReactionButton from './ReactionButton'
import SearchFilter from './SearchFilter'
import Settings from './Settings'
import { getCachedLocation, getLocationDisplay } from '../utils/geocoding'

const Home = ({ confessions, onDelete, onAddNew, onReaction }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [filteredConfessions, setFilteredConfessions] = useState(confessions)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [locationCache, setLocationCache] = useState({})

  // Update filtered confessions when confessions or filters change
  useEffect(() => {
    let filtered = [...confessions]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(confession => 
        confession.message.toLowerCase().includes(term) ||
        (confession.nickname && confession.nickname.toLowerCase().includes(term))
      )
    }

    // Apply type filter
    switch (filterType) {
      case 'recent':
        filtered = filtered.slice(0, 10) // Show only 10 most recent
        break
      case 'popular':
        filtered = filtered.filter(confession => {
          const reactions = confession.reactions || {}
          const totalReactions = (reactions.heart || 0) + (reactions.laugh || 0) + (reactions.think || 0)
          return totalReactions > 0
        }).sort((a, b) => {
          const reactionsA = a.reactions || {}
          const reactionsB = b.reactions || {}
          const totalA = (reactionsA.heart || 0) + (reactionsA.laugh || 0) + (reactionsA.think || 0)
          const totalB = (reactionsB.heart || 0) + (reactionsB.laugh || 0) + (reactionsB.think || 0)
          return totalB - totalA
        })
        break
      case 'with-reactions':
        filtered = filtered.filter(confession => {
          const reactions = confession.reactions || {}
          return (reactions.heart || 0) + (reactions.laugh || 0) + (reactions.think || 0) > 0
        })
        break
      case 'no-reactions':
        filtered = filtered.filter(confession => {
          const reactions = confession.reactions || {}
          return (reactions.heart || 0) + (reactions.laugh || 0) + (reactions.think || 0) === 0
        })
        break
      default:
        // 'all' - no additional filtering
        break
    }

    setFilteredConfessions(filtered)
  }, [confessions, searchTerm, filterType])

  // Load location data for confessions
  useEffect(() => {
    const loadLocations = async () => {
      const newCache = { ...locationCache }
      let hasUpdates = false

      for (const confession of confessions) {
        if (confession.location && !locationCache[confession.id]) {
          try {
            const location = await getCachedLocation(
              confession.location.latitude,
              confession.location.longitude
            )
            if (location) {
              newCache[confession.id] = location
              hasUpdates = true
            }
          } catch (error) {
            console.error('Error loading location for confession:', confession.id, error)
          }
        }
      }

      if (hasUpdates) {
        setLocationCache(newCache)
      }
    }

    loadLocations()
  }, [confessions])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleDelete = (id) => {
    onDelete(id)
    setShowDeleteConfirm(null)
  }

  const handleReaction = (confessionId, reactionType) => {
    onReaction(confessionId, reactionType)
  }

  const generateNickname = () => {
    const adjectives = ['Moon', 'Star', 'Ocean', 'Forest', 'Sky', 'River', 'Mountain', 'Desert', 'Rainbow', 'Thunder']
    const nouns = ['Wolf', 'Eagle', 'Phoenix', 'Dragon', 'Tiger', 'Lion', 'Bear', 'Fox', 'Owl', 'Butterfly']
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    
    return `${randomAdjective}${randomNoun}`
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilter = (type) => {
    setFilterType(type)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <SearchFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        totalCount={filteredConfessions.length}
      />

      {/* Empty State */}
      {filteredConfessions.length === 0 && confessions.length > 0 && (
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No confessions found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterType('all')
            }}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 btn-press"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* No Confessions State */}
      {confessions.length === 0 && (
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No confessions yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Be the first to share something anonymously. Your secrets are safe here.
          </p>
          <button
            onClick={onAddNew}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 btn-press shadow-lg hover:shadow-xl"
          >
            Share Your First Confession
          </button>
        </div>
      )}

      {/* Confessions List */}
      {filteredConfessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {filterType === 'all' ? 'Recent Confessions' : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Confessions`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredConfessions.length} confession{filteredConfessions.length !== 1 ? 's' : ''} shown
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-target"
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={onAddNew}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-press touch-target shadow-md"
              >
                Add New
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredConfessions.map((confession, index) => (
              <div
                key={confession.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {confession.nickname ? confession.nickname.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {confession.nickname || generateNickname()}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatTimestamp(confession.timestamp)}</span>
                        {confession.location && (
                          <>
                            <span>•</span>
                            <span>
                              {locationCache[confession.id] 
                                ? getLocationDisplay(locationCache[confession.id])
                                : '📍 Loading location...'
                              }
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mood Emoji */}
                  {confession.mood && (
                    <div className="text-2xl" role="img" aria-label={`Mood: ${confession.mood.label}`}>
                      {confession.mood.emoji}
                    </div>
                  )}
                </div>
                
                {/* Message */}
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-base">
                  {confession.message}
                </p>
                
                {/* Reactions */}
                <div className="flex items-center justify-between">
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
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(confession.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 touch-target"
                    aria-label="Delete confession"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-strong">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Confession?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. Your confession will be permanently deleted.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors btn-press touch-target"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors btn-press touch-target"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings 
          confessions={confessions}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default Home
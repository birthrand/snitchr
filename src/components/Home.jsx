import { useState } from 'react'
import ReactionButton from './ReactionButton'

const Home = ({ confessions, onDelete, onAddNew, onReaction }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

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

  const getLocationDisplay = (location) => {
    if (!location) return null
    
    // This would typically use a reverse geocoding service
    // For now, we'll show a generic location indicator
    return '📍 Nearby'
  }

  const generateNickname = () => {
    const adjectives = ['Moon', 'Star', 'Ocean', 'Forest', 'Sky', 'River', 'Mountain', 'Desert', 'Rainbow', 'Thunder']
    const nouns = ['Wolf', 'Eagle', 'Phoenix', 'Dragon', 'Tiger', 'Lion', 'Bear', 'Fox', 'Owl', 'Butterfly']
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    
    return `${randomAdjective}${randomNoun}`
  }

  return (
    <div className="space-y-4">
      {/* Empty State */}
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
      {confessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Confessions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {confessions.length} confession{confessions.length !== 1 ? 's' : ''} shared
              </p>
            </div>
            <button
              onClick={onAddNew}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors btn-press touch-target shadow-md"
            >
              Add New
            </button>
          </div>
          
          <div className="space-y-4">
            {confessions.map((confession, index) => (
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
                            <span>{getLocationDisplay(confession.location)}</span>
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
    </div>
  )
}

export default Home
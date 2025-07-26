import { useState } from 'react'
import { hapticFeedback } from '../utils/haptics'

const REACTIONS = {
  like: {
    emoji: '❤️',
    activeColor: 'text-red-500',
    animation: 'animate-heart-beat'
  },
  laugh: {
    emoji: '😂',
    activeColor: 'text-yellow-500',
    animation: 'animate-bounce-slow'
  },
  wow: {
    emoji: '😮',
    activeColor: 'text-blue-500',
    animation: 'animate-pulse-slow'
  },
  sad: {
    emoji: '😢',
    activeColor: 'text-purple-500',
    animation: 'animate-bounce-slow'
  }
}

const PostInteractions = ({ 
  postId, 
  reactions = {}, 
  commentCount = 0,
  onReaction,
  onComment,
  onShare 
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [isCommenting, setIsCommenting] = useState(false)

  const handleReactionClick = (reactionType) => {
    hapticFeedback.button()
    setSelectedReaction(reactionType)
    onReaction?.(postId, reactionType)
    setShowReactionPicker(false)
  }

  const handleReactionLongPress = (e) => {
    e.preventDefault()
    hapticFeedback.medium()
    setShowReactionPicker(true)
  }

  const handleCommentClick = () => {
    hapticFeedback.button()
    setIsCommenting(true)
    onComment?.(postId)
  }

  const handleShareClick = () => {
    hapticFeedback.button()
    onShare?.(postId)
  }

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0)

  return (
    <div className="px-4 py-2">
      {/* Main Interaction Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* Primary Reaction Button */}
          <button
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={(e) => {
              const timer = setTimeout(() => handleReactionLongPress(e), 500)
              e.target.addEventListener('touchend', () => clearTimeout(timer), { once: true })
            }}
            onClick={() => handleReactionClick('like')}
            className={`relative p-2 rounded-full transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              selectedReaction ? REACTIONS[selectedReaction].activeColor : 'text-gray-500 dark:text-gray-400'
            }`}
            aria-label="React to post"
          >
            <span className={selectedReaction ? REACTIONS[selectedReaction].animation : ''}>
              {selectedReaction ? REACTIONS[selectedReaction].emoji : '❤️'}
            </span>
            
            {/* Reaction Count */}
            {totalReactions > 0 && (
              <span className="ml-1 text-sm font-medium">
                {totalReactions}
              </span>
            )}

            {/* Reaction Picker */}
            {showReactionPicker && (
              <div className="absolute bottom-full left-0 mb-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-1 animate-fade-in-up">
                {Object.entries(REACTIONS).map(([type, { emoji }]) => (
                  <button
                    key={type}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReactionClick(type)
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-transform hover:scale-110 active:scale-95"
                    aria-label={`React with ${type}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </button>

          {/* Comment Button */}
          <button
            onClick={handleCommentClick}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 flex items-center space-x-1"
            aria-label="Comment on post"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {commentCount > 0 && (
              <span className="text-sm font-medium">
                {commentCount}
              </span>
            )}
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Share post"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>

      {/* Comment Section Preview */}
      {commentCount > 0 && (
        <button
          onClick={handleCommentClick}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus-visible:underline"
        >
          View {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </button>
      )}

      {/* Comment Modal */}
      {isCommenting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in-up">
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comments
              </h3>
              <button
                onClick={() => setIsCommenting(false)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full"
                aria-label="Close comments"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  className="p-2 text-primary-500 hover:text-primary-600 rounded-full transition-colors"
                  aria-label="Post comment"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostInteractions 
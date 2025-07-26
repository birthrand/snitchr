import { useState } from 'react'
import { hapticFeedback } from '../utils/haptics'

const Comment = ({ 
  comment, 
  onReply, 
  onLike, 
  depth = 0,
  maxDepth = 3 
}) => {
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const hasReplies = comment.replies?.length > 0
  const canNest = depth < maxDepth

  const handleLike = () => {
    hapticFeedback.button()
    onLike?.(comment.id)
  }

  const handleReply = () => {
    hapticFeedback.button()
    setIsReplying(true)
  }

  const handleSubmitReply = (text) => {
    onReply?.(comment.id, text)
    setIsReplying(false)
  }

  const toggleReplies = () => {
    hapticFeedback.button()
    setShowReplies(!showReplies)
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const commentTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d`
    
    return commentTime.toLocaleDateString()
  }

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-2' : 'mt-4'}`}>
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${comment.color}-400 to-${comment.color}-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
          {comment.author.charAt(0).toUpperCase()}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {comment.author}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mt-1">
              {comment.text}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-1 ml-1">
            <button
              onClick={handleLike}
              className={`text-sm font-medium transition-colors ${
                comment.isLiked 
                  ? 'text-primary-500 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Like {comment.likes > 0 && `· ${comment.likes}`}
            </button>
            {canNest && (
              <button
                onClick={handleReply}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Reply
              </button>
            )}
            {hasReplies && (
              <button
                onClick={toggleReplies}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showReplies ? 'Hide replies' : `Show replies (${comment.replies.length})`}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmitReply(e.target.value)
                    e.target.value = ''
                  }
                }}
              />
              <button
                onClick={() => setIsReplying(false)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Nested Replies */}
          {showReplies && hasReplies && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comment 
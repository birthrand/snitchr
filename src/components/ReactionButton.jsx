import { useState } from 'react'
import { hapticFeedback } from '../utils/haptics'
import { createHeartBurst } from '../utils/confetti'

const ReactionButton = ({ emoji, count = 0, isActive = false, onClick, compact = false }) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsPressed(true)
    hapticFeedback('reaction')
    
    // Create heart burst animation for heart reactions
    if (emoji === '❤️') {
      const rect = e.currentTarget.getBoundingClientRect()
      createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    
    onClick()
    setTimeout(() => setIsPressed(false), 150)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-200 touch-target focus-ring ${
          isActive 
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${isPressed ? 'transform scale-95' : ''}`}
        aria-label={`React with ${emoji} (${count} reactions)`}
        aria-pressed={isActive}
      >
        <span className="text-sm">
          {emoji}
        </span>
        {count > 0 && (
          <span className="font-medium text-xs">
            {count}
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`reaction-btn touch-target focus-ring ${
        isActive 
          ? 'active bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${isPressed ? 'transform scale-95' : ''}`}
      aria-label={`React with ${emoji} (${count} reactions)`}
      aria-pressed={isActive}
    >
      <span className="text-lg transition-transform duration-200 hover:scale-110">
        {emoji}
      </span>
      {count > 0 && (
        <span className="text-sm font-medium transition-all duration-200">
          {count}
        </span>
      )}
    </button>
  )
}

export default ReactionButton
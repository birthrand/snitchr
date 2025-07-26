import { useState } from 'react'

const ReactionButton = ({ emoji, count = 0, isActive = false, onClick }) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    setIsPressed(true)
    onClick()
    setTimeout(() => setIsPressed(false), 150)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`reaction-btn touch-target ${
        isActive 
          ? 'active bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${isPressed ? 'transform scale-95' : ''}`}
      aria-label={`React with ${emoji} (${count} reactions)`}
      aria-pressed={isActive}
    >
      <span className="text-lg">{emoji}</span>
      {count > 0 && (
        <span className="text-sm font-medium">{count}</span>
      )}
    </button>
  )
}

export default ReactionButton
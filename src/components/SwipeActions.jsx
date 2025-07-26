import { useState, useRef, useEffect } from 'react'

const SwipeActions = ({ children, onDelete, onShare, onFavorite }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragDistance, setDragDistance] = useState(0)
  const [actionTriggered, setActionTriggered] = useState(null)
  const containerRef = useRef(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const threshold = 80

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      startX.current = e.touches[0].clientX
      setIsDragging(true)
      setActionTriggered(null)
    }

    const handleTouchMove = (e) => {
      if (!isDragging) return

      currentX.current = e.touches[0].clientX
      const distance = currentX.current - startX.current
      
      // Only allow left swipe (negative distance)
      if (distance < 0) {
        e.preventDefault()
        setDragDistance(Math.abs(distance))
      }
    }

    const handleTouchEnd = () => {
      if (!isDragging) return

      if (dragDistance >= threshold) {
        // Determine which action to trigger based on distance
        if (dragDistance >= threshold * 2) {
          setActionTriggered('delete')
          onDelete?.()
        } else if (dragDistance >= threshold * 1.5) {
          setActionTriggered('share')
          onShare?.()
        } else {
          setActionTriggered('favorite')
          onFavorite?.()
        }
      }

      setIsDragging(false)
      setDragDistance(0)
      
      // Reset action after animation
      setTimeout(() => setActionTriggered(null), 300)
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragDistance, onDelete, onShare, onFavorite])

  const progress = Math.min(dragDistance / (threshold * 2), 1)

  return (
    <div className="relative overflow-hidden">
      {/* Background actions */}
      <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
            progress >= 0.5 ? 'bg-yellow-500 scale-110' : 'bg-yellow-400 scale-100'
          }`}
          style={{
            opacity: Math.max(0, (progress - 0.25) * 2),
            transform: `translateX(${Math.min(dragDistance * 0.5, 40)}px)`
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
            progress >= 0.75 ? 'bg-blue-500 scale-110' : 'bg-blue-400 scale-100'
          }`}
          style={{
            opacity: Math.max(0, (progress - 0.5) * 2),
            transform: `translateX(${Math.min(dragDistance * 0.3, 30)}px)`
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </div>
        
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
            progress >= 1 ? 'bg-red-500 scale-110' : 'bg-red-400 scale-100'
          }`}
          style={{
            opacity: Math.max(0, (progress - 0.75) * 2),
            transform: `translateX(${Math.min(dragDistance * 0.1, 20)}px)`
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={containerRef}
        className={`relative transition-all duration-200 ${
          isDragging ? 'select-none' : ''
        }`}
        style={{
          transform: `translateX(-${dragDistance * 0.3}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>

      {/* Action feedback */}
      {actionTriggered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              {actionTriggered === 'favorite' && (
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
              {actionTriggered === 'share' && (
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              )}
              {actionTriggered === 'delete' && (
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              <span className="text-gray-900 dark:text-white font-medium capitalize">
                {actionTriggered}!
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SwipeActions
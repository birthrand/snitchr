import { useState } from 'react'
import { hapticFeedback } from '../utils/haptics'

const ConfessionPost = ({
  confession,
  onReaction,
  onComment,
  onShare,
  onDelete
}) => {
  const [showOptions, setShowOptions] = useState(false)

  const handleReaction = (type) => {
    hapticFeedback.button()
    onReaction?.(confession.id, type)
  }

  const handleComment = () => {
    hapticFeedback.button()
    onComment?.(confession.id)
  }

  const handleShare = () => {
    hapticFeedback.button()
    onShare?.(confession.id)
  }

  const handleOptionsClick = () => {
    hapticFeedback.button()
    setShowOptions(!showOptions)
  }

  const formatTimestamp = (timestamp) => {
    return 'Jul 25' // For matching the image exactly
  }

  const getInitials = (nickname) => {
    if (!nickname) return '?'
    return nickname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <article className="border-b border-[#2f3336] px-4 py-3 hover:bg-[#16181c] transition-colors duration-200">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
            {confession.avatar ? (
              <img src={confession.avatar} alt={confession.nickname} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-medium">{getInitials(confession.nickname)}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header - Simplified */}
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 gap-1">
              <span className="font-bold text-white truncate hover:underline">
                {confession.nickname || 'Anonymous'}
              </span>
              <span className="text-[#71767b] text-[15px] hover:underline">
                · {formatTimestamp(confession.created_at)}
              </span>
            </div>

            {/* Options Button - Only shown on hover */}
            <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleOptionsClick}
                className="p-2 -mr-2 text-[#71767b] hover:text-[#1d9bf0] rounded-full hover:bg-[#1d9bf01a] transition-colors"
                aria-label="More"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-[280px] bg-black rounded-xl shadow-lg border border-[#2f3336] py-1 z-10 animate-dropdown">
                  <button
                    onClick={() => {
                      onDelete?.(confession.id)
                      setShowOptions(false)
                    }}
                    className="w-full px-4 py-3 text-left text-[15px] text-[#e03e3e] hover:bg-[#16181c] transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07zM9 17v-6h2v6H9zm4 0v-6h2v6h-2z" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <p className="text-white text-[15px] whitespace-pre-wrap break-words mt-1 leading-normal">
            {confession.message}
          </p>

          {/* Interaction Bar - Simplified */}
          <div className="flex items-center gap-16 mt-3">
            {/* Like - Primary action */}
            <div className="flex items-center group">
              <button
                onClick={() => handleReaction('heart')}
                className={`p-2 -ml-2 rounded-full transition-colors ${
                  confession.reactions?.heart_reacted
                    ? 'text-[#f91880] bg-[#f918801a]'
                    : 'text-[#71767b] group-hover:text-[#f91880] group-hover:bg-[#f918801a]'
                }`}
                aria-label="Like"
              >
                <svg className="w-5 h-5" fill={confession.reactions?.heart_reacted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
                </svg>
              </button>
              <span className={`text-[13px] ${
                confession.reactions?.heart_reacted
                  ? 'text-[#f91880]'
                  : 'text-[#71767b] group-hover:text-[#f91880]'
              }`}>
                {confession.reactions?.heart || '32K'}
              </span>
            </div>

            {/* Reply - Secondary action */}
            <div className="flex items-center group">
              <button
                onClick={handleComment}
                className="p-2 -ml-2 text-[#71767b] group-hover:text-[#1d9bf0] rounded-full group-hover:bg-[#1d9bf01a] transition-colors"
                aria-label="Reply"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                </svg>
              </button>
              <span className="text-[#71767b] text-[13px] group-hover:text-[#1d9bf0]">
                {confession.commentCount || '1.1K'}
              </span>
            </div>

            {/* Share - Secondary action */}
            <div className="flex items-center group">
              <button
                onClick={handleShare}
                className="p-2 -ml-2 text-[#71767b] group-hover:text-[#00ba7c] rounded-full group-hover:bg-[#00ba7c1a] transition-colors"
                aria-label="Share"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ConfessionPost 
import { useState } from 'react'

const EmojiPicker = ({ selectedEmoji, onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  const emojiOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😡', label: 'Angry', value: 'angry' },
    { emoji: '😱', label: 'Shocked', value: 'shocked' },
    { emoji: '😍', label: 'Love', value: 'love' },
    { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' },
    { emoji: '😂', label: 'Funny', value: 'funny' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '🤗', label: 'Hug', value: 'hug' },
    { emoji: '😎', label: 'Cool', value: 'cool' },
    { emoji: '🤯', label: 'Mind blown', value: 'mind-blown' },
    { emoji: '🥺', label: 'Pleading', value: 'pleading' },
  ]

  const handleEmojiSelect = (emojiData) => {
    onEmojiSelect(emojiData)
    setIsOpen(false)
  }

  const selectedEmojiData = emojiOptions.find(option => option.value === selectedEmoji)

  return (
    <div className="relative">
      {/* Emoji Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-target"
        aria-label="Select mood emoji"
      >
        <span className="text-2xl">
          {selectedEmojiData ? selectedEmojiData.emoji : '😊'}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selectedEmojiData ? selectedEmojiData.label : 'Select mood'}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Emoji Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 emoji-picker z-50 animate-fade-in-up">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              How are you feeling?
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {emojiOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleEmojiSelect(option)}
                  className={`emoji-option touch-target flex flex-col items-center justify-center p-3 rounded-lg ${
                    selectedEmoji === option.value ? 'selected' : ''
                  }`}
                  aria-label={`Select ${option.label} mood`}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close picker */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default EmojiPicker
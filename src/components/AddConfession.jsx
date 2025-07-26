import { useState, useEffect } from 'react'
import EmojiPicker from './EmojiPicker'
import { getCachedLocation } from '../utils/geocoding'

const AddConfession = ({ onAdd, onCancel }) => {
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [selectedMood, setSelectedMood] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [errors, setErrors] = useState({})

  // Get geolocation on component mount
  /*
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setLocation(coords)
          
          // Get location name
          try {
            const locationData = await getCachedLocation(coords.latitude, coords.longitude)
            if (locationData) {
              setLocationName(locationData)
            }
          } catch (error) {
            console.error('Error getting location name:', error)
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLocationError('Location access denied or unavailable')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    } else {
      setLocationError('Geolocation not supported by this browser')
    }
  }, [])
  */

  const validateForm = () => {
    const newErrors = {}

    if (!message.trim()) {
      newErrors.message = 'Confession message is required'
    } else if (message.trim().length > 280) {
      newErrors.message = 'Message must be 280 characters or less'
    }

    if (nickname.trim() && nickname.trim().length < 2) {
      newErrors.nickname = 'Nickname must be at least 2 characters'
    } else if (nickname.trim().length > 20) {
      newErrors.nickname = 'Nickname must be less than 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newConfession = {
        nickname: nickname.trim() || null,
        message: message.trim(),
        location: location,
        mood: selectedMood,
        reactions: {
          heart: 0,
          laugh: 0,
          think: 0
        }
      }

      onAdd(newConfession)
    } catch (error) {
      console.error('Error adding confession:', error)
      setErrors({ submit: 'Failed to add confession. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = message.length
  const isOverLimit = characterCount > 280
  const canSubmit = message.trim().length > 0 && !isOverLimit && !isSubmitting

  return (
    <div className="space-y-4 animate-slide-in-right">
      {/* Header with X button */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Confession</h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-target"
          aria-label="Cancel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Message Input */}
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base mobile-input ${
              errors.message ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
            }`}
            placeholder="Share your anonymous confession here..."
            maxLength={280}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-2">
            {errors.message && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
            )}
            <span className={`text-xs font-medium ml-auto ${
              isOverLimit ? 'text-red-500' : characterCount > 250 ? 'text-yellow-500' : 'text-gray-400'
            }`}>
              {characterCount}/280
            </span>
          </div>
        </div>

        {/* Mood Picker - Compact */}
        <div>
          <EmojiPicker 
            selectedEmoji={selectedMood?.value} 
            onEmojiSelect={setSelectedMood} 
          />
        </div>

        {/* Nickname Input - Compact */}
        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base mobile-input ${
              errors.nickname ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
            }`}
            placeholder="Nickname (optional)"
            maxLength={20}
            disabled={isSubmitting}
          />
          {errors.nickname && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nickname}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Submit Button - Full Width */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 btn-press touch-target shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Posting...</span>
            </div>
          ) : (
            'Post Confession'
          )}
        </button>
      </form>
    </div>
  )
}

export default AddConfession
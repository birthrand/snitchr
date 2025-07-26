import { useState, useEffect } from 'react'
import EmojiPicker from './EmojiPicker'

const AddConfession = ({ onAdd, onCancel }) => {
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [selectedMood, setSelectedMood] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [errors, setErrors] = useState({})

  // Get geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
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
        id: Date.now().toString(),
        nickname: nickname.trim() || null,
        message: message.trim(),
        timestamp: new Date().toISOString(),
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
    <div className="space-y-6 animate-slide-in-right">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Share Your Confession</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Share something anonymously. Your identity will remain private.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message Input */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Your Confession *
          </label>
          <div className="relative">
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.message ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
              }`}
              placeholder="Share your anonymous confession here..."
              maxLength={280}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-3 right-3">
              <span className={`text-sm font-medium ${
                isOverLimit ? 'text-red-500' : characterCount > 250 ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {characterCount}/280
              </span>
            </div>
          </div>
          {errors.message && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
          )}
        </div>

        {/* Mood Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            How are you feeling? (Optional)
          </label>
          <EmojiPicker 
            selectedEmoji={selectedMood?.value} 
            onEmojiSelect={setSelectedMood} 
          />
        </div>

        {/* Nickname Input */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Nickname (Optional)
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.nickname ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
            }`}
            placeholder="Choose a nickname (2-20 characters) or leave blank for anonymous"
            maxLength={20}
            disabled={isSubmitting}
          />
          {errors.nickname && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.nickname}</p>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Leave blank to remain completely anonymous
          </p>
        </div>

        {/* Location Status */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              location ? 'bg-success-500' : locationError ? 'bg-error-500' : 'bg-warning-500 animate-pulse-slow'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {location ? 'Location detected' : locationError ? 'Location unavailable' : 'Detecting location...'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {location 
                  ? 'Your confession will be tagged with your approximate location'
                  : locationError || 'This helps others know where confessions are shared from'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-error-50 dark:bg-error-900 border border-error-200 dark:border-error-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-error-500 dark:text-error-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-error-600 dark:text-error-400">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium btn-press touch-target"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 px-6 py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 btn-press touch-target shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Posting...</span>
              </div>
            ) : (
              'Post Confession'
            )}
          </button>
        </div>
      </form>

      {/* Privacy Notice */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Privacy & Anonymity</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Your confessions are stored locally on your device. We don't collect or store any personal information. 
              Your nickname and location data remain private and are only visible to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddConfession
// Haptic feedback utility for mobile interactions
// Provides tactile feedback for better user experience

class HapticFeedback {
  constructor() {
    this.isSupported = this.checkSupport()
  }

  checkSupport() {
    return 'vibrate' in navigator || 'navigator' in window && 'vibrate' in navigator
  }

  // Light haptic feedback for button presses
  light() {
    if (this.isSupported) {
      try {
        navigator.vibrate(10)
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }

  // Medium haptic feedback for important actions
  medium() {
    if (this.isSupported) {
      try {
        navigator.vibrate(20)
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }

  // Heavy haptic feedback for critical actions
  heavy() {
    if (this.isSupported) {
      try {
        navigator.vibrate(30)
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }

  // Success pattern
  success() {
    if (this.isSupported) {
      try {
        navigator.vibrate([10, 50, 10])
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }

  // Error pattern
  error() {
    if (this.isSupported) {
      try {
        navigator.vibrate([20, 50, 20, 50, 20])
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }

  // Warning pattern
  warning() {
    if (this.isSupported) {
      try {
        navigator.vibrate([15, 30, 15])
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }

  // Custom pattern
  pattern(pattern) {
    if (this.isSupported && Array.isArray(pattern)) {
      try {
        navigator.vibrate(pattern)
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
      }
    }
  }
}

// Create singleton instance
const haptics = new HapticFeedback()

// Haptic feedback hooks for common interactions
export const hapticFeedback = {
  // Button press
  button: () => haptics.light(),
  
  // Form submission
  submit: () => haptics.success(),
  
  // Error state
  error: () => haptics.error(),
  
  // Warning state
  warning: () => haptics.warning(),
  
  // Delete action
  delete: () => haptics.heavy(),
  
  // Success action
  success: () => haptics.success(),
  
  // Navigation
  navigate: () => haptics.medium(),
  
  // Toggle
  toggle: () => haptics.light(),
  
  // Swipe
  swipe: () => haptics.medium(),
  
  // Pull to refresh
  pull: () => haptics.light(),
  
  // Reaction
  reaction: () => haptics.light(),
  
  // Custom
  custom: (pattern) => haptics.pattern(pattern)
}

export default haptics
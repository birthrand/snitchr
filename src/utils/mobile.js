// Mobile-specific utilities for Snitchr

/**
 * Check if the device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
};

/**
 * Check if the device supports touch
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get device pixel ratio for high-DPI displays
 * @returns {number}
 */
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

/**
 * Check if the device is in landscape mode
 * @returns {boolean}
 */
export const isLandscape = () => {
  return window.innerWidth > window.innerHeight;
};

/**
 * Get viewport dimensions
 * @returns {{width: number, height: number}}
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

/**
 * Get safe area insets for devices with notches
 * @returns {{top: number, bottom: number, left: number, right: number}}
 */
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0')
  };
};

/**
 * Set viewport meta tag for mobile optimization
 */
export const setViewportMeta = () => {
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  
  // Optimize for mobile
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
};

/**
 * Handle mobile keyboard events
 * @param {Function} callback - Callback to execute when keyboard shows/hides
 */
export const handleMobileKeyboard = (callback) => {
  let initialViewportHeight = window.innerHeight;
  
  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;
    
    if (heightDifference > 150) {
      // Keyboard is likely visible
      callback('show');
    } else if (heightDifference < 50) {
      // Keyboard is likely hidden
      callback('hide');
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

/**
 * Prevent zoom on input focus (iOS)
 * @param {HTMLElement} element - The input element
 */
export const preventZoomOnFocus = (element) => {
  if (isMobile()) {
    element.addEventListener('focus', () => {
      element.style.fontSize = '16px';
    });
    
    element.addEventListener('blur', () => {
      element.style.fontSize = '';
    });
  }
};

/**
 * Handle mobile gesture detection
 * @param {HTMLElement} element - The element to detect gestures on
 * @param {Object} options - Gesture options
 */
export const detectGestures = (element, options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500
  } = options;
  
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let longPressTimer = null;
  let isLongPress = false;
  
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    isLongPress = false;
    
    // Start long press timer
    longPressTimer = setTimeout(() => {
      isLongPress = true;
      onLongPress && onLongPress(e);
    }, longPressDelay);
  };
  
  const handleTouchMove = (e) => {
    // Clear long press timer if user moves
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  };
  
  const handleTouchEnd = (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    
    if (isLongPress) return;
    
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = Date.now() - startTime;
    
    // Check if it's a tap (short duration, small movement)
    if (deltaTime < 300 && Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
      onTap && onTap(e);
      return;
    }
    
    // Check for swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        onSwipeRight && onSwipeRight(e);
      } else if (deltaX < -threshold) {
        onSwipeLeft && onSwipeLeft(e);
      }
    } else {
      if (deltaY > threshold) {
        onSwipeDown && onSwipeDown(e);
      } else if (deltaY < -threshold) {
        onSwipeUp && onSwipeUp(e);
      }
    }
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: false });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };
};

/**
 * Optimize images for mobile devices
 * @param {string} src - Image source
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string} - Optimized image URL
 */
export const optimizeImageForMobile = (src, width, height) => {
  if (!src) return src;
  
  // Add mobile-specific parameters
  const url = new URL(src);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('h', height.toString());
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('dpr', getDevicePixelRatio().toString());
  
  return url.toString();
};

/**
 * Handle mobile orientation changes
 * @param {Function} callback - Callback to execute on orientation change
 */
export const handleOrientationChange = (callback) => {
  const handleChange = () => {
    const orientation = isLandscape() ? 'landscape' : 'portrait';
    callback(orientation);
  };
  
  window.addEventListener('orientationchange', handleChange);
  window.addEventListener('resize', handleChange);
  
  return () => {
    window.removeEventListener('orientationchange', handleChange);
    window.removeEventListener('resize', handleChange);
  };
};

/**
 * Check if the app is running as a PWA
 * @returns {boolean}
 */
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

/**
 * Request notification permission for mobile
 * @returns {Promise<boolean>}
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/**
 * Vibrate device if supported
 * @param {number|Array} pattern - Vibration pattern
 */
export const vibrate = (pattern = 100) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Get mobile device info
 * @returns {Object} Device information
 */
export const getMobileDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const cookieEnabled = navigator.cookieEnabled;
  const onLine = navigator.onLine;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    userAgent,
    platform,
    language,
    cookieEnabled,
    onLine,
    connection: connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    } : null,
    isMobile: isMobile(),
    isTouch: isTouchDevice(),
    isPWA: isPWA(),
    pixelRatio: getDevicePixelRatio(),
    viewport: getViewportDimensions(),
    safeArea: getSafeAreaInsets()
  };
};

export default {
  isMobile,
  isTouchDevice,
  getDevicePixelRatio,
  isLandscape,
  getViewportDimensions,
  getSafeAreaInsets,
  setViewportMeta,
  handleMobileKeyboard,
  preventZoomOnFocus,
  detectGestures,
  optimizeImageForMobile,
  handleOrientationChange,
  isPWA,
  requestNotificationPermission,
  vibrate,
  getMobileDeviceInfo
}; 
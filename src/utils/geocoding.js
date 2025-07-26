/**
 * Get city name from coordinates using OpenStreetMap Nominatim API
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Promise<string>} The city name
 */
export const getCityFromCoordinates = async (latitude, longitude) => {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
      {
        headers: {
          'User-Agent': 'Snitchr/1.0',
          'Accept-Language': 'en'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();

    // Extract city name from address components
    const city = data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.suburb ||
                data.address?.municipality ||
                'Unknown location';

    return city;
  } catch (error) {
    console.error('Error getting city name:', error);
    return 'Unknown location';
  }
};

// Cache for storing geocoding results
const geocodingCache = new Map();

/**
 * Get cached location data from coordinates
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Promise<{name: string, fullAddress: string, country: string, state: string, city: string}>} Location data
 */
export const getCachedLocation = async (latitude, longitude) => {
  // Round coordinates to 4 decimal places for cache key
  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Check cache first
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Snitchr/1.0',
          'Accept-Language': 'en'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    const address = data.address || {};

    // Create location object
    const location = {
      name: address.city || 
            address.town || 
            address.village || 
            address.suburb || 
            address.municipality || 
            'Unknown location',
      fullAddress: data.display_name,
      country: address.country,
      state: address.state,
      city: address.city || address.town || address.village
    };

    // Cache the result
    geocodingCache.set(cacheKey, location);

    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      name: 'Unknown location',
      fullAddress: '',
      country: '',
      state: '',
      city: ''
    };
  }
};

/**
 * Get approximate coordinates from browser geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>} The coordinates
 */
export const getCurrentCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      },
      {
        enableHighAccuracy: false, // Use lower accuracy for privacy
        timeout: 5000,
        maximumAge: 300000 // Cache location for 5 minutes
      }
    );
  });
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
const toRad = (degrees) => {
  return degrees * Math.PI / 180;
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance)}km`;
};
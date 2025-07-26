// Reverse geocoding utility using OpenStreetMap Nominatim API
// This is free and doesn't require an API key for reasonable usage

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse'

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const url = `${NOMINATIM_BASE_URL}?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Snitchr/1.0 (Anonymous Confessions App)'
      }
    })
    
    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }
    
    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    // Extract location information
    const address = data.address || {}
    
    // Try to get the most specific location name
    let locationName = ''
    
    if (address.city) {
      locationName = address.city
    } else if (address.town) {
      locationName = address.town
    } else if (address.village) {
      locationName = address.village
    } else if (address.suburb) {
      locationName = address.suburb
    } else if (address.county) {
      locationName = address.county
    } else if (address.state) {
      locationName = address.state
    } else if (address.country) {
      locationName = address.country
    }
    
    return {
      name: locationName,
      fullAddress: data.display_name,
      country: address.country,
      state: address.state,
      city: address.city || address.town || address.village
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

// Cache geocoding results to avoid repeated API calls
const geocodingCache = new Map()

export const getCachedLocation = async (latitude, longitude) => {
  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`
  
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey)
  }
  
  const location = await reverseGeocode(latitude, longitude)
  
  if (location) {
    geocodingCache.set(cacheKey, location)
  }
  
  return location
}

// Get a user-friendly location display
export const getLocationDisplay = (location) => {
  if (!location) return null
  
  if (location.name) {
    return `📍 ${location.name}`
  }
  
  return '📍 Nearby'
}
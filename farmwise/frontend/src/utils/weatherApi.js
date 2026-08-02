import axios from 'axios'

const CACHE_KEY = 'farmwise_weather_cache'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

export const friendlyDescription = (code, isDay) => {
  const descriptions = {
    0: isDay ? 'Clear Sky' : 'Clear Night',
    1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Freezing Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snowfall', 75: 'Heavy Snow', 77: 'Snow Grains',
    80: 'Light Rain Showers', 81: 'Rain Showers', 82: 'Heavy Rain Showers',
    85: 'Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail',
  }
  return descriptions[code] || 'Unknown'
}

export function getCachedWeather() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function setCachedWeather(bundle) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...bundle, timestamp: Date.now() }))
  } catch {
    // storage full or unavailable, ignore
  }
}

// Fetches weather + AI tips together in one bundle and caches it.
export async function fetchWeatherBundle(lat, lon, displayName) {
  const weatherRes = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`
  )
  const data = weatherRes.data

  let tips = [
    'Check your soil moisture before watering today.',
    'Avoid spraying pesticides if it looks like rain is coming.',
    'Make sure your drainage channels are clear.',
  ]
  try {
    const tipRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/farming-tip`, {
      description: friendlyDescription(data.current.weather_code, data.current.is_day),
      temp: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      wind: Math.round(data.current.wind_speed_10m),
      city: displayName,
    })
    if (tipRes.data.tips && Array.isArray(tipRes.data.tips)) {
      tips = tipRes.data.tips
    }
  } catch (e) {
    console.error('Tip error', e)
  }

  const bundle = { lat, lon, locationName: displayName, current: data.current, daily: data.daily, tips }
  setCachedWeather(bundle)
  return bundle
}

// Browser geolocation -> reverse geocode -> weather bundle, with a fallback callback.
export function resolveLocationAndFetch(onSuccess, onFallback = () => {}) {
  if (!('geolocation' in navigator)) {
    onFallback()
    return
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords
    try {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const name = geoRes.data.address?.city || geoRes.data.address?.town || geoRes.data.address?.village || 'Your Location'
      onSuccess(await fetchWeatherBundle(latitude, longitude, name))
    } catch {
      onSuccess(await fetchWeatherBundle(latitude, longitude, 'Your Location'))
    }
  }, onFallback)
}

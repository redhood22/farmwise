import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const friendlyDescription = (code, isDay) => {
  const descriptions = {
    0: isDay ? 'Clear Sky' : 'Clear Night',
    1: 'Mostly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Freezing Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Light Snow',
    73: 'Snowfall',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Rain Showers',
    81: 'Rain Showers',
    82: 'Heavy Rain Showers',
    85: 'Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Heavy Hail',
  }
  return descriptions[code] || 'Unknown'
}

const getWeatherCategory = (code) => {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2 || code === 3) return 'cloudy'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'rain'
  if (code >= 95) return 'storm'
  return 'cloudy'
}

const getDayName = (dateStr) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date(dateStr).getDay()]
}

const WeatherIcon = ({ code, size = 24 }) => {
  const category = getWeatherCategory(code)
  const s = size
  if (category === 'rain')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke="#378ADD" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 19v2M12 19v2M16 19v2" stroke="#378ADD" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  if (category === 'storm')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M19 16.9A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" stroke="#854F0B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M13 11l-4 6h6l-4 6" stroke="#EF9F27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  if (category === 'cloudy')
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="#EF9F27" strokeWidth="2"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#EF9F27" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function Weather() {
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState([])
  const [locationName, setLocationName] = useState('')
  const [loading, setLoading] = useState(true)
  const [aiTip, setAiTip] = useState('')
  const [tipLoading, setTipLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (lat, lon, displayName) => {
    setLoading(true)
    setError('')
    setAiTip('')
    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`
      )

      const data = weatherRes.data
      setCurrent(data.current)
      setForecast(data.daily)
      setLocationName(displayName)

      // Get AI tip
      setTipLoading(true)
      try {
        const tipRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/farming-tip`, {
          description: friendlyDescription(data.current.weather_code, data.current.is_day),
          temp: Math.round(data.current.temperature_2m),
          feelsLike: Math.round(data.current.apparent_temperature),
          humidity: data.current.relative_humidity_2m,
          wind: Math.round(data.current.wind_speed_10m),
          city: displayName,
        })
        setAiTip(tipRes.data.tip)
      } catch {
        setAiTip('Check local conditions before major farming activities today.')
      } finally {
        setTipLoading(false)
      }

    } catch {
      setError('Could not fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const geocodeAndFetch = async (searchQuery) => {
    setLoading(true)
    setError('')
    try {
      // Use Nominatim (OpenStreetMap) — knows every Nigerian town
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      if (!geoRes.data.length) {
        setError('Location not found. Try adding the state e.g. "Karu, Nasarawa"')
        setLoading(false)
        return
      }
      const { lat, lon, display_name } = geoRes.data[0]
      const shortName = display_name.split(',').slice(0, 2).join(',')
      await fetchWeather(parseFloat(lat), parseFloat(lon), shortName)
    } catch {
      setError('Could not find that location. Please try again.')
      setLoading(false)
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const name = geoRes.data.address?.city ||
            geoRes.data.address?.town ||
            geoRes.data.address?.village ||
            'Your Location'
          await fetchWeather(latitude, longitude, name)
        } catch {
          await fetchWeather(latitude, longitude, 'Your Location')
        }
      },
      () => geocodeAndFetch('Abuja, Nigeria')
    )
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) geocodeAndFetch(query.trim())
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans">
      <div className="px-6 pt-8 pb-4 max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#854F0B] hover:text-[#412402] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back to home
        </Link>
      </div>

      <div className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-[#412402] tracking-tight mb-1">Weather Forecast</h1>
          <p className="text-sm text-[#854F0B]">Hyperlocal forecasts tailored for your farm</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#854F0B]" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any city, town or village..."
              className="w-full bg-white border border-[#FAC775]/50 rounded-full pl-10 pr-4 py-3 text-sm text-[#412402] placeholder-[#854F0B]/50 focus:outline-none focus:border-[#BA7517] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-[#412402] text-[#FAEEDA] text-sm px-6 py-3 rounded-full hover:bg-[#633806] active:scale-95 transition-all duration-200"
          >
            Search
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-[#FAC775] border-t-[#BA7517] rounded-full animate-spin"/>
            <p className="text-sm text-[#854F0B]">Fetching weather data...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Current Weather */}
        {current && !loading && (
          <>
            <div className="bg-white border border-[#FAC775]/40 rounded-3xl p-6 mb-4">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-[#854F0B] mb-1 uppercase tracking-widest">Current weather</p>
                  <h2 className="text-xl font-medium text-[#412402]">{locationName}</h2>
                  <p className="text-sm text-[#854F0B] mt-0.5">
                    {friendlyDescription(current.weather_code, current.is_day)}
                  </p>
                </div>
                <WeatherIcon code={current.weather_code} size={48}/>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <span className="text-7xl font-medium text-[#412402] leading-none">
                  {Math.round(current.temperature_2m)}°
                </span>
                <span className="text-2xl text-[#854F0B] mb-2">C</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Feels like', value: `${Math.round(current.apparent_temperature)}°C` },
                  { label: 'Humidity', value: `${current.relative_humidity_2m}%` },
                  { label: 'Wind', value: `${Math.round(current.wind_speed_10m)} km/h` },
                  { label: 'Min today', value: `${Math.round(forecast.temperature_2m_min[0])}°C` },
                  { label: 'Max today', value: `${Math.round(forecast.temperature_2m_max[0])}°C` },
                  { label: 'Pressure', value: `${Math.round(current.pressure_msl)} hPa` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#FFFBF5] rounded-2xl p-3">
                    <p className="text-xs text-[#854F0B] mb-1">{label}</p>
                    <p className="text-sm font-medium text-[#412402]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Farming Tip */}
            <div className="bg-[#FAEEDA] border border-[#FAC775] rounded-2xl p-4 mb-4 flex items-start gap-3">
              <div className="w-7 h-7 bg-[#BA7517] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22V12M12 12C12 7 7 4 2 5c0 5 3 9 10 7M12 12c0-5 5-8 10-7-1 5-4 9-10 7" stroke="#FAEEDA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest mb-1 text-[#BA7517]">AI Farming Tip</p>
                {tipLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FAC775] border-t-[#BA7517] rounded-full animate-spin"/>
                    <p className="text-sm text-[#854F0B]">Getting personalised tip...</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#633806] leading-relaxed">{aiTip}</p>
                )}
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white border border-[#FAC775]/40 rounded-3xl p-6">
              <p className="text-xs text-[#854F0B] uppercase tracking-widest mb-4">5-day forecast</p>
              <div className="flex flex-col gap-3">
                {forecast.time?.slice(1, 6).map((date, i) => (
                  <div key={date} className="flex items-center justify-between py-2 border-b border-[#FAC775]/20 last:border-0">
                    <span className="text-sm font-medium text-[#412402] w-12">{getDayName(date)}</span>
                    <WeatherIcon code={forecast.weather_code[i + 1]} size={20}/>
                    <span className="text-xs text-[#854F0B] capitalize flex-1 text-center">
                      {friendlyDescription(forecast.weather_code[i + 1], true)}
                    </span>
                    <span className="text-sm font-medium text-[#412402]">
                      {Math.round(forecast.temperature_2m_max[i + 1])}° / {Math.round(forecast.temperature_2m_min[i + 1])}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Weather
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

const CROPS = [
  { id: "maize",     label: "Maize",     emoji: "🌽" },
  { id: "tomato",    label: "Tomato",    emoji: "🍅" },
  { id: "pepper",    label: "Pepper",    emoji: "🫑" },
  { id: "potato",    label: "Potato",    emoji: "🥔" },
  { id: "groundnut", label: "Groundnut", emoji: "🥜" },
];

export default function QuickActionHub() {
  const [activeTab, setActiveTab] = useState('diagnose') // 'diagnose' or 'weather'
  const [step, setStep] = useState(1) // 1: Upload, 2: Select/Analyze, 3: Result
  const [selectedCrop, setSelectedCrop] = useState("maize")
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // 1. Handle Quick Diagnose Flow
  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://farmwise-production.up.railway.app/api/detect-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview, crop: selectedCrop }),
      });
      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewFullDiagnosis = () => {
    // Pass everything through router state instead of session storage for better reliability
    navigate('/crop-health', { 
      state: { 
        image: imagePreview, 
        crop: selectedCrop,
        result: result // Pass the result directly to skip re-analysis
      } 
    });
  };

  const resetDiagnose = () => {
    setImagePreview(null);
    setResult(null);
    setStep(1);
  };

  // 2. Weather Advisory with Geolocation
  useEffect(() => {
    if (activeTab === 'weather' && !weatherData) {
      setLoading(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // Get City Name
              const geoRes = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                { headers: { 'Accept-Language': 'en' } }
              );
              const city = geoRes.data.address?.city || geoRes.data.address?.town || geoRes.data.address?.village || 'Your Location';
              
              // Get Weather
              const weatherRes = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day,relative_humidity_2m,wind_speed_10m&timezone=auto`
              );
              
              const current = weatherRes.data.current;
              
              // Get AI tip
              let tip = "Maintain steady irrigation for your crops.";
              try {
                const tipRes = await axios.post('https://farmwise-production.up.railway.app/api/farming-tip', {
                  description: friendlyDescription(current.weather_code, current.is_day),
                  temp: Math.round(current.temperature_2m),
                  humidity: current.relative_humidity_2m,
                  wind: Math.round(current.wind_speed_10m),
                  city: city,
                });
                tip = tipRes.data.tip;
              } catch (e) { console.error("Tip error", e); }

              setWeatherData({
                city: city,
                temp: Math.round(current.temperature_2m),
                condition: friendlyDescription(current.weather_code, current.is_day),
                humidity: current.relative_humidity_2m,
                wind: Math.round(current.wind_speed_10m),
                tip: tip
              });
            } catch (err) {
              console.error(err);
              // Fallback
              setWeatherData({ city: "Kano", temp: 32, condition: "Sunny", tip: "Ensure your crops have enough water.", humidity: 40, wind: 10 });
            } finally {
              setLoading(false);
            }
          },
          () => {
            // Fallback to Kano if permission denied
            setWeatherData({ city: "Kano", temp: 32, condition: "Sunny", tip: "Ensure your crops have enough water.", humidity: 40, wind: 10 });
            setLoading(false);
          }
        );
      } else {
        setWeatherData({ city: "Kano", temp: 32, condition: "Sunny", tip: "Ensure your crops have enough water.", humidity: 40, wind: 10 });
        setLoading(false);
      }
    }
  }, [activeTab, weatherData]);

  const loadingWeather = activeTab === 'weather' && !weatherData && loading;

  return (
    <div id="quick-hub" className="w-full max-w-xl mx-auto bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[2.5rem] p-5 shadow-2xl shadow-[#BA7517]/5 relative overflow-hidden transition-all duration-500 hover:shadow-BA7517/10">
      
      {/* Tab Nav */}
      <div className="flex bg-[#F5EDD8]/50 rounded-full p-1.5 mb-8 relative z-10">
        <button 
          onClick={() => setActiveTab('diagnose')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${activeTab === 'diagnose' ? 'bg-[#412402] text-[#FAEEDA] shadow-xl' : 'text-[#854F0B] hover:bg-[#FAC775]/20'}`}
        >
          Diagnose Crop
        </button>
        <button 
          onClick={() => setActiveTab('weather')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${activeTab === 'weather' ? 'bg-[#412402] text-[#FAEEDA] shadow-xl' : 'text-[#854F0B] hover:bg-[#FAC775]/20'}`}
        >
          Check Weather
        </button>
      </div>

      <div className="relative z-10 px-2 pb-2 min-h-[240px] flex flex-col justify-center">

        {activeTab === 'diagnose' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {step === 1 && (
              <div 
                className="w-full border-2 border-dashed border-[#D4B896] hover:border-[#BA7517] rounded-3xl p-8 text-center transition-all bg-white/30 group"
              >
                <div className="mb-6 flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
                  <div className="bg-[#FAEEDA] p-4 rounded-2xl mb-4 shadow-sm">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#BA7517]">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h4 className="text-[#412402] font-bold text-xl mb-1">Diagnose your crop</h4>
                  <p className="text-[#854F0B] text-sm opacity-80">Pick a tool below to begin</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                   <button 
                     onClick={() => fileInputRef.current.click()}
                     className="flex-1 bg-[#412402] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#633806] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#412402]/10"
                   >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Upload Photo
                   </button>
                   <button 
                     onClick={() => { const camInput = document.createElement('input'); camInput.type='file'; camInput.accept='image/*'; camInput.capture='environment'; camInput.onchange=(evt)=>handleFile(evt.target.files[0]); camInput.click(); }}
                     className="flex-1 bg-white text-[#412402] border border-[#F0E6D0] font-bold py-3 px-6 rounded-xl hover:bg-[#FAEEDA] transition-all flex items-center justify-center gap-2 shadow-sm"
                   >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                         <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Snap Photo
                   </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center">
                 <img src={imagePreview} className="w-24 h-24 object-cover rounded-2xl mb-6 shadow-md border-2 border-white" alt="Preview" />
                 <p className="text-xs font-bold text-[#BA7517] uppercase tracking-widest mb-4">What crop is this?</p>
                 <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {CROPS.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => setSelectedCrop(c.id)}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all ${selectedCrop === c.id ? 'bg-[#BA7517] text-white shadow-lg' : 'bg-white text-[#854F0B] border border-[#FAC775]/30'}`}
                      >
                        {c.emoji} {c.label}
                      </button>
                    ))}
                 </div>
                 <button 
                    disabled={loading}
                    onClick={runAnalysis}
                    className="w-full bg-[#412402] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#633806] transition-all flex items-center justify-center gap-3"
                 >
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    {loading ? "Checking plant..." : "Check for Sickness"}
                 </button>
                 <button onClick={resetDiagnose} className="mt-4 text-xs text-[#854F0B] hover:underline font-medium">Cancel and restart</button>
              </div>
            )}

            {step === 3 && result && (
               <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold mb-4 uppercase tracking-wider">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                     {result.status}
                  </div>
                  <h3 className="text-2xl font-bold text-[#412402] mb-2">{result.disease_name}</h3>
                  <p className="text-[#854F0B] text-sm leading-relaxed mb-8 px-4">{result.description}</p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={viewFullDiagnosis}
                      className="w-full bg-[#BA7517] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#855310] transition-all"
                    >
                      View Full Analysis & Treatment
                    </button>
                    <button onClick={resetDiagnose} className="text-xs text-[#854F0B] font-medium hover:underline">Check another plant</button>
                  </div>
               </div>
            )}
          </div>
        )}

        {activeTab === 'weather' && weatherData && (
          <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
            {/* Weather Card - Matching User Reference */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#F0E6D0] mb-6 relative overflow-hidden">
               {/* Brown Icon Square */}
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#BA7517] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#BA7517]/20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="5" stroke="#FAEEDA" strokeWidth="2"/>
                        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FAEEDA" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#412402]">{weatherData.city}</div>
                      <div className="text-[10px] font-bold text-[#BA7517] uppercase tracking-wider">Today's Forecast</div>
                    </div>
                  </div>
               </div>

               <div className="flex items-end justify-between mb-8">
                  <div className="text-7xl font-medium text-[#412402] tracking-tighter">
                    {weatherData.temp}°
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-[13px] text-[#854F0B]">Humidity: <span className="font-bold text-[#412402]">{weatherData.humidity}%</span></div>
                    <div className="text-[13px] text-[#854F0B]">Wind: <span className="font-bold text-[#412402]">{weatherData.wind} km/h</span></div>
                    <div className="text-[13px] font-bold text-[#BA7517]">{weatherData.condition}</div>
                  </div>
               </div>

               <div className="flex gap-2">
                  <span className="bg-[#FAEEDA] text-[#633806] text-[10px] font-bold px-4 py-1.5 rounded-full border border-[#FAC775]/30 shadow-sm">Real-time data</span>
                  <span className="bg-[#FAEEDA] text-[#633806] text-[10px] font-bold px-4 py-1.5 rounded-full border border-[#FAC775]/30 shadow-sm">Farm Advisory</span>
               </div>
            </div>

            {/* Smart Tip Section - Restored from previous version */}
            <div className="bg-[#FFFBF5] border border-[#FAC775]/20 p-5 rounded-3xl mb-8 relative overflow-hidden group hover:border-[#BA7517]/40 transition-colors">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-[#BA7517]/10 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#BA7517]">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-[#BA7517] uppercase tracking-widest">Smart Advisory</span>
               </div>
               <p className="text-[#633806] text-sm italic leading-relaxed text-left">
                 "{weatherData.tip}"
               </p>
               <div className="absolute top-0 right-0 w-16 h-16 bg-[#BA7517]/5 rounded-full blur-xl pointer-events-none" />
            </div>

            <button 
              onClick={() => navigate('/weather')}
              className="w-full bg-[#412402] text-white font-bold py-4 rounded-2xl hover:bg-[#633806] transition-all shadow-xl shadow-[#412402]/10"
            >
              See Full Weekly Forecast
            </button>
          </div>
        )}
      </div>

      {/* Internal Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FAC775]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#BA7517]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
    </div>
  )
}

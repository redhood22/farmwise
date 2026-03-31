import Navbar from '../components/Navbar'

const features = [
  {
    id: 'weather',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 15a7 7 0 1 1 14 0" stroke="#BA7517" strokeWidth="2"/>
        <path d="M1 15h2M21 15h2M12 3V1M4.2 6.2 2.8 4.8M19.8 6.2l1.4-1.4" stroke="#BA7517" strokeWidth="2" strokeLinecap="round"/>
        <path d="M1 19h22" stroke="#633806" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: 'bg-[#FAEEDA]',
    title: 'Weather Forecast',
    description: 'Hyperlocal daily and weekly forecasts tailored to your farm location anywhere in the world.',
  },
  {
    id: 'crop-health',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#3B6D11" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" stroke="#3B6D11" strokeWidth="2"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: 'bg-[#EAF3DE]',
    title: 'Disease Detection',
    description: 'Snap a photo of your crop and get an instant AI-powered diagnosis with treatment advice.',
  },
  {
    id: 'practices',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" stroke="#BA7517" strokeWidth="2"/>
        <path d="M4 19h16M9 3v4M15 3v4M8 11h8M8 15h5" stroke="#BA7517" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: 'bg-[#FAEEDA]',
    title: 'Best Practices',
    description: 'Locally curated farming guides for maize, tomato, pepper, potato and more.',
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">

        {/* Background gradient blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FAC775]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#EF9F27]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-[#FAEEDA] border border-[#FAC775] rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA7517] animate-pulse" />
          <span className="text-xs text-[#633806] font-medium">Smart farming for every farmer, everywhere</span>
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-5xl md:text-7xl font-medium text-[#412402] text-center leading-[1.1] tracking-tight max-w-3xl mb-6">
          Your farm,{' '}
          <span className="italic text-[#BA7517]">guided</span>
          <br />by intelligence
        </h1>

        {/* Subtext */}
        <p className="relative z-10 text-base md:text-lg text-[#854F0B] text-center max-w-xl leading-relaxed mb-8">
          Weather forecasts, AI crop disease detection, and local farming best practices — all in one place, built for farmers like you.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <button className="bg-[#412402] text-[#FAEEDA] text-sm px-6 py-3 rounded-full hover:bg-[#633806] active:scale-95 transition-all duration-200 font-medium">
            Start for free
          </button>
          <button className="bg-[#FAEEDA] text-[#412402] border border-[#FAC775] text-sm px-6 py-3 rounded-full hover:bg-[#FAC775]/30 active:scale-95 transition-all duration-200 font-medium">
            See how it works
          </button>
        </div>

        {/* Glassmorphism Weather Card */}
        <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-5 w-full max-w-xs shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#BA7517] rounded-xl flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="#FAEEDA" strokeWidth="2"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#FAEEDA" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#412402]">Abuja, Nigeria</p>
              <p className="text-xs text-[#854F0B]">Today's Forecast</p>
            </div>
          </div>
          <div className="flex items-end justify-between mb-3">
            <span className="text-5xl font-medium text-[#412402]">34°</span>
            <div className="text-right text-xs text-[#854F0B] space-y-0.5">
              <p>Humidity: 42%</p>
              <p>Wind: 12 km/h</p>
              <p>Partly cloudy</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="bg-[#BA7517]/15 text-[#633806] text-xs rounded-full px-3 py-1">Good planting day</span>
            <span className="bg-[#BA7517]/15 text-[#633806] text-xs rounded-full px-3 py-1">Low rain risk</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-[#BA7517] uppercase tracking-widest mb-3">What FarmWise offers</p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#412402] tracking-tight">Everything your farm needs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.id}
              id={f.id}
              className="bg-white border border-[#FAC775]/40 rounded-3xl p-6 hover:border-[#FAC775] hover:shadow-sm transition-all duration-300 group"
            >
              <div className={`w-11 h-11 ${f.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-base font-medium text-[#412402] mb-2">{f.title}</h3>
              <p className="text-sm text-[#854F0B] leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#FAC775]/40 px-4 py-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-base font-medium text-[#412402]">
          Farm<span className="text-[#BA7517]">Wise</span>
        </div>
        <p className="text-xs text-[#854F0B]">Built for small-scale farmers everywhere © 2026</p>
        <div className="flex gap-6">
          {['Weather', 'Crop Health', 'Practices'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-xs text-[#854F0B] hover:text-[#412402] transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Home
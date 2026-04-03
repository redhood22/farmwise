import { useState } from 'react'
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

const faqItems = [
  {
    id: 1,
    question: 'Is FarmWise free to use?',
    answer: 'Yes, core features are free for all farmers.'
  },
  {
    id: 2,
    question: 'Which crops does disease detection support?',
    answer: 'Maize, tomato, pepper, potato, and groundnut.'
  },
  {
    id: 3,
    question: 'Does it work without internet?',
    answer: 'Internet is required for weather and AI features.'
  },
  {
    id: 4,
    question: 'How accurate is the disease detection?',
    answer: 'The model achieves over 90% accuracy on supported crops.'
  },
  {
    id: 5,
    question: 'Can I use it outside Nigeria?',
    answer: 'Yes, FarmWise works globally for weather and best practices.'
  },
]

function Home() {
  const [openId, setOpenId] = useState(null)

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-36 pb-16 overflow-hidden">

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

      {/* How it works Section */}
      <section className="px-4 py-24 bg-[#FFFBF5]">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-[#BA7517] uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-medium text-[#412402] tracking-tight leading-tight">
              From field to insight in seconds
            </h2>
          </div>

          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FAC775]/30 to-transparent" />

            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col h-full">
                {/* Number */}
                <div className="mb-6">
                  <span className="text-6xl md:text-7xl font-light text-[#FAC775] leading-none">01</span>
                </div>
                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 border border-[#FAC775]/20 hover:border-[#FAC775]/40 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-[#412402] mb-3">Tell us your location</h3>
                  <p className="text-sm text-[#854F0B] leading-relaxed">
                    Set up your farm location and we'll tailor weather forecasts and farming advice just for your area. Works anywhere in Africa.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col h-full">
                {/* Number */}
                <div className="mb-6">
                  <span className="text-6xl md:text-7xl font-light text-[#FAC775] leading-none">02</span>
                </div>
                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 border border-[#FAC775]/20 hover:border-[#FAC775]/40 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-[#412402] mb-3">Snap or ask</h3>
                  <p className="text-sm text-[#854F0B] leading-relaxed">
                    Take a photo of your crops for instant disease detection, or check upcoming weather and farming conditions anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col h-full">
                {/* Number */}
                <div className="mb-6">
                  <span className="text-6xl md:text-7xl font-light text-[#FAC775] leading-none">03</span>
                </div>
                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 border border-[#FAC775]/20 hover:border-[#FAC775]/40 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-[#412402] mb-3">Get instant advice</h3>
                  <p className="text-sm text-[#854F0B] leading-relaxed">
                    Receive AI-powered recommendations tailored to your specific crop, soil, and weather conditions in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-24 bg-[#FAEEDA]/30">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-[#BA7517] uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-medium text-[#412402] tracking-tight">
              Questions we get a lot
            </h2>
          </div>

          {/* Accordion Items */}
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div key={item.id} className="border border-[#FAC775]/40 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#FFFBF5] transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-[#412402] text-left">{item.question}</h3>
                  <span className="flex-shrink-0 ml-4 text-2xl font-light text-[#BA7517] transition-transform duration-300" style={{
                    transform: openId === item.id ? 'rotate(45deg)' : 'rotate(0)'
                  }}>
                    +
                  </span>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openId === item.id ? '200px' : '0px',
                  }}
                >
                  <div className="px-6 pb-5 text-sm text-[#854F0B] leading-relaxed border-t border-[#FAC775]/20">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-32 bg-[#FFFBF5]">
        <div className="max-w-3xl mx-auto text-center">

          {/* Label */}
          <p className="text-xs font-medium text-[#BA7517] uppercase tracking-widest mb-5">
            Ready to start?
          </p>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-medium text-[#412402] tracking-tight leading-[1.1] mb-5">
            Start farming smarter
            <br />
            <span className="text-[#BA7517] italic">today</span>
          </h2>

          {/* Subtext */}
          <p className="text-base text-[#854F0B] leading-relaxed max-w-md mx-auto mb-10">
            Join farmers already using FarmWise for better harvests, healthier crops, and smarter decisions.
          </p>

          {/* Single CTA button */}
          <button className="bg-[#412402] text-[#FAEEDA] text-sm font-medium px-8 py-4 rounded-full hover:bg-[#633806] active:scale-95 transition-all duration-200 mb-10">
            Get Started Free
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Free to use'
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C12 22 3 17 3 10V5.5L12 2L21 5.5V10C21 17 12 22 12 22Z" stroke="#BA7517" strokeWidth="2"/>
                    <path d="M8 12l3 3 5-5" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'AI-powered insights'
              },
              {
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#BA7517" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Works globally'
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FAEEDA] border border-[#FAC775]/50 flex items-center justify-center">
                  {icon}
                </div>
                <span className="text-sm text-[#854F0B]">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
<footer className="bg-[#412402] px-6 py-12">
  <div className="max-w-5xl mx-auto">
    <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">

      {/* Brand */}
      <div>
        <div className="text-xl font-medium text-[#FAEEDA] mb-2">
          Farm<span className="text-[#FAC775]">Wise</span>
        </div>
        <p className="text-sm text-[#FAC775]/60 max-w-xs leading-relaxed">
          Smart agriculture advisory for small-scale farmers, everywhere in the world.
        </p>
      </div>

      {/* Links */}
      <div className="flex gap-12">
        <div>
          <p className="text-xs font-medium text-[#FAC775]/50 uppercase tracking-widest mb-3">Features</p>
          <div className="flex flex-col gap-2">
            {['Weather', 'Crop Health', 'Practices'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#FAEEDA]/70 hover:text-[#FAEEDA] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-[#FAC775]/50 uppercase tracking-widest mb-3">Product</p>
          <div className="flex flex-col gap-2">
            {['How it works', 'FAQ', 'Get Started'].map((l) => (
              <a key={l} href="#" className="text-sm text-[#FAEEDA]/70 hover:text-[#FAEEDA] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-[#FAEEDA]/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-xs text-[#FAEEDA]/40">© 2026 FarmWise. Built for farmers everywhere.</p>
      <p className="text-xs text-[#FAEEDA]/40">Made with care for Nigerian agriculture</p>
    </div>
  </div>
</footer>
    </div>
  )
}

export default Home
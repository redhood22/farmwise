import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  {
    label: 'Weather',
    href: '/weather',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M3 15a7 7 0 1 1 14 0" stroke="currentColor" strokeWidth="2"/>
        <path d="M1 15h2M21 15h2M12 3V1M4.2 6.2 2.8 4.8M19.8 6.2l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M1 19h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'How it works',
    href: '/#how-it-works',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'FAQ',
    href: '/#faq',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Practices',
    href: '/practices',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => {
    if (location.pathname !== '/') {
      navigate('/#quick-hub')
    } else {
      document.getElementById('quick-hub')?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
      <div className={`
        flex items-center justify-between
        rounded-full px-2 py-2
        border transition-all duration-500
        ${scrolled
          ? 'bg-[#FAEEDA]/95 border-[#FAC775]/80 shadow-lg shadow-[#BA7517]/10 backdrop-blur-xl'
          : 'bg-[#FAEEDA]/70 border-[#FAC775]/50 backdrop-blur-md'}
      `}>

        {/* Logo */}
        <div className="pl-4 text-base font-medium tracking-tight text-[#412402] shrink-0">
          Farm<span className="text-[#BA7517]">Wise</span>
        </div>

        {/* Desktop Nav — centered pill buttons */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href, icon }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-1.5 text-[#854F0B] hover:text-[#412402] hover:bg-[#FAC775]/30 text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
            >
              <span className="opacity-70">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <button 
          onClick={handleGetStarted}
          className="hidden md:block bg-[#412402] text-[#FAEEDA] text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#633806] active:scale-95 transition-all duration-200 shrink-0"
        >
          Get Started
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden mr-2 w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#FAC775]/30 text-[#412402] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            {menuOpen
              ? <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mt-2 bg-[#FAEEDA]/97 backdrop-blur-xl border border-[#FAC775]/60 rounded-3xl px-4 py-4 flex flex-col gap-1 md:hidden shadow-lg">
          {navLinks.map(({ label, href, icon }) => (
            <Link
              key={label}
              to={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-sm text-[#854F0B] hover:text-[#412402] hover:bg-[#FAC775]/20 px-4 py-3 rounded-2xl transition-all duration-200"
            >
              <span className="opacity-60">{icon}</span>
              {label}
            </Link>
          ))}
          <div className="mt-2 pt-3 border-t border-[#FAC775]/40">
            <button 
              onClick={handleGetStarted}
              className="w-full bg-[#412402] text-[#FAEEDA] text-sm font-semibold px-5 py-3 rounded-2xl"
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
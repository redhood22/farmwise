import { useState, useEffect } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300">
      <div className={`backdrop-blur-md border border-[#FAC775]/60 rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-[#FAEEDA]/90 shadow-sm' : 'bg-[#FAEEDA]/60'}`}>

        {/* Logo */}
        <div className="text-lg font-medium tracking-tight text-[#412402]">
          Farm<span className="text-[#BA7517]">Wise</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Weather', 'Crop Health', 'Practices'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-[#854F0B] hover:text-[#412402] transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button className="hidden md:block bg-[#412402] text-[#FAEEDA] text-sm px-5 py-2 rounded-full hover:bg-[#633806] active:scale-95 transition-all duration-200">
          Get Started
        </button>

        {/* Hamburger */}
        <button className="md:hidden text-[#412402]" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            {menuOpen
              ? <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-2 bg-[#FAEEDA]/95 backdrop-blur-md border border-[#FAC775]/60 rounded-2xl px-6 py-4 flex flex-col gap-4 md:hidden">
          {['Weather', 'Crop Health', 'Practices'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#854F0B]" onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
          <button className="bg-[#412402] text-[#FAEEDA] text-sm px-5 py-2 rounded-full w-fit">Get Started</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
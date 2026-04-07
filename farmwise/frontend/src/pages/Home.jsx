import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import QuickActionHub from '../components/QuickActionHub'
import { useEffect } from 'react'

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
        <path d="M12 22V12M12 12C12 7 7 4 2 5c0 5 3 9 10 7M12 12c0-5 5-8 10-7-1 5-4 9-10 7" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

export default function Home() {
  const [openFaqId, setOpenFaqId] = useState(null)
  const navigate = useNavigate()

  // Helper for smooth scrolling across routes or when hash is in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  const scrollToHub = () => {
    document.getElementById('quick-hub')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans selection:bg-[#FAC775]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center pt-40 pb-16 px-6 overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] bg-gradient-to-br from-[#FAC775]/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-40 left-[-5%] w-[35%] h-[35%] bg-gradient-to-tr from-[#BA7517]/10 to-transparent rounded-full blur-[100px]" />

        {/* Brand Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-white/40 border border-[#FAC775]/40 rounded-full px-4 py-1.5 mb-10 shadow-sm backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BA7517]" />
          <span className="text-[10px] md:text-xs text-[#633806] font-bold uppercase tracking-wider">Smart farming for every farmer, everywhere</span>
        </div>

        {/* Catchy Headline - RESTORED SIZE */}
        <div className="relative z-10 text-center mb-0">
          <h1 className="text-5xl md:text-7xl font-medium text-[#412402] leading-[1.1] tracking-tight mb-8">
            Smart farming,<br />
            <span className="text-[#BA7517] italic">made simple.</span>
          </h1>
          <p className="text-[#854F0B] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12 opacity-90 font-medium">
             Instant help for your crops and weather updates you can actually understand. Just pick a tool below to start.
          </p>

          <button 
            onClick={scrollToHub}
            className="group relative z-20 bg-[#412402] text-white font-bold px-12 py-5 rounded-full hover:bg-[#633806] transition-all duration-300 shadow-2xl shadow-[#412402]/20 mb-24"
          >
            Get Started Now
            <span className="ml-2 inline-block group-hover:translate-y-1 transition-transform">↓</span>
          </button>
        </div>

        {/* QUICK HUB SECTION - Refined Header */}
        <div className="relative z-30 w-full mb-12 mt-20">
           <div className="max-w-xl mx-auto text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-medium text-[#412402] tracking-tight opacity-90 animate-in fade-in duration-700">
                 Try it out <span className="text-[#BA7517] italic">here</span>
              </h2>
           </div>
           <QuickActionHub />
        </div>
      </section>

      {/* How It Works - IPHONE MOCKUP */}
      <section id="how-it-works" className="py-32 px-6 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Visual Side (Mockup) */}
            <div className="relative flex justify-center">
              <div className="relative group w-full max-w-[260px]">
                <div className="absolute inset-0 bg-[#FAC775]/20 rounded-[3.5rem] blur-3xl group-hover:scale-105 transition-transform" />
                
                {/* iPhone Body */}
                <div className="relative bg-[#000] aspect-[9/18.5] rounded-[3.2rem] p-[10px] shadow-2xl border-[4px] border-[#2A1801] overflow-hidden">
                   {/* Notch */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-[#000] rounded-b-2xl z-40 flex items-center justify-center">
                      <div className="w-10 h-1 bg-white/10 rounded-full" />
                   </div>

                   {/* Screen Content */}
                   <div className="h-full w-full bg-[#FFFBF5] rounded-[2.8rem] overflow-hidden flex flex-col p-6 pt-10">
                      <div className="w-12 h-1 bg-[#FAC775]/40 rounded-full mb-6" />
                      
                      <div className="space-y-4">
                         <div className="w-full aspect-square bg-[#FAEEDA] rounded-2xl flex items-center justify-center border-2 border-dashed border-[#BA7517]/30 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                            <div className="animate-pulse flex flex-col items-center z-20">
                               <div className="w-8 h-8 bg-white/40 rounded-full mb-2" />
                            </div>
                            {/* Scanning Animation */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white shadow-[0_0_10px_white] animate-[scan_2s_infinite]" />
                         </div>
                         <div className="h-3 w-3/4 bg-[#412402]/10 rounded-full" />
                         <div className="h-3 w-1/2 bg-[#412402]/10 rounded-full" />
                         
                         <div className="pt-4 text-center">
                            <div className="inline-block px-6 py-2 bg-[#16A34A] text-white text-[8px] font-bold rounded-full shadow-lg animate-bounce">
                               LEAF IS HEALTHY
                            </div>
                         </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-2">
                         <div className="h-8 bg-[#FAEEDA] rounded-lg" />
                         <div className="h-8 bg-[#412402] rounded-lg" />
                      </div>
                   </div>
                </div>

                {/* Floating tags */}
                <div className="absolute -right-6 top-20 bg-white p-3 rounded-2xl shadow-xl border border-[#FAC775]/20 flex items-center gap-2 animate-[float_4s_ease-in-out_infinite] z-20 overflow-hidden">
                   <div className="w-2 h-2 bg-green-500 rounded-full" />
                   <span className="text-[10px] font-bold text-[#412402]">Results ready</span>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <span className="text-[#BA7517] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">How it works</span>
              <h2 className="text-3xl md:text-5xl font-medium text-[#412402] leading-[1.1] mb-8">
                From field to insight<br/>in seconds.
              </h2>
              
              <div className="space-y-10">
                {[
                  { n: "01", t: "Upload photo", d: "Snap a photo of your leaf or pick your location. No registration required for quick tools." },
                  { n: "02", t: "AI Analysis", d: "Our specialized models analyze the visual patterns and environmental data in real-time." },
                  { n: "03", t: "Get results", d: "Receive actionable treatment plans or farming tips tailored to your specific situation." },
                ].map((step) => (
                  <div key={step.n} className="flex gap-4 group">
                    <span className="text-2xl font-light text-[#FAC775]">{step.n}</span>
                    <div>
                      <h4 className="text-lg font-bold text-[#412402] mb-1">{step.t}</h4>
                      <p className="text-[#854F0B] text-sm leading-relaxed opacity-90">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - RESTORED ORIGINAL COPY */}
      <section className="py-32 px-6 bg-[#FAEEDA]/15">
        <div className="max-w-6xl mx-auto text-center mb-16">
           <p className="text-xs font-bold text-[#BA7517] uppercase tracking-widest mb-3">WHAT FARMWISE OFFERS</p>
           <h2 className="text-4xl md:text-5xl font-medium text-[#412402] tracking-tight">Everything your farm needs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {features.map((f) => (
             <div key={f.id} className="bg-white p-10 rounded-[2.5rem] border border-[#FAC775]/20 hover:border-[#BA7517]/40 transition-all duration-300 group shadow-lg shadow-[#BA7517]/5 hover:shadow-[#BA7517]/10">
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   {f.icon}
                </div>
                <h3 className="text-xl font-bold text-[#412402] mb-3">{f.title}</h3>
                <p className="text-[#854F0B] text-[14px] leading-relaxed mb-6 opacity-90">{f.description}</p>
                <div className="w-6 h-0.5 bg-[#FAC775] group-hover:w-16 transition-all" />
             </div>
           ))}
        </div>
      </section>

      {/* FAQ Section - RESTORED ORIGINAL COPY */}
      <section id="faq" className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
           <div className="text-center mb-14">
              <p className="text-xs font-bold text-[#BA7517] uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-4xl font-medium text-[#412402] tracking-tight">Questions we get a lot</h2>
           </div>
           
           <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.id} className="border border-[#FAC775]/30 rounded-2xl overflow-hidden bg-[#FFFBF5] hover:border-[#BA7517]/30 transition-colors">
                   <button 
                    onClick={() => setOpenFaqId(openFaqId === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-[#FAEEDA]/30 transition-colors"
                   >
                      <span className="text-left font-bold text-[#412402] text-base">{item.question}</span>
                      <span className={`text-xl text-[#BA7517] transition-transform ${openFaqId === item.id ? 'rotate-45' : ''}`}>+</span>
                   </button>
                   <div 
                    className="transition-all duration-300 ease-in-out px-6"
                    style={{ maxHeight: openFaqId === item.id ? '200px' : '0px', opacity: openFaqId === item.id ? 1 : 0 }}
                   >
                      <div className="pb-6 text-[#854F0B] text-sm leading-relaxed">
                         {item.answer}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Final CTA - RESIZED */}
      <section className="px-4 py-20 bg-[#FFFBF5] overflow-hidden relative border-t border-[#FAC775]/10">
        <div className="max-w-3xl mx-auto text-center relative z-10">

          <p className="text-[10px] font-bold text-[#BA7517] uppercase tracking-[0.2em] mb-4">
            READY TO START?
          </p>

          <h2 className="text-4xl md:text-5xl font-medium text-[#412402] tracking-tight leading-[1.2] mb-6">
            Start farming smarter
            <br />
            <span className="text-[#BA7517] italic text-3xl md:text-4xl">today</span>
          </h2>

          <p className="text-sm md:text-base text-[#854F0B] leading-relaxed max-w-sm mx-auto mb-8 font-medium opacity-90">
            Join farmers already using FarmWise for better harvests, healthier crops, and smarter decisions.
          </p>

          <button 
            onClick={scrollToHub}
            className="bg-[#412402] text-[#FAEEDA] text-sm font-bold px-12 py-5 rounded-full hover:bg-[#633806] active:scale-95 transition-all duration-300 shadow-2xl shadow-[#412402]/20 mb-16"
          >
            Get Started Free
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Free to use'
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C12 22 3 17 3 10V5.5L12 2L21 5.5V10C21 17 12 22 12 22Z" stroke="#BA7517" strokeWidth="2"/>
                    <path d="M8 12l3 3 5-5" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'AI-powered insights'
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#BA7517" strokeWidth="2"/>
                    <path d="M9 12l2 2 4-4" stroke="#BA7517" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Works globally'
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-full bg-[#FAEEDA] border border-[#FAC775]/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  {icon}
                </div>
                <span className="text-sm font-bold text-[#854F0B]">{label}</span>
              </div>
            ))}
          </div>

        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#FAC775]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#BA7517]/5 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="bg-[#412402] text-[#FAEEDA] py-20 px-6">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
               <div className="text-2xl font-bold mb-6 tracking-tighter">Farm<span className="text-[#FAC775]">Wise</span></div>
               <p className="text-[#FAC775]/60 max-w-xs leading-relaxed text-sm">
                 Building the future of digital agriculture for the modern small-scale farmer. 
                 Easy to use, everywhere you go.
               </p>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#FAC775]">Explorer</h4>
               <ul className="space-y-4 text-xs text-[#FAEEDA]/70">
                 <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                 <li><button onClick={() => navigate('/weather')} className="hover:text-white transition-colors">Weather Forecast</button></li>
                 <li><button onClick={() => navigate('/crop-health')} className="hover:text-white transition-colors">Disease Detection</button></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-[#FAC775]">Support</h4>
               <ul className="space-y-4 text-xs text-[#FAEEDA]/70">
                 <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                 <li><a href="mailto:hello@farmwise.com" className="hover:text-white transition-colors">Email Us</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-6xl mx-auto border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-white/30 uppercase tracking-[0.3em]">
            <span>© 2026 FarmWise Agriculture Hub</span>
            <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
         </div>
      </footer>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          20%, 80% { opacity: 1; }
          50% { top: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
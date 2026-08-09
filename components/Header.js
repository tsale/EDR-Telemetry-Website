import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Search, Menu, X, ChevronDown, Github, Monitor, Terminal, Command } from 'lucide-react'

export default function Header({ onSearchClick }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [platformsOpen, setPlatformsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  // Desktop dropdown states (for touch devices)
  const [desktopPlatformsOpen, setDesktopPlatformsOpen] = useState(false)
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false)
  const platformsRef = useRef(null)
  const aboutRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close desktop dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (platformsRef.current && !platformsRef.current.contains(event.target)) {
        setDesktopPlatformsOpen(false)
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setDesktopAboutOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Close menus when client-side navigation starts.
  useEffect(() => {
    const closeMenus = () => {
      setMobileMenuOpen(false)
      setPlatformsOpen(false)
      setAboutOpen(false)
      setDesktopPlatformsOpen(false)
      setDesktopAboutOpen(false)
    }

    router.events.on('routeChangeStart', closeMenus)
    return () => router.events.off('routeChangeStart', closeMenus)
  }, [router.events])

  const isActive = (path) => router.pathname === path
  const isPathActive = (path) => router.pathname.startsWith(path)

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' 
          : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — wordmark from lg up; icon-only when md nav is tight */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 lg:gap-3 group" aria-label="EDR Telemetry">
              <div className="w-8 h-8 relative shrink-0">
                <Image
                  src="/images/edr_telemetry_logo.png" 
                  alt="" 
                  width={32}
                  height={32}
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="inline md:hidden lg:inline text-lg font-bold leading-none text-slate-900 group-hover:text-blue-600 transition-colors">
                EDR Telemetry
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            <div className="relative group px-2 lg:px-3 py-2" ref={platformsRef}>
                <button 
                  onClick={() => {
                    setDesktopPlatformsOpen(!desktopPlatformsOpen)
                    setDesktopAboutOpen(false)
                  }}
                  aria-expanded={desktopPlatformsOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 text-sm font-medium ${isPathActive('/windows') || isPathActive('/linux') || isPathActive('/macos') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Platforms <ChevronDown className={`w-4 h-4 transition-transform ${desktopPlatformsOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-slate-100 transition-all duration-200 transform ${desktopPlatformsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
                    <div className="p-1">
                        <Link href="/windows" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Windows</Link>
                        <Link href="/linux" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Linux</Link>
                        <Link href="/macos" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">macOS</Link>
                    </div>
                </div>
            </div>

            <Link href="/scores" className={`px-2 lg:px-3 py-2 text-sm font-medium ${isActive('/scores') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Scores
            </Link>

            <Link href="/statistics" className={`px-2 lg:px-3 py-2 text-sm font-medium ${isActive('/statistics') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Statistics
            </Link>
            
            <Link href="/blog" className={`px-2 lg:px-3 py-2 text-sm font-medium ${isPathActive('/blog') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Blog
            </Link>

            <Link href="/methodology" className={`px-2 lg:px-3 py-2 text-sm font-medium ${isActive('/methodology') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Methodology
            </Link>

            <div className="relative group px-2 lg:px-3 py-2" ref={aboutRef}>
                <button 
                  onClick={() => {
                    setDesktopAboutOpen(!desktopAboutOpen)
                    setDesktopPlatformsOpen(false)
                  }}
                  aria-expanded={desktopAboutOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 text-sm font-medium ${isPathActive('/about') || isPathActive('/eligibility') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    About <ChevronDown className={`w-4 h-4 transition-transform ${desktopAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-slate-100 transition-all duration-200 transform ${desktopAboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
                    <div className="p-1">
                        <Link href="/about" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Project Info</Link>
                        <Link href="/eligibility" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Eligibility</Link>
                        <Link href="/telemetry-categories" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Categories</Link>
                        <Link href="/mitre-mappings" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">MITRE Mappings</Link>
                        <Link href="/support" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Support Us</Link>
                        <Link href="/contact" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Contact</Link>
                    </div>
                </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3 shrink-0">
            <button 
                onClick={onSearchClick}
                className="flex items-center gap-2 p-1.5 lg:px-3 lg:py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors text-sm"
                aria-label="Search"
            >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            
            <div className="hidden lg:block h-6 w-px bg-slate-200 mx-1"></div>

            <a 
                href="https://github.com/tsale/EDR-Telemetry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 lg:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="GitHub"
            >
                <Github className="w-5 h-5" />
            </a>
            
            <Link
                href="/premium-services"
                className={`shrink-0 whitespace-nowrap inline-flex items-center px-2 py-1 lg:px-2.5 lg:py-1.5 text-sm font-medium rounded-md border transition-colors ${
                  isActive('/premium-services')
                    ? 'text-blue-700 bg-blue-50 border-blue-200'
                    : 'text-blue-600 bg-blue-50/70 border-blue-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
                }`}
            >
                Apply the Research
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
                onClick={onSearchClick}
                className="p-2 text-slate-500 hover:text-slate-900"
                aria-label="Search"
            >
                <Search className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
            >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/" className="block px-3 py-3 text-base font-medium text-slate-900 border-b border-slate-50">Home</Link>
            
            <div className="py-2 border-b border-slate-50">
                <button 
                  onClick={() => setPlatformsOpen(!platformsOpen)}
                  aria-expanded={platformsOpen}
                  className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <span>Platforms</span>
                    <span className="text-xs font-normal text-slate-400">Tap to expand</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform text-slate-400 ${platformsOpen ? 'rotate-180' : ''}`} />
                </button>
                {platformsOpen && (
                  <div className="bg-slate-50 rounded-lg mt-1 mb-2 py-2">
                    <Link href="/windows" className="flex items-center gap-3 px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">
                      <Monitor className="w-4 h-4 text-slate-400" /> Windows
                    </Link>
                    <Link href="/linux" className="flex items-center gap-3 px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">
                      <Terminal className="w-4 h-4 text-slate-400" /> Linux
                    </Link>
                    <Link href="/macos" className="flex items-center gap-3 px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">
                      <Command className="w-4 h-4 text-slate-400" /> macOS
                    </Link>
                  </div>
                )}
            </div>

            <Link href="/scores" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md border-b border-slate-50">Scores</Link>
            <Link href="/statistics" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md border-b border-slate-50">Statistics</Link>
            <Link href="/blog" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md border-b border-slate-50">Blog</Link>
            <Link href="/methodology" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md border-b border-slate-50">Methodology</Link>
            
            <div className="py-2 border-b border-slate-50">
                <button 
                  onClick={() => setAboutOpen(!aboutOpen)}
                  aria-expanded={aboutOpen}
                  className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <span>About</span>
                    <span className="text-xs font-normal text-slate-400">Tap to expand</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform text-slate-400 ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {aboutOpen && (
                  <div className="bg-slate-50 rounded-lg mt-1 mb-2 py-2">
                    <Link href="/about" className="block px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">Project Info</Link>
                    <Link href="/eligibility" className="block px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">Eligibility</Link>
                    <Link href="/telemetry-categories" className="block px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">Categories</Link>
                    <Link href="/mitre-mappings" className="block px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">MITRE Mappings</Link>
                    <Link href="/support" className="block px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">Support Us</Link>
                    <Link href="/contact" className="block px-4 py-2.5 text-base text-slate-600 hover:text-blue-600">Contact</Link>
                  </div>
                )}
            </div>

            <Link
              href="/premium-services"
              className={`block mt-4 px-3 py-3 text-center text-base font-medium rounded-md border transition-colors ${
                isActive('/premium-services')
                  ? 'text-blue-700 bg-blue-50 border-blue-200'
                  : 'text-blue-600 bg-blue-50/70 border-blue-100 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              Apply the Research
            </Link>
            
            <div className="mt-4 flex justify-center">
               <a 
                href="https://github.com/tsale/EDR-Telemetry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-500"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

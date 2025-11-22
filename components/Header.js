import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Search, Menu, X, ChevronDown, Github } from 'lucide-react'

export default function Header({ onSearchClick }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [platformsOpen, setPlatformsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setPlatformsOpen(false)
    setAboutOpen(false)
  }, [router.pathname])

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
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 relative">
                <img 
                  src="/images/edr_telemetry_logo.png" 
                  alt="EDR Telemetry" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-slate-900 group-hover:text-blue-600 transition-colors">
                  EDR Telemetry
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="relative group px-3 py-2">
                <button className={`flex items-center gap-1 text-sm font-medium ${isPathActive('/windows') || isPathActive('/linux') || isPathActive('/macos') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                    Platforms <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-1">
                        <Link href="/windows" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Windows</Link>
                        <Link href="/linux" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Linux</Link>
                        <Link href="/macos" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">macOS</Link>
                    </div>
                </div>
            </div>

            <Link href="/scores" className={`px-3 py-2 text-sm font-medium ${isActive('/scores') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Scores
            </Link>
            
            <Link href="/blog" className={`px-3 py-2 text-sm font-medium ${isPathActive('/blog') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Blog
            </Link>

            <div className="relative group px-3 py-2">
                <button className={`flex items-center gap-1 text-sm font-medium ${isPathActive('/about') || isPathActive('/eligibility') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                    About <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-1">
                        <Link href="/about" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Project Info</Link>
                        <Link href="/eligibility" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Eligibility</Link>
                        <Link href="/telemetry-categories" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Categories</Link>
                        <Link href="/sponsorship" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">Support Us</Link>
                    </div>
                </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button 
                onClick={onSearchClick}
                className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors text-sm"
                aria-label="Search"
            >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <a 
                href="https://github.com/tsale/EDR-Telemetry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="GitHub"
            >
                <Github className="w-5 h-5" />
            </a>
            
            <Link href="/premium-services" className="ml-2 px-4 py-2 text-sm font-medium !text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-colors">
                Premium
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
                onClick={onSearchClick}
                className="p-2 text-slate-500 hover:text-slate-900"
            >
                <Search className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900"
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
            
            <div className="py-2">
                <button 
                  onClick={() => setPlatformsOpen(!platformsOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-slate-700"
                >
                  Platforms
                  <ChevronDown className={`w-4 h-4 transition-transform ${platformsOpen ? 'rotate-180' : ''}`} />
                </button>
                {platformsOpen && (
                  <div className="bg-slate-50 rounded-md mt-1 mb-2">
                    <Link href="/windows" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">Windows</Link>
                    <Link href="/linux" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">Linux</Link>
                    <Link href="/macos" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">macOS</Link>
                  </div>
                )}
            </div>

            <Link href="/scores" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">Scores</Link>
            <Link href="/blog" className="block px-3 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">Blog</Link>
            
            <div className="py-2">
                <button 
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-slate-700"
                >
                  About
                  <ChevronDown className={`w-4 h-4 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
                </button>
                {aboutOpen && (
                  <div className="bg-slate-50 rounded-md mt-1 mb-2">
                    <Link href="/about" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">Project Info</Link>
                    <Link href="/eligibility" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">Eligibility</Link>
                    <Link href="/telemetry-categories" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">Categories</Link>
                    <Link href="/sponsorship" className="block px-3 py-2 text-base text-slate-600 hover:text-blue-600 pl-6">Support Us</Link>
                  </div>
                )}
            </div>

            <Link href="/premium-services" className="block mt-4 px-3 py-3 text-center text-base font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md">Premium Services</Link>
            
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

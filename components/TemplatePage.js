import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Search from './Search'
import AnnouncementBanner from './AnnouncementBanner'

export default function TemplatePage({ children, title = 'EDR Telemetry Project', description = 'EDR Telemetry Project - Exploring telemetry capabilities of EDR solutions' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [platformsMenuOpen, setPlatformsMenuOpen] = useState(false)
  const [reportsMenuOpen, setReportsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalPath = router.asPath ? router.asPath.split('?')[0] : ''
  const canonicalUrl = siteUrl && canonicalPath ? `${siteUrl}${canonicalPath}` : ''
  const defaultOgImage = siteUrl ? `${siteUrl}/images/edr_telemetry_logo.png` : ''

  // Detect mobile device on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setPlatformsMenuOpen(false)
    setReportsMenuOpen(false)
  }, [router.pathname])
  
  // Close menu when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navMenu = document.querySelector('nav');
      const mobileToggle = document.querySelector('.mobile-menu-toggle');
      
      if (mobileMenuOpen && navMenu && !navMenu.contains(event.target) && 
          mobileToggle && !mobileToggle.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command/Control + K or Command/Control + /
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === '/')) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const togglePlatformsMenu = (e) => {
    if (e) e.preventDefault()
    
    // On mobile, make sure both menus are open with one click
    if (isMobile && !mobileMenuOpen) {
      setMobileMenuOpen(true);
    }
    
    setPlatformsMenuOpen(!platformsMenuOpen)
  }
  
  const toggleReportsMenu = (e) => {
    if (e) e.preventDefault()
    
    // On mobile, make sure both menus are open with one click
    if (isMobile && !mobileMenuOpen) {
      setMobileMenuOpen(true);
    }
    
    setReportsMenuOpen(!reportsMenuOpen)
  }
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return router.pathname === path ? 'active' : ''
  }

  // Check if any platform page is active
  const isPlatformsActive = () => {
    return ['/windows', '/linux', '/macos'].includes(router.pathname) ? 'active' : ''
  }

  // Check if any reports page is active
  const isReportsActive = () => {
    return ['/scores', '/statistics'].includes(router.pathname) ? 'active' : ''
  }

  return (
    <div className="page-container">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {canonicalUrl && (
          <link rel="canonical" href={canonicalUrl} />
        )}
        {/* Open Graph / Twitter basic tags for better share previews */}
        <meta property="og:type" content="website" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {defaultOgImage && (
          <>
            <meta property="og:image" content={defaultOgImage} />
            <meta property="og:image:alt" content="EDR Telemetry Project logo" />
            <meta property="og:image:type" content="image/png" />
            <meta name="twitter:image" content={defaultOgImage} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <AnnouncementBanner />

      <header>
        <div className="header-container" style={{ display: 'flex', alignItems: 'center', padding: '0' }}>
          <div className="logo" style={{ padding: '0', margin: '0', marginRight: '3rem' }}>
            <div className="brand-group">
              <a
                href="https://defendpoint.ca"
                className="defendpoint-badge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Defendpoint Consulting"
              >
                <img src="/images/defendpoint_logo.svg" alt="Defendpoint Consulting logo" className="defendpoint-icon" />
                <div className="defendpoint-badge-text">
                  <span>Defendpoint</span>
                  <span>Consulting</span>
                </div>
              </a>
              <Link href="/" className="edr-brand">
                <img src="/images/edr_telemetry_logo.png" alt="EDR Telemetry Logo" className="logo-icon edr-logo" />
                <span className="edr-brand-text">
                  <span className="edr-brand-title">EDR</span>
                  <span className="edr-brand-subtitle">Telemetry</span>
                </span>
              </Link>
            </div>
          </div>
          
          <button 
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14z"/>
            </svg>
            <span className="search-shortcut">⌘K</span>
          </button>
          
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav style={{ flex: 1, display: 'flex', justifyContent: 'center' }} className={mobileMenuOpen ? 'active' : ''}>
            <ul>
              <li className={isActive('/')}>
                <Link href="/">Home</Link>
              </li>
              <li className={`dropdown ${isPlatformsActive()}`}>
                <div 
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={(e) => {
                    if (isMobile) {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePlatformsMenu(e);
                    }
                  }}
                >
                  <a 
                    href="#" 
                    onClick={(e) => !isMobile && togglePlatformsMenu(e)} 
                    className={`dropdown-link ${isPlatformsActive()}`}
                  >
                    Platforms
                  </a>
                  {isMobile && (
                    <a 
                      href="#" 
                      className="dropdown-toggle" 
                      onClick={(e) => { e.preventDefault(); togglePlatformsMenu(e) }}
                      onTouchStart={(e) => { e.preventDefault(); togglePlatformsMenu(e) }}
                      style={{ 
                        marginLeft: '5px', 
                        fontSize: '0.7rem',
                        display: 'inline-block',
                        padding: '2px 5px'
                      }}
                    >
                      {platformsMenuOpen ? '▲' : '▼'}
                    </a>
                  )}
                </div>
                <ul className={`dropdown-menu ${platformsMenuOpen ? 'active' : ''}`}>
                  <li className={isActive('/windows')}>
                    <Link href="/windows">Windows</Link>
                  </li>
                  <li className={isActive('/linux')}>
                    <Link href="/linux">Linux</Link>
                  </li>
                  <li className={isActive('/macOS')}>
                    <Link href="/macos">MacOS</Link>
                  </li>
                </ul>
              </li>
              <li className={isActive('/eligibility')}>
                <Link href="/eligibility">Eligibility</Link>
              </li>
              <li className={`dropdown ${isReportsActive()}`}>
                <div 
                  style={{ display: 'flex', alignItems: 'center' }}
                  onClick={(e) => {
                    if (isMobile) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleReportsMenu(e);
                    }
                  }}
                >
                  <Link 
                    href="/scores" 
                    className={`dropdown-link ${isActive('/scores')}`}
                  >
                    Scores
                  </Link>
                  {isMobile && (
                    <a 
                      href="#" 
                      className="dropdown-toggle" 
                      onClick={(e) => { e.preventDefault(); toggleReportsMenu(e) }}
                      onTouchStart={(e) => { e.preventDefault(); toggleReportsMenu(e) }}
                      style={{ 
                        marginLeft: '5px', 
                        fontSize: '0.7rem',
                        display: 'inline-block',
                        padding: '2px 5px'
                      }}
                    >
                      {reportsMenuOpen ? '▲' : '▼'}
                    </a>
                  )}
                </div>
                <ul className={`dropdown-menu ${reportsMenuOpen ? 'active' : ''}`}>
                  <li className={isActive('/statistics')}>
                    <Link href="/statistics">Statistics</Link>
                  </li>
                </ul>
              </li>
              <li className={isActive('/sponsorship')} style={{ whiteSpace: 'nowrap' }}>
                <Link href="/sponsorship">Support Us</Link>
              </li>
              <li className={isActive('/premium-services')} style={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, rgba(52, 152, 219, 0.2), transparent)',
                borderRadius: '4px',
                padding: '0 1px',
                whiteSpace: 'nowrap'
              }}>
                <Link href="/premium-services">Premium Services</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main>{children}</main>

      <footer>
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>EDR Telemetry Project</h3>
              <p>
                Exploring and documenting telemetry capabilities across EDR solutions
                for Windows, Linux, and macOS platforms.
              </p>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/windows">Platforms</Link></li>
                <li><Link href="/eligibility">Eligibility</Link></li>
                <li><Link href="/scores">Scores</Link></li>
                <li><Link href="/statistics">Statistics</Link></li>
                <li><Link href="/sponsorship">Support Us</Link></li>
                <li><Link href="/premium-services">Premium Services</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Documentation</h3>
              <ul>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/telemetry-categories">Telemetry Categories</Link></li>
                <li><Link href="/mitre-mappings">MITRE Mappings</Link></li>
                <li>
                  <span>Resources</span>
                  <ul className="footer-submenu">
                    <li><Link href="/blog">Blog Posts</Link></li>
                    <li><Link href="/contribute">Contribution Guide</Link></li>
                    <li><Link href="/roadmap">Project Roadmap</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Connect</h3>
              <div className="social-links">
                <a href="https://twitter.com/kostastsale" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <div className="social-icon twitter">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                    </svg>
                  </div>
                </a>
                <a href="https://linkedin.com/in/kostastsale" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <div className="social-icon linkedin">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                    </svg>
                  </div>
                </a>
                <a href="https://github.com/tsale/EDR-Telemetry" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                  <div className="social-icon github">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-note">EDR-Telemetry is a project by Defendpoint Consulting — Independent Cybersecurity Advisory &amp; Research.</p>
            <p>&copy; {new Date().getFullYear()} EDR Telemetry Project. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SpeedInsights />
      <Analytics />
    </div>
  )
}

/*
Usage Example:

import TemplatePage from '../components/TemplatePage'

export default function PageName() {
  return (
    <TemplatePage title="Page Title - EDR Telemetry">
      <div className="your-page-container">
        <h1>Your Page Content</h1>
        <p>Your page content goes here...</p>
      </div>
    </TemplatePage>
  )
}
*/ 

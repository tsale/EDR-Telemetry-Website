import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Search from './Search'
import AnnouncementBanner from './AnnouncementBanner'
import Header from './Header'

export default function TemplatePage({ children, title = 'EDR Telemetry Project', description = 'EDR Telemetry Project - Exploring telemetry capabilities of EDR solutions', ogImage = null }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalPath = router.asPath ? router.asPath.split('?')[0] : ''
  const canonicalUrl = siteUrl && canonicalPath ? `${siteUrl}${canonicalPath}` : ''
  // Use provided ogImage or fall back to default logo
  const resolvedOgImage = ogImage ? `${siteUrl}${ogImage}` : (siteUrl ? `${siteUrl}/images/edr_telemetry_logo.png` : '')

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
        {resolvedOgImage && (
          <>
            <meta property="og:image" content={resolvedOgImage} />
            <meta property="og:image:alt" content={title} />
            <meta property="og:image:type" content="image/png" />
            <meta name="twitter:image" content={resolvedOgImage} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <AnnouncementBanner />

      <Header onSearchClick={() => setSearchOpen(true)} />

      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="pb-8">{children}</main>

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

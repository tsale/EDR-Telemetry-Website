import Link from 'next/link'
import { useEffect } from 'react'
import { initializeMobileNav } from '../utils/common'

export default function Navigation() {
  useEffect(() => {
    // Initialize mobile navigation
    initializeMobileNav();
  }, []);

  return (
    <nav>
      <div className="nav-container">
        <div className="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="nav-links">
          <div className="nav-item">
            <Link href="/">Home</Link>
          </div>
          <div className="nav-item">
            <a href="#" className="parent">Platforms</a>
            <div className="subnav">
              <Link href="/windows">Windows</Link>
              <Link href="/linux">Linux</Link>
              <Link href="/macos">MacOS</Link>
            </div>
          </div>
          <div className="nav-item">
            <a href="#" className="parent">EDR Telemetry</a>
            <div className="subnav">
              <Link href="/eligibility">Eligibility Criteria</Link>
              <Link href="/scores">Scores</Link>
              <Link href="/sponsorship">Support Us</Link>
            </div>
          </div>
          <div className="nav-item">
            <Link href="/blog">Blog</Link>
          </div>
          <div className="nav-item">
            <Link href="/premium-services">Premium Services</Link>
          </div>
          <div className="nav-item">
            <Link href="/about" className="parent">About</Link>
            <div className="subnav">
              <Link href="/contribute">Contribute</Link>
              <Link href="/sponsorship">Support Us</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 
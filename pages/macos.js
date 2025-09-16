import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

export default function MacOS() {
  // Use heading links
  useHeadingLinks();
  
  useEffect(() => {
    // For future implementation
  }, [])

  return (
    <TemplatePage title="EDR Telemetry Project - MacOS">
      <div className="hero-section">
        <div className="hero-content">
          <h1>MacOS EDR Telemetry</h1>
          <p>Exploring EDR telemetry capabilities on MacOS platforms</p>
        </div>
      </div>

      <div className="content-section">
        <div className="coming-soon-container">
          <h2>Coming Soon</h2>
          <p>We&apos;re currently working on gathering and analyzing MacOS telemetry data.</p>
          <p>This page will be updated with comprehensive information about MacOS EDR capabilities.</p>
          
          <div className="feature-preview">
            <h3>Planned Features</h3>
            <ul>
              <li>Detailed telemetry comparison across MacOS EDR solutions</li>
              <li>Integration with MITRE ATT&CK framework</li>
              <li>Scoring system for MacOS EDR capabilities</li>
              <li>Filter and search functionality</li>
            </ul>
          </div>
          
          <div className="notification-signup">
            <h3>Get Notified</h3>
            <p>Check back soon for updates or visit our other platform pages:</p>
            <div className="platform-links">
              <Link href="/windows" className="action-button primary-button">Windows Platform</Link>
              <Link href="/linux" className="action-button primary-button">Linux Platform</Link>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 

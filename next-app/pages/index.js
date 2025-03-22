import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'

export default function Home() {
  return (
    <TemplatePage title="EDR Telemetry Project - Home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>EDR Telemetry Project</h1>
          <p>Exploring and comparing telemetry capabilities of leading EDR solutions</p>
        </div>
      </div>

      <div className="content-container">
        <div className="section platforms-section">
          <h2>Platforms</h2>
          <p>Explore EDR telemetry capabilities across different operating systems</p>
          
          <div className="grid grid-3">
            <div className="card">
              <h3>Windows</h3>
              <p>Explore EDR telemetry capabilities on Windows platforms</p>
              <div className="card-footer">
                <Link href="/windows" className="action-button primary-button view-button">View Details</Link>
              </div>
            </div>
            
            <div className="card">
              <h3>Linux</h3>
              <p>Explore EDR telemetry capabilities on Linux platforms</p>
              <div className="card-footer">
                <Link href="/linux" className="action-button primary-button view-button">View Details</Link>
              </div>
            </div>
            
            <div className="card coming-soon-card">
              <h3>MacOS</h3>
              <p>Explore EDR telemetry capabilities on MacOS platforms</p>
              <div className="card-footer">
                <div className="coming-soon-badge">Coming Soon</div>
                <Link href="/macos" className="action-button secondary-button view-button">View Details</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section about-section">
          <h2>About This Project</h2>
          <p>
            The EDR Telemetry Project aims to provide detailed information about the telemetry capabilities
            of various Endpoint Detection and Response (EDR) solutions across different operating systems.
            This resource helps security professionals make informed decisions when selecting EDR solutions.
          </p>
          <div className="about-footer">
            <Link href="/about" className="action-button primary-button view-button">Learn More</Link>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 
import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

export default function Blog() {
  // Use the heading links hook
  useHeadingLinks();
  
  useEffect(() => {
    // Initialize any client-side logic if needed
  }, [])

  return (
    <TemplatePage title="Blog - EDR Telemetry Project">
      <div className="hero-section">
        <div className="hero-content">
          <h1>EDR Telemetry Blog</h1>
          <p>Insights and analysis from our research into EDR telemetry capabilities</p>
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-grid">
          <a href="https://medium.com/detect-fyi/edr-telemetry-project-a-comprehensive-comparison-d5ed1745384b" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="blog-card">
            <img 
                 src="/images/edr_telemetry_logo.png" 
                 alt="EDR Telemetry Project Comparison" 
                 className="blog-image"
            />
            <div className="blog-content">
              <h2 className="blog-title">EDR Telemetry Project: A Comprehensive Comparison</h2>
              <p className="blog-excerpt">Dive into a detailed analysis of EDR solutions and their telemetry capabilities. Learn how different vendors stack up in terms of data collection and monitoring features.</p>
              <span className="blog-link">Read More →</span>
            </div>
          </a>

          <a href="https://medium.com/@kostas-ts/telemetry-on-linux-vs-windows-a-comparative-analysis-849f6b43ef8e" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="blog-card">
            <img 
                 src="/images/windows_vs_linux_telemetry.png" 
                 alt="EDR Telemetry Project Comparison" 
                 className="blog-image"
            />
            <div className="blog-content">
              <h2 className="blog-title">Telemetry on Linux vs Windows: A Comparative Analysis</h2>
              <p className="blog-excerpt">Explore the differences in telemetry capabilities between Linux and Windows operating systems, and understand the implications for security monitoring.</p>
              <span className="blog-link">Read More →</span>
            </div>
          </a>

          <a href="https://kostas-ts.medium.com/edr-telemetry-project-exciting-new-updates-and-insights-2feb693bb4ba?sk=8126c3a8943119e0c28825cc846e6143" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="blog-card">
            <img src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*gD7KayUy00wfqeNfVRSkZA@2x.png" 
                 alt="EDR Telemetry Project Updates" 
                 className="blog-image" />
            <div className="blog-content">
              <h2 className="blog-title">EDR Telemetry Project: Exciting New Updates and Insights</h2>
              <p className="blog-excerpt">Explore the latest EDR Telemetry Project updates: new integrations, refined telemetry, community growth, and an upcoming Linux release!</p>
              <span className="blog-link">Read More →</span>
            </div>
          </a>

          <a href="https://medium.com/@kostas-ts/unveiling-the-gaps-linux-edr-telemetry-in-focus-1290a010ad1b?sk=2f3ced9dbd47c83acd9e6b8fe26af119" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="blog-card">
            <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*GOW7Yy8CvBlMsSWAchbICA.png" 
                 alt="Linux EDR Telemetry Analysis" 
                 className="blog-image"
                 onError={(e) => {e.target.src='/images/windows_vs_linux_telemetry.png'; e.target.onError=null;}} />
            <div className="blog-content">
              <h2 className="blog-title">Unveiling the Gaps: Linux EDR Telemetry in Focus</h2>
              <p className="blog-excerpt">Discover the current state of Linux EDR telemetry, examining the challenges and opportunities in Linux security monitoring.</p>
              <span className="blog-link">Read More →</span>
            </div>
          </a>
        </div>
      </div>
    </TemplatePage>
  )
} 
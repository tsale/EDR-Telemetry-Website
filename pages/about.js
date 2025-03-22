import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function About() {
  useEffect(() => {
    // Page initialization if needed
  }, []);

  return (
    <TemplatePage title="About - EDR Telemetry Project">
      <div className="hero-section">
        <div className="hero-content">
          <h1>About the EDR Telemetry Project</h1>
          <p>A comprehensive comparison of EDR solutions based on their telemetry capabilities, helping organizations make informed security decisions.</p>
        </div>
      </div>
      <div className="about-container">
        <div className="about-grid">
          <div className="about-card">
            <h2 id="project-goals">Project Goals</h2>
            <ul>
              <li>Compare EDR telemetry data collection</li>
              <li>Identify platform strengths and weaknesses</li>
              <li>Guide security professionals in tool selection</li>
              <li>Promote transparency in EDR capabilities</li>
            </ul>
          </div>

          <div className="about-card">
            <h2 id="data-collection">Data Collection</h2>
            <ul>
              <li>Controlled environment testing</li>
              <li>Process monitoring analysis</li>
              <li>Network connection tracking</li>
              <li>File activity monitoring</li>
            </ul>
          </div>

          <div className="about-card">
            <h2 id="how-to-contribute">Contribute</h2>
            <ul>
              <li><Link href="/contribute">Contribution Page</Link></li>
              <li><a href="https://detect.fyi/edr-telemetry-project-a-comprehensive-comparison-d5ed1745384b" target="_blank" rel="noopener noreferrer">Read the Blog Post</a></li>
              <li>Submit issues and suggestions</li>
              <li><Link href="/sponsorship">Join our community</Link></li>
            </ul>
          </div>
        </div>

        {/* Author Section */}
        <div className="author-section">
          <div className="author-image">
            {/* Using a placeholder image until real image is available */}
            <img 
              src="https://pbs.twimg.com/profile_images/1324840358405046272/mAwSPmaX_400x400.jpg" 
              alt="Kostas profile picture" 
              className="author-avatar" 
            />
          </div>
          <div className="author-info">
            <p><strong>Kostas</strong> is a security researcher who focuses on Threat Intelligence, malware, Incident Response, and Threat Hunting. Known for his contributions to various open-source security projects, he is an active member of the cybersecurity community. Opinions are his own.</p>
            {/* Social Media Links */}
            <div className="social-media">
              <strong>Connect with Kostas:</strong><br />
              <a href="https://twitter.com/kostastsale" target="_blank" rel="noopener noreferrer">
                <span className="social-icon twitter-icon"></span> @Kostastsale
              </a><br />
              <a href="https://www.linkedin.com/in/kostastsale/" target="_blank" rel="noopener noreferrer">
                <span className="social-icon linkedin-icon"></span> /in/kostastsale
              </a>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-us-section">
          <p>If you have any questions, feedback, or are interested in contributing to the project, we'd love to hear from you!</p>
          <div className="contact-button-container">
            <Link href="/contact" className="contact-us-button action-button primary-button view-button">Contact Us</Link>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 
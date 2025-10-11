import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'
import Link from 'next/link'

export default function About() {
  useEffect(() => {
    // Page initialization if needed
  }, []);

  return (
    <TemplatePage title="About the EDR Telemetry Project"
      description="Learn the mission, methodology, and transparency principles behind the EDR Telemetry Project.">
      <div className="hero-section">
        <div className="hero-content">
          <h1>About the EDR Telemetry Project</h1>
          <p>EDR-Telemetry is an initiative by Defendpoint Consulting, designed to benchmark EDR products and show exactly what telemetry they capture. Our mission is to give organizations clarity on their visibility gaps and help them build stronger, evidence-based security strategies.</p>
        </div>
      </div>
      <div className="about-container">
        <div className="about-card about-intro-card">
          <p>As part of Defendpoint Consulting&apos;s expertise, the project turns hands-on testing into practical guidance for defenders. We focus on repeatable benchmarking, transparent reporting, and advisory support that connects telemetry results to real-world security programs.</p>
        </div>
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

        {/* Community-Driven Approach Section */}
        <div className="community-section">
          <h2>A Community-Driven Project</h2>
          <p>The EDR Telemetry Project operates within Defendpoint Consulting and is guided by a dedicated community of security professionals, researchers, and enthusiasts. While Kostas maintains the project, critical decisions and direction are shaped by:</p>
          
          <div className="community-points">
            <div className="community-point">
              <h3>Public Feedback</h3>
              <p>Input from users, researchers, and industry professionals helps ensure the project remains relevant and accurate. Every contribution matters.</p>
            </div>
            
            <div className="community-point">
              <h3>Discord Community</h3>
              <p>A trusted Discord community of contributors and supporters collaborates, discusses findings, and helps validate data. This active community plays a crucial role in maintaining quality and expanding coverage.</p>
            </div>
            
            <div className="community-point">
              <h3>Join Us</h3>
              <p>Our community welcomes anyone interested in EDR telemetry. You can join our Discord by <Link href="/contribute">contributing to the project</Link> or <Link href="/sponsorship">subscribing via the Support Us page</Link>. We value diverse perspectives and expertise levels.</p>
            </div>
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
            <h3>Project Maintainer</h3>
            <p><strong>Kostas</strong> is a security researcher who focuses on Threat Intelligence, malware, Incident Response, and Threat Hunting. He leads Defendpoint Consulting&apos;s advisory research practice and serves as the main maintainer of the EDR Telemetry initiative, coordinating community efforts and ensuring the project stays true to its mission of providing transparent, evidence-based EDR telemetry comparisons.</p>
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
          <p>If you have any questions, feedback, or are interested in contributing to the project or joining our Discord community, we&apos;d love to hear from you. For consulting engagements, reach out to the Defendpoint Consulting team directly.</p>
          <div className="contact-button-container">
            <Link href="/contact" className="contact-us-button action-button primary-button view-button">Contact Us</Link>
            <Link href="/sponsorship" className="contact-us-button action-button secondary-button view-button">Join Our Community</Link>
            <a
              href="https://defendpoint.ca/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-us-button action-button secondary-button view-button"
            >
              Defendpoint Consulting
            </a>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 

import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import Head from 'next/head'

export default function PremiumServices() {
  // Use the heading links hook
  useHeadingLinks();
  
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <TemplatePage 
        title="Premium Expert Security Services - EDR Telemetry Project" 
        description="Access expert security services including EDR Vendor Evaluation, Custom Telemetry Configuration, Advanced Detection Engineering, and Investigation Experience Testing."
      >
        <div className="hero-section">
          <div className="hero-content">
            <h1>EDR Vendor Evaluation Services</h1>
            <p>Expert solutions for assessing and optimizing your EDR telemetry</p>
          </div>
        </div>

        <div className="premium-container">

          <div className="service-card featured-service">
            <div className="highlight-ribbon">Featured Service</div>
            <div className="service-header">
              <h3>EDR Vendor Evaluation Services</h3>
            </div>
            <div className="service-content">
              <p>Comprehensive assessment of EDR vendor telemetry capabilities to identify gaps and optimize security visibility.</p>
              <ul>
                <li>Baseline telemetry & competitive gap analysis</li>
                <li>Field-level data quality and usability review</li>
                <li>Investigation experience assessment with simulated attacks</li>
                <li>API and integration capability testing</li>
                <li>Strategic roadmap recommendations</li>
              </ul>
              <div className="service-footer">
                <a href="/contact" className="action-button primary-button">Get Started</a>
              </div>
            </div>
          </div>

          <section className="enterprise-section">
            <div className="section-header">
              <h2 id="enterprise-solutions">Enterprise EDR Assessment Solutions</h2>
              <p>Comprehensive telemetry evaluation and strategic advisory for security teams</p>
            </div>
            <div className="enterprise-content">
              <div className="enterprise-text">
                <p>For organizations seeking in-depth EDR evaluation and telemetry optimization, we offer a structured assessment framework that includes:</p>
                <ul>
                  <li><strong>Telemetry Gap Analysis:</strong> Establish baseline understanding of your EDR's telemetry coverage and identify competitive gaps in detection capabilities</li>
                  <li><strong>Field-Level Data Quality Review:</strong> Analyze telemetry data fields for quality, completeness, and investigative value across core activity types</li>
                  <li><strong>Investigation Experience Testing:</strong> Evaluate your EDR's telemetry during simulated intrusions to identify visibility gaps and friction points</li>
                  <li><strong>API & Integration Assessment:</strong> Test telemetry accessibility via APIs and evaluate integration capabilities with SIEM/SOAR platforms</li>
                  <li><strong>Strategic Roadmap Development:</strong> Create prioritized recommendations for short, mid, and long-term telemetry improvements</li>
                </ul>
                <a href="/contact" className="action-button primary-button">Request Enterprise Assessment</a>
              </div>
              <div className="enterprise-image">
                <span>Telemetry Assessment</span>
              </div>
            </div>
          </section>

          <div className="section-header">
            <h2>Expert Security Services</h2>
            <p>Enhance your organization's security posture through advanced EDR telemetry analysis and optimization</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-header">
                <h3>EDR Assessment & Selection</h3>
              </div>
              <div className="service-content">
                <p>Expert guidance on selecting the right EDR solution for your specific security needs and technical environment.</p>
                <ul>
                  <li>Comprehensive requirements analysis</li>
                  <li>Vendor capability comparison</li>
                  <li>Feature mapping to security objectives</li>
                  <li>Implementation planning</li>
                  <li>ROI analysis and reporting</li>
                </ul>
                <div className="service-footer">
                  <a href="/contact" className="action-button primary-button">Get Started</a>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Custom Telemetry Configuration</h3>
              </div>
              <div className="service-content">
                <p>Optimize your EDR telemetry collection to focus on the threats most relevant to your organization.</p>
                <ul>
                  <li>EDR telemetry tuning and optimization</li>
                  <li>Custom detection rule development</li>
                  <li>False positive reduction</li>
                  <li>Performance impact assessment</li>
                  <li>Implementation documentation</li>
                </ul>
                <div className="service-footer">
                  <a href="/contact" className="action-button primary-button">Get Started</a>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Advanced Detection Engineering</h3>
              </div>
              <div className="service-content">
                <p>Build custom detection capabilities leveraging your EDR's telemetry collection features.</p>
                <ul>
                  <li>Threat modeling for your environment</li>
                  <li>Custom detection rule development</li>
                  <li>MITRE ATT&CK framework alignment</li>
                  <li>Detection testing and validation</li>
                  <li>Knowledge transfer and training</li>
                </ul>
                <div className="service-footer">
                  <a href="/contact" className="action-button primary-button">Get Started</a>
                </div>
              </div>
            </div>
          </div>
          
          <section className="cta-section">
            <h2>Unlock the full potential of your EDR telemetry</h2>
            <p>Our expert services help you evaluate, optimize, and leverage EDR telemetry to maximize security visibility and response capabilities</p>
            <div className="cta-buttons">
              <a href="/contact" className="action-button primary-button" style={{
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto',
                cursor: 'pointer',
                color: 'white'
              }}>
                Contact Us
              </a>
            </div>
          </section>

          <section className="calendar-section">
            <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
              <h2>Schedule a Consultation</h2>
              <p>Book a time to discuss how we can help with your EDR evaluation needs</p>
            </div>
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/kostas-edr-telemetry/30min-initial-chat"
            ></div>
          </section>
        </div>
      </TemplatePage>
    </>
  )
} 
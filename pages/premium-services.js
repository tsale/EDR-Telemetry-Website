import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

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
        title="Defendpoint Consulting Telemetry Services - EDR Telemetry Project" 
        description="Benchmark your EDR visibility with Defendpoint Consulting. Access expert telemetry benchmarking, premium reporting, and advisory services backed by the EDR-Telemetry research program."
      >
        <div className="hero-section">
          <div className="hero-content">
            <h1>EDR Telemetry Benchmarking by Defendpoint Consulting</h1>
            <p>Evidence-led benchmarking, premium reporting, and advisory services delivered through the Defendpoint Consulting practice.</p>
          </div>
        </div>

        <div className="premium-container">
          <section className="service-card overview-intro">
            <div className="service-header">
              <h3>Defendpoint Expertise Behind EDR-Telemetry</h3>
            </div>
            <div className="service-content">
              <p>EDR-Telemetry engagements are run by Defendpoint Consulting&apos;s incident responders and detection engineers. We combine the project&apos;s open research with advisory experience to deliver the same benchmarking rigor you see on the platform, tailored to your environment.</p>
              <p>Benchmarking and reporting remain the core deliverables, now backed by a broader consulting capability that can help your team interpret findings, prioritize investments, and operationalize outcomes.</p>
            </div>
          </section>

          <div className="service-card featured-service">
            <div className="highlight-ribbon">Featured Service</div>
            <div className="service-header">
              <h3>EDR Telemetry Benchmarking Engagements</h3>
            </div>
            <div className="service-content">
              <p>Comprehensive benchmarking of your selected EDR platform against the telemetry visibility expected by Defendpoint Consulting&apos;s standard. Ideal for side-by-side vendor analysis or validating production deployments.</p>
              <ul>
                <li>Baseline telemetry coverage review mapped to EDR-Telemetry benchmarks</li>
                <li>Field-level data quality and investigative signal analysis</li>
                <li>Comparative reporting across vendors or configurations</li>
                <li>Operational recommendations for policy tuning and enrichment</li>
                <li>Executive and practitioner-ready reporting packages</li>
              </ul>
              <div className="service-footer">
                <Link href="/contact" className="action-button primary-button">Get Started</Link>
              </div>
            </div>
          </div>

          <div className="service-card premium-reporting">
            <div className="service-header">
              <h3>Premium Reporting &amp; Advisory Support</h3>
            </div>
            <div className="service-content">
              <p>Extend your benchmarking engagement with ongoing reporting and analyst support from Defendpoint Consulting to keep stakeholders aligned on telemetry maturity.</p>
              <ul>
                <li>Quarterly or milestone-based telemetry updates</li>
                <li>Deep dives into detection coverage by tactic and use case</li>
                <li>Audience-specific reporting for technical and executive teams</li>
                <li>Guided working sessions to interpret findings and plan next steps</li>
                <li>Optional integration with existing governance and risk programs</li>
              </ul>
              <div className="service-footer">
                <Link href="/contact" className="action-button primary-button">Request Reporting Support</Link>
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
                <p>For organizations seeking in-depth EDR evaluation and telemetry optimization, Defendpoint Consulting offers a structured assessment framework that includes:</p>
                <ul>
                  <li><strong>Telemetry Gap Analysis:</strong> Establish baseline understanding of your EDR&apos;s telemetry coverage and identify competitive gaps in detection capabilities</li>
                  <li><strong>Field-Level Data Quality Review:</strong> Analyze telemetry data fields for quality, completeness, and investigative value across core activity types</li>
                  <li><strong>Investigation Experience Testing:</strong> Evaluate your EDR&apos;s telemetry during simulated intrusions to identify visibility gaps and friction points</li>
                  <li><strong>API &amp; Integration Assessment:</strong> Test telemetry accessibility via APIs and evaluate integration capabilities with SIEM/SOAR platforms</li>
                  <li><strong>Strategic Roadmap Development:</strong> Create prioritized recommendations for short, mid, and long-term telemetry improvements</li>
                </ul>
                <Link href="/contact" className="action-button primary-button">Request Enterprise Assessment</Link>
              </div>
              <div className="enterprise-image">
                <span>Telemetry Assessment</span>
              </div>
            </div>
          </section>

          <div className="section-header">
            <h2>Expert Security Services</h2>
            <p>Enhance your organization&apos;s security posture through advanced EDR telemetry analysis and optimization</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-header">
                <h3>EDR Assessment &amp; Selection</h3>
              </div>
              <div className="service-content">
                <p>Expert guidance from Defendpoint Consulting on selecting the right EDR solution for your specific security needs and technical environment.</p>
                <ul>
                  <li>Comprehensive requirements analysis</li>
                  <li>Vendor capability comparison</li>
                  <li>Feature mapping to security objectives</li>
                  <li>Implementation planning</li>
                  <li>ROI analysis and reporting</li>
                </ul>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Custom Telemetry Configuration</h3>
              </div>
              <div className="service-content">
                <p>Optimize your EDR telemetry collection with Defendpoint Consulting to focus on the threats most relevant to your organization.</p>
                <ul>
                  <li>EDR telemetry tuning and optimization</li>
                  <li>Custom detection rule development</li>
                  <li>False positive reduction</li>
                  <li>Performance impact assessment</li>
                  <li>Implementation documentation</li>
                </ul>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Advanced Detection Engineering</h3>
              </div>
              <div className="service-content">
                <p>Build custom detection capabilities leveraging your EDR&apos;s telemetry collection features, supported by Defendpoint Consulting&apos;s detection engineers.</p>
                <ul>
                  <li>Threat modeling for your environment</li>
                  <li>Custom detection rule development</li>
                  <li>MITRE ATT&amp;CK framework alignment</li>
                  <li>Detection testing and validation</li>
                  <li>Knowledge transfer and training</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="service-card consulting-callout">
            <div className="service-header">
              <h3>Looking for Full Endpoint Consulting?</h3>
            </div>
            <div className="service-content">
              <p>Beyond telemetry benchmarking, we offer complete cybersecurity consulting through Defendpoint Consulting.</p>
              <p>Our services include EDR deployment, policy creation, security architecture, and cost optimization.</p>
              <div className="service-footer">
                <a
                  href="https://defendpoint.ca/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button secondary-button"
                >
                  Contact Defendpoint Consulting
                </a>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2>Unlock the full potential of your EDR telemetry</h2>
            <p>Our expert services help you evaluate, optimize, and leverage EDR telemetry to maximize security visibility and response capabilities</p>
            <div className="cta-buttons">
              <Link href="/contact" className="action-button primary-button" style={{
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto',
                cursor: 'pointer',
                color: 'white'
              }}>
                Get Started
              </Link>
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

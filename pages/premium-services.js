import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

export default function PremiumServices() {
  useHeadingLinks()

  useEffect(() => {
    const scriptId = 'calendly-widget-script'

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    }

    return () => {
      const existing = document.getElementById(scriptId)
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing)
      }
    }
  }, [])

  return (
    <TemplatePage
      title="Defendpoint Consulting Telemetry Services - EDR Telemetry Project"
      description="Benchmark your EDR visibility with Defendpoint Consulting. Access expert telemetry benchmarking, premium reporting, and advisory services backed by the EDR-Telemetry research program."
    >
      <section className="hero-section premium-hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Premium Services</p>
          <h1>Premium Telemetry Services by Defendpoint Consulting</h1>
          <p>A streamlined set of benchmarking and advisory engagements powered by the EDR Telemetry research program.</p>
          <div className="hero-actions">
            <a
              href="https://defendpoint.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="action-button primary-button"
            >
              Visit Defendpoint Consulting
            </a>
            <Link href="#services" className="action-button secondary-button">
              View engagements
            </Link>
          </div>
        </div>
      </section>

      <div className="premium-container" id="services">
        <div className="section-header">
          <h2>Focused engagements, practical outcomes</h2>
          <p>We concentrated the most requested work into three modular engagements that keep your telemetry program moving.</p>
        </div>

        <div className="services-grid">
          <article className="service-card">
            <div className="service-header">
              <h3>EDR Telemetry Benchmarking</h3>
            </div>
            <div className="service-content">
              <p>Vendor-neutral benchmarking that mirrors what you see on the platform, tailored to your deployment.</p>
              <ul>
                <li>Baseline coverage review against EDR Telemetry expectations</li>
                <li>Field quality validation and practical remediation guidance</li>
                <li>Side-by-side comparisons to support tool selection</li>
              </ul>
            </div>
            <div className="service-footer">
              <a
                href="https://defendpoint.ca/#contact"
                target="_blank"
                rel="noopener noreferrer"
                className="action-button primary-button"
              >
                Discuss benchmarking
              </a>
            </div>
          </article>

          <article className="service-card">
            <div className="service-header">
              <h3>Premium Reporting &amp; Advisory</h3>
            </div>
            <div className="service-content">
              <p>Concise reporting and analyst support that keep stakeholders aligned on telemetry maturity.</p>
              <ul>
                <li>Quarterly refreshes with tactic-level coverage insights</li>
                <li>Audience-specific briefings for engineers and executives</li>
                <li>Working sessions to prioritize next steps with confidence</li>
              </ul>
            </div>
            <div className="service-footer">
              <a
                href="https://defendpoint.ca/#contact"
                target="_blank"
                rel="noopener noreferrer"
                className="action-button primary-button"
              >
                Schedule a briefing
              </a>
            </div>
          </article>

          <article className="service-card">
            <div className="service-header">
              <h3>Enterprise Telemetry Programs</h3>
            </div>
            <div className="service-content">
              <p>Structured, multi-team engagements for organizations building long-term telemetry strategies.</p>
              <ul>
                <li>Readiness assessments covering endpoints, servers, and cloud</li>
                <li>Detection engineering workshops aligned to MITRE ATT&amp;CK</li>
                <li>Implementation roadmaps with measurable milestones</li>
              </ul>
            </div>
            <div className="service-footer">
              <a
                href="https://defendpoint.ca/#contact"
                target="_blank"
                rel="noopener noreferrer"
                className="action-button primary-button"
              >
                Plan an engagement
              </a>
            </div>
          </article>
        </div>

        <section className="service-card consulting-redirect">
          <div className="service-header">
            <h3>Continue at Defendpoint Consulting</h3>
          </div>
          <div className="service-content">
            <p>Full engagement details, broader cybersecurity offerings, and contact options now live on the Defendpoint Consulting site.</p>
            <div className="service-footer">
              <a
                href="https://defendpoint.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="action-button primary-button"
              >
                Go to Defendpoint Consulting
              </a>
            </div>
          </div>
        </section>

        <section className="calendar-section">
          <div className="section-header" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            <h2>Schedule a Consultation</h2>
            <p>Book a time to discuss your telemetry goals with Defendpoint Consulting.</p>
          </div>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/kostas-edr-telemetry/30min-initial-chat"
          ></div>
        </section>
      </div>
    </TemplatePage>
  )
}

import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove)
      return () => heroElement.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const stats = [
    { value: "20+", label: "EDR Solutions Analyzed" },
    { value: "3", label: "Platforms Covered" },
    { value: "100%", label: "Open Source" },
    { value: "✓", label: "Vendor Agnostic" },
    ]

  return (
    <TemplatePage 
      title="EDR Telemetry Project: Transparent Benchmarking & Telemetry Analysis for Businesses"
      description="Explore transparent, vendor-neutral EDR telemetry benchmarks. Make confident security decisions with real-world data and practical analysis for your business."
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'EDR Telemetry Project',
            url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
            logo: (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/images/edr_telemetry_logo.png` : 'https://example.com/images/edr_telemetry_logo.png'),
            sameAs: [
              'https://github.com/tsale/EDR-Telemetry',
              'https://twitter.com/kostastsale',
              'https://linkedin.com/in/kostastsale'
            ],
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'EDR Telemetry Project',
            url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
            potentialAction: {
              '@type': 'SearchAction',
              target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }) }}
        />
      </Head>
      {/* Modern Hero Section */}
      <section 
        ref={heroRef}
        className="hero-modern"
      >
        {/* Background Grid */}
        <div className="hero-grid" />
        
        {/* Mouse-following glow */}
        <div
          className="hero-glow"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150
          }}
        />

        <div className="hero-content-modern">
          {/* Status Badge */}
          <div className="badge-modern">
            <div className="badge-indicator" />
            EDR Telemetry Comparison Platform
          </div>

          {/* Main Heading with improved typography */}
          <h1 className="heading-modern">
            EDR Telemetry of{' '}
            <span className="heading-gradient">
              Modern EDR Solutions
            </span>
          </h1>

          {/* Enhanced Description */}
          <p className="description-modern">
            Comprehensive endpoint detection and response analysis with real-time telemetry comparison, 
            behavioral analytics insights, and detailed platform coverage to help security professionals 
            make informed EDR decisions.
          </p>

          {/* CTA Buttons */}
          <div className="button-container-modern">
            <Link href="/scores" className="button-primary-modern">
              <span style={{marginRight: '0.5rem'}}>🏁</span>
              Explore Scores
            </Link>
            <Link href="/about" className="button-secondary-modern">
              <span style={{marginRight: '0.5rem'}}>🌐</span>
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid-modern">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item-modern">
                <div className="stat-value-modern">
                  {stat.value}
                </div>
                <div className="stat-label-modern-index">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <p className="hero-powered-by">Powered by Defendpoint Consulting</p>
        </div>
      </section>

      <div className="content-container">
        {/* Value Proposition / How to Use Data */}
        <div className="section">
          <div className="section-header-modern">
            <div className="section-badge-modern">
              <span>🧭</span>
              How to Use EDR Telemetry Data
            </div>
            <h2 className="section-title-modern">Make Evidence-Based EDR Decisions</h2>
            <p className="section-description-modern">
              Use our vendor-neutral research to compare telemetry depth across platforms, validate deployment quality, and set clear improvement priorities.
            </p>
          </div>
          <div className="features-list-modern" style={{maxWidth: '1100px', margin: '0 auto'}}>
            <div className="feature-item-modern"><div className="feature-icon-modern blue">✓</div><span className="feature-text-modern">Compare depth and coverage using <Link href="/scores">Scores</Link> and <Link href="/statistics">Statistics</Link></span></div>
            <div className="feature-item-modern"><div className="feature-icon-modern green">✓</div><span className="feature-text-modern">Explore specific signals in <Link href="/telemetry-categories">Telemetry Categories</Link></span></div>
            <div className="feature-item-modern"><div className="feature-icon-modern purple">✓</div><span className="feature-text-modern">Check scope and inclusion rules in <Link href="/eligibility">Eligibility</Link></span></div>
            <div className="feature-item-modern"><div className="feature-icon-modern blue">✓</div><span className="feature-text-modern">Read program direction in <Link href="/about">About</Link> and <Link href="/blog">Blog</Link></span></div>
          </div>
        </div>

        {/* Modern Platforms Section */}
        <div className="section platforms-section">
          {/* Section Header */}
          <div className="section-header-modern">
            <div className="section-badge-modern">
              <div className="section-badge-indicator" />
              Platform Coverage
            </div>
            <h2 className="section-title-modern">
              Explore EDR Capabilities
            </h2>
            <p className="section-description-modern">
              Comprehensive analysis of EDR telemetry capabilities across different operating systems
            </p>
          </div>
          
          {/* Enhanced Platform Cards */}
          <div className="cards-grid-modern">
            {/* Windows Card */}
            <div className="card-modern windows">
              <div className="card-gradient-top windows"></div>
              <div className="card-bg-circle windows"></div>
              
              <div className="card-content-modern">
                <div className="card-icon-modern windows">
                  <span>🪟</span>
                </div>
                <h3 className="card-title-modern">
                  Windows
                </h3>
                <p className="card-description-modern">
                  Comprehensive EDR telemetry analysis for Windows platforms with detailed event coverage.
                </p>
                <div className="card-footer-modern">
                  <Link href="/windows" className="card-button-modern windows">
                    View Details
                    <span className="card-arrow-modern">→</span>
                  </Link>
                  <div className="card-status-modern available windows">
                    Available
                  </div>
                </div>
              </div>
            </div>

            {/* Linux Card */}
            <div className="card-modern linux">
              <div className="card-gradient-top linux"></div>
              <div className="card-bg-circle linux"></div>
              
              <div className="card-content-modern">
                <div className="card-icon-modern linux">
                  <span>🐧</span>
                </div>
                <h3 className="card-title-modern">
                  Linux
                </h3>
                <p className="card-description-modern">
                  In-depth EDR telemetry analysis for Linux distributions with system-level monitoring.
                </p>
                <div className="card-footer-modern">
                  <Link href="/linux" className="card-button-modern linux">
                    View Details
                    <span className="card-arrow-modern">→</span>
                  </Link>
                  <div className="card-status-modern available linux">
                    Available
                  </div>
                </div>
              </div>
            </div>
            
            {/* macOS Card */}
            <div className="card-modern macos" style={{opacity: '0.75'}}>
              <div className="card-gradient-top macos"></div>
              <div className="card-bg-circle macos"></div>
              
              <div className="card-content-modern">
                <div className="card-icon-modern macos">
                  <span>🍎</span>
                </div>
                <h3 className="card-title-modern">
                  MacOS
                </h3>
                <p className="card-description-modern">
                  Upcoming EDR telemetry analysis for macOS platforms with native security framework integration.
                </p>
                <div className="card-footer-modern">
                  <Link href="/macos" className="card-button-modern macos">
                    View Details
                    <span>→</span>
                  </Link>
                  <div className="card-status-modern coming-soon">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced About Section */}
        <div className="section about-section-modern">
          <div className="section-header-modern">
            <div className="section-badge-modern">
              <span>📊</span>
              Project Mission
            </div>
            <h2 className="section-title-modern">About This Project</h2>
          </div>
          
          <div className="about-content-modern">
            <div>
              <p className="about-text-modern">
                The EDR Telemetry Project provides comprehensive analysis of endpoint detection and response 
                capabilities across major operating systems. Our research helps security professionals understand 
                the telemetry landscape and make informed decisions.
              </p>
              
              <div className="features-list-modern">
                <div className="feature-item-modern">
                  <div className="feature-icon-modern blue">
                    <span>✓</span>
                  </div>
                  <span className="feature-text-modern">Comprehensive platform coverage</span>
                </div>
                <div className="feature-item-modern">
                  <div className="feature-icon-modern green">
                    <span>✓</span>
                  </div>
                  <span className="feature-text-modern">Real-time telemetry analysis</span>
                </div>
                <div className="feature-item-modern">
                  <div className="feature-icon-modern purple">
                    <span>✓</span>
                  </div>
                  <span className="feature-text-modern">Open source methodology</span>
                </div>
              </div>
            </div>
            
            <div className="mockup-modern">
              <div className="mockup-window-modern">
                <div className="mockup-dots-modern">
                  <div className="mockup-dot-modern red"></div>
                  <div className="mockup-dot-modern yellow"></div>
                  <div className="mockup-dot-modern green"></div>
                </div>
                <div className="mockup-bars-modern">
                  <div className="mockup-bar-modern full"></div>
                  <div className="mockup-bar-modern three-quarters"></div>
                  <div className="mockup-bar-modern five-sixths"></div>
                  <div className="mockup-bar-modern two-thirds"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <Link href="/about" className="cta-button-about-modern">
              <span style={{marginRight: '0.5rem'}}>📚</span>
              Learn More About Our Research
            </Link>
          </div>
        </div>

        {/* Audience and Benefits */}
        <div className="section">
          <div className="section-header-modern">
            <div className="section-badge-modern"><span>🏢</span>Who Benefits</div>
            <h2 className="section-title-modern">Built for Security and Business Teams</h2>
          </div>
          <div className="features-list-modern" style={{maxWidth: '1100px', margin: '0 auto'}}>
            <div className="feature-item-modern"><div className="feature-icon-modern blue">✓</div><span className="feature-text-modern"><strong>Mid-sized businesses</strong>: validate telemetry readiness and reduce blind spots</span></div>
            <div className="feature-item-modern"><div className="feature-icon-modern green">✓</div><span className="feature-text-modern"><strong>Large enterprises</strong>: benchmark across fleets and guide platform strategy</span></div>
            <div className="feature-item-modern"><div className="feature-icon-modern purple">✓</div><span className="feature-text-modern"><strong>Security leaders</strong>: communicate coverage and risk with objective metrics</span></div>
            <div className="feature-item-modern"><div className="feature-icon-modern blue">✓</div><span className="feature-text-modern"><strong>Detection engineers</strong>: map signals to ATT&amp;CK and reduce alert friction</span></div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="section">
          <div className="section-header-modern">
            <div className="section-badge-modern"><span>❓</span>Frequently Asked Questions</div>
            <h2 className="section-title-modern">FAQs</h2>
          </div>
          <div style={{maxWidth: '1100px', margin: '0 auto'}}>
            <h3>Is the research vendor-neutral?</h3>
            <p>Yes. The EDR Telemetry Project is vendor-agnostic and focuses on transparent, evidence-based comparisons.</p>
            <h3>Can we use this to guide procurement?</h3>
            <p>Absolutely. Use the platform scores, category depth, and eligibility criteria to frame objective evaluations.</p>
            <h3>Do you offer help applying the benchmarks?</h3>
            <p>Yes. See <Link href="/premium-services">Premium Services</Link> for benchmarking and advisory support.</p>
          </div>
          <Head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Is the research vendor-neutral?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Yes. The EDR Telemetry Project is vendor-agnostic and focuses on transparent, evidence-based comparisons.' }
                  },
                  {
                    '@type': 'Question',
                    name: 'Can we use this to guide procurement?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Use the platform scores, category depth, and eligibility criteria to frame objective evaluations.' }
                  },
                  {
                    '@type': 'Question',
                    name: 'Do you offer help applying the benchmarks?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Yes. See Premium Services for benchmarking and advisory support.' }
                  }
                ]
              }) }}
            />
          </Head>
        </div>
      </div>
    </TemplatePage>
  )
} 

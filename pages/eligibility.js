import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Info,
  Scale,
  Search,
  Shield,
  XCircle,
} from 'lucide-react'
import { SITE_URL } from '../lib/site'

const definitions = [
  {
    id: 'core-requirements',
    title: 'Core requirements',
    icon: Shield,
    tone: 'blue',
    copy:
      'Included products must provide real-time event collection, automated telemetry without manual pulls, and out-of-the-box EDR capabilities as a dedicated endpoint sensor.',
  },
  {
    id: 'edr-telemetry-definition',
    title: 'EDR telemetry',
    icon: Eye,
    tone: 'emerald',
    copy:
      'Data or events automatically collected and transmitted by a sensor as activity occurs. Live query, artifact access, and correlation-only signals do not qualify.',
  },
  {
    id: 'exclusion-factors',
    title: 'Exclusion factors',
    icon: XCircle,
    tone: 'red',
    copy:
      'Products that lack continuous real-time streaming, require manual collection, or withhold raw telemetry from customer analysis stay out of scope.',
  },
  {
    id: 'direct-vs-inferred',
    title: 'Direct vs inferred',
    icon: Scale,
    tone: 'amber',
    copy:
      'Each scored event must capture a distinct system action directly. Inferring service creation from a generic process event is not full credit.',
  },
]

const standardCards = [
  {
    id: 'near-real-time-window',
    title: 'Near-real-time window',
    tone: 'blue',
    icon: Clock,
    copy:
      'Telemetry should be available for customer search within ten minutes by default, unless an engagement defines a different window.',
  },
  {
    id: 'consumer-availability',
    title: 'Consumer availability',
    tone: 'emerald',
    icon: Eye,
    copy:
      'Telemetry must be reachable through the agreed product UI, API, or export without vendor engineering, support-only retrieval, or manual backend extraction.',
  },
  {
    id: 'directness-requirement',
    title: 'Directness requirement',
    tone: 'amber',
    icon: CheckCircle,
    copy:
      'Direct events count. Inferences from unrelated file, process, registry, or log activity do not receive full direct-event credit.',
  },
]

const exclusions = [
  {
    product: 'Sandfly',
    reason: 'No Real-time Streaming',
    details: [
      'Lacks continuous real-time telemetry streaming capabilities of traditional EDR solutions',
      'Focuses on periodic scanning and threat hunting rather than continuous monitoring',
      'Designed for point-in-time forensics and incident response rather than real-time detection',
    ],
  },
  {
    product: 'Velociraptor',
    reason: 'Manual Collection Required',
    details: [
      'Relies on manual VQL queries for artifact collection',
      'No continuous automated telemetry stream',
      'Better suited for incident response than continuous monitoring',
    ],
  },
  {
    product: 'OSquery (standalone)',
    reason: 'No Real-time Collection',
    details: [
      'Designed for point-in-time queries',
      'Lacks native event streaming capability',
      'Requires additional tooling for continuous monitoring',
    ],
  },
  {
    product: 'Huntress EDR',
    reason: 'Limited EDR Functionality',
    details: [
      'Lacks direct access to raw telemetry data for customer analysis and investigation',
      'Managed threat hunting platform rather than traditional EDR',
      'Limited endpoint telemetry visibility for customers',
    ],
  },
  {
    product: 'Cisco EDR',
    reason: 'Limited EDR Functionality',
    details: [
      'Lacks direct access to raw telemetry data for customer analysis and investigation',
      'Requires additional modules and licensing for basic EDR capabilities',
      'Limited endpoint telemetry visibility in base product',
    ],
  },
  {
    product: 'Tanium',
    reason: 'Limited Real-Time Telemetry',
    details: [
      'Primarily focuses on forensic endpoint visibility rather than real-time telemetry ingestion',
      'Uses polling-based architecture instead of continuous event streaming, leading to potential telemetry gaps',
      'Lacks continuous real-time process creation, file modification, and script execution monitoring',
    ],
  },
  {
    product: 'Kaspersky',
    reason: 'Limited Telemetry Access',
    details: [
      'Does not provide open access to detailed raw telemetry data',
      'Telemetry data is aggregated, limiting granular event-level visibility',
    ],
  },
  {
    product: 'Aurora',
    reason: 'Not a Full EDR Solution',
    details: [
      'Functions as a threat detection engine rather than a complete EDR solution',
      'Relies on log ingestion and rule-based detection instead of real-time telemetry collection',
      'Does not stream telemetry data to a centralized location for real-time analysis and monitoring',
    ],
  },
  {
    product: 'Wazuh',
    reason: 'Different Product Category',
    details: [
      'Designed as a Unified XDR and SIEM platform with broader security monitoring scope beyond traditional EDR',
      'While offering native telemetry capabilities, architecture differs from dedicated EDR sensor-based implementations',
      'Platform focuses on unified security operations rather than specialized endpoint-centric EDR telemetry depth',
    ],
  },
]

const navSections = [
  { id: 'definitions', label: 'Definitions' },
  { id: 'telemetry-eligibility-standard', label: 'Standard' },
  { id: 'telemetry-vs-inferred-comparison', label: 'Directness' },
  { id: 'ineligible-solutions', label: 'Exclusions' },
]

export default function Eligibility() {
  useHeadingLinks()
  const [activeSection, setActiveSection] = useState('definitions')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    navSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const filteredExclusions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return exclusions
    return exclusions.filter((item) => {
      const haystack = [item.product, item.reason, ...item.details].join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, [searchTerm])

  const title = 'EDR Eligibility & Scope Criteria | EDR Telemetry Project'
  const description =
    'Inclusion rules, exclusions, and definitions used when a product is compared for EDR telemetry visibility.'

  return (
    <TemplatePage
      title={title}
      description={description}
      ogTitle={title}
      ogDescription={description}
      canonicalPath="/eligibility"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: title,
              url: `${SITE_URL}/eligibility`,
              description,
              isPartOf: { '@type': 'WebSite', name: 'EDR Telemetry Project', url: SITE_URL },
            }),
          }}
        />
      </Head>

      <section className="elig-hero">
        <div className="elig-hero-orb elig-hero-orb--blue" aria-hidden="true" />
        <div className="elig-hero-orb elig-hero-orb--slate" aria-hidden="true" />
        <div className="elig-hero-inner">
          <span className="elig-badge">
            <Shield className="w-4 h-4" aria-hidden="true" />
            Scope criteria
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 !text-white leading-tight">
            Eligibility and excluded products
          </h1>
          <p className="text-lg md:text-xl !text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Rules that decide which products belong in the public telemetry comparison, and which
            stay out of scope.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#telemetry-eligibility-standard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 !text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Eye className="w-5 h-5 mr-2" aria-hidden="true" />
              View requirements
            </a>
            <a
              href="#ineligible-solutions"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-600 hover:bg-slate-800 !text-slate-200 font-bold transition-all"
            >
              View exclusions
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <nav className="elig-nav" aria-label="Eligibility sections">
        <div className="elig-nav-inner">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`elig-nav-pill${activeSection === section.id ? ' is-active' : ''}`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="elig-body">
        <section id="definitions" className="elig-section">
          <div className="elig-section-inner">
            <div className="elig-header center mb-10">
              <p className="elig-kicker">Foundations</p>
              <h2 className="elig-title">Key definitions</h2>
              <p className="elig-lead">
                Terms used in the inclusion and exclusion rules below.
              </p>
            </div>
            <div className="elig-def-grid">
              {definitions.map(({ id, title: defTitle, icon: Icon, tone, copy }, index) => (
                <article key={id} className={`elig-def-card elig-def-card--${tone}`}>
                  <div className="elig-def-card-top">
                    <div className="elig-def-icon" aria-hidden="true">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="elig-def-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 id={id} className="elig-def-title">
                    {defTitle}
                  </h3>
                  <p className="elig-def-copy">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="telemetry-eligibility-standard" className="elig-section elig-section--muted">
          <div className="elig-section-inner">
            <div className="elig-panel">
              <div className="elig-header mb-8">
                <p className="elig-kicker">Scoring gate</p>
                <h2 className="elig-title">Telemetry eligibility standard</h2>
                <p className="elig-lead elig-lead--wide">
                  A product must expose automatically collected telemetry that a customer can search,
                  export, hunt on, or use for investigation. Live query, point-in-time artifact
                  collection, historical backfill, manual collection, and backend-only conclusions do
                  not qualify as scoring telemetry.
                </p>
              </div>

              <div className="elig-standard-grid">
                {standardCards.map(({ id, title: cardTitle, tone, icon: Icon, copy }) => (
                  <article key={id} className={`elig-standard-card elig-standard-card--${tone}`}>
                    <Icon className="w-6 h-6 mb-3" aria-hidden="true" />
                    <h3 id={id} className="elig-standard-title">
                      {cardTitle}
                    </h3>
                    <p className="elig-standard-copy">{copy}</p>
                  </article>
                ))}
              </div>

              <Link href="/methodology#valid-telemetry-criteria" className="elig-inline-link">
                Read the full methodology criteria
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section id="telemetry-vs-inferred-comparison" className="elig-section">
          <div className="elig-section-inner">
            <div className="elig-header center mb-10">
              <p className="elig-kicker">Directness</p>
              <h2 className="elig-title">Direct telemetry vs substitutes</h2>
              <p className="elig-lead">
                Each telemetry event must represent a distinct system action, captured directly
                rather than inferred.
              </p>
            </div>
            <div className="elig-compare">
              <article className="elig-compare-card elig-compare-card--yes">
                <p className="elig-compare-label">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Direct telemetry</span>
                </p>
                <h3 id="direct-telemetry-visible" className="elig-compare-title">
                  Counts for scoring
                </h3>
                <p className="elig-compare-copy">
                  A direct service-creation event exposed by the product through Windows Service
                  Control Manager or an equivalent native sensor signal.
                </p>
              </article>
              <article className="elig-compare-card elig-compare-card--no">
                <p className="elig-compare-label">
                  <XCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Insufficient substitute</span>
                </p>
                <h3 id="inferred-activity-visible" className="elig-compare-title">
                  Does not count as direct
                </h3>
                <p className="elig-compare-copy">
                  Assuming service creation from a generic process event or a registry write under
                  the Services key.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="ineligible-solutions" className="elig-section elig-section--muted">
          <div className="elig-section-inner">
            <div className="elig-header center mb-8">
              <p className="elig-kicker">Out of scope</p>
              <h2 className="elig-title">Excluded products</h2>
              <p className="elig-lead">
                Search products and limitations. Exclusion means out of scope for this comparison,
                not that a product is weak.
              </p>
            </div>

            <div className="elig-exclusions">
              <div className="elig-note">
                <Info className="w-5 h-5" aria-hidden="true" />
                <div>
                  <h3 className="elig-note-title">Scope note</h3>
                  <p>
                    Many listed products fit other use cases well. These criteria exist to compare
                    traditional EDR telemetry capabilities, not to rank overall detection or prevention capabilities.
                  </p>
                </div>
              </div>

              <div className="elig-search-bar">
                <label className="sr-only" htmlFor="exclusionSearch">
                  Search exclusion table
                </label>
                <div className="elig-search-field">
                  <Search className="elig-search-icon" aria-hidden="true" />
                  <input
                    id="exclusionSearch"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search products, limitations, or details…"
                    className="elig-search-input"
                  />
                </div>
                <span className="elig-search-count">
                  <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                  {filteredExclusions.length} of {exclusions.length}
                </span>
              </div>

              <div className="elig-table" role="table" aria-label="Excluded products">
                <div className="elig-table-head" role="row">
                  <div role="columnheader">Product</div>
                  <div role="columnheader">Primary limitation</div>
                  <div role="columnheader">Additional details</div>
                </div>
                {filteredExclusions.length === 0 ? (
                  <div className="elig-empty">
                    <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                    No products match “{searchTerm.trim()}”.
                  </div>
                ) : (
                  filteredExclusions.map((item) => (
                    <article key={item.product} className="elig-table-row" role="row">
                      <div className="elig-product" role="cell">
                        {item.product}
                      </div>
                      <div className="elig-reason" role="cell">
                        <span>{item.reason}</span>
                      </div>
                      <div className="elig-details" role="cell">
                        <ul>
                          {item.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="elig-section">
          <div className="elig-section-inner">
            <div className="elig-cta">
              <div>
                <p className="elig-kicker">Next</p>
                <h2 className="elig-title !text-white mb-2">See how scoring applies these rules</h2>
                <p className="!text-slate-300 mb-0 max-w-xl">
                  Methodology covers validity, status values, and evidence expectations used after a
                  product clears eligibility.
                </p>
              </div>
              <Link href="/methodology" className="elig-cta-button">
                Open methodology
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </TemplatePage>
  )
}

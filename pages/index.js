import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Shield,
  Activity,
  Database,
  Server,
  HelpCircle,
  CheckCircle,
  Users,
  Building,
  BarChart3,
  FileText,
  Globe,
  Compass,
  BookOpen,
  ChevronDown,
} from 'lucide-react'
import { LinuxLogo, MacosLogo, WindowsLogo } from '../components/PlatformOsIcons'
import { SITE_URL } from '../lib/site'

const stats = [
  { value: '20+', label: 'Solutions Analyzed', icon: Database },
  { value: '3', label: 'Platforms Covered', icon: Server },
  { value: '100%', label: 'Open Source', icon: Globe },
  { value: '100%', label: 'Vendor Agnostic', icon: Shield },
]

const platforms = [
  {
    href: '/windows',
    title: 'Windows',
    description: 'Event coverage and depth for Windows endpoints.',
    Logo: WindowsLogo,
    className: 'home-platform-card--windows',
    linkClass: 'text-blue-600',
  },
  {
    href: '/linux',
    title: 'Linux',
    description: 'System-level telemetry across common Linux distros.',
    Logo: LinuxLogo,
    className: 'home-platform-card--linux',
    linkClass: 'text-orange-500',
  },
  {
    href: '/macos',
    title: 'macOS',
    description: 'EndpointSecurity and OS-native signal coverage on macOS.',
    Logo: MacosLogo,
    className: 'home-platform-card--macos',
    linkClass: 'text-purple-600',
  },
]

const valueCards = [
  {
    title: 'Compare scores',
    description: (
      <>
        Open{' '}
        <Link href="/scores" className="text-blue-600 hover:underline font-medium">
          Scores
        </Link>{' '}
        for coverage depth, then use{' '}
        <Link href="/statistics" className="text-blue-600 hover:underline font-medium">
          Statistics
        </Link>{' '}
        to track changes over time.
      </>
    ),
    icon: BarChart3,
    cardClass: 'home-value-card--blue',
    iconClass: 'home-value-icon--blue',
  },
  {
    title: 'Browse categories',
    description: (
      <>
        Open{' '}
        <Link href="/telemetry-categories" className="text-blue-600 hover:underline font-medium">
          Telemetry Categories
        </Link>{' '}
        and{' '}
        <Link href="/mitre-mappings" className="text-blue-600 hover:underline font-medium">
          MITRE Mappings
        </Link>{' '}
        for signal-level detail.
      </>
    ),
    icon: Activity,
    cardClass: 'home-value-card--emerald',
    iconClass: 'home-value-icon--emerald',
  },
  {
    title: 'Read eligibility',
    description: (
      <>
        Check inclusion rules in{' '}
        <Link href="/eligibility" className="text-blue-600 hover:underline font-medium">
          Eligibility
        </Link>{' '}
        before you treat a product as comparable.
      </>
    ),
    icon: CheckCircle,
    cardClass: 'home-value-card--purple',
    iconClass: 'home-value-icon--purple',
  },
  {
    title: 'Follow updates',
    description: (
      <>
        See project context on{' '}
        <Link href="/about" className="text-blue-600 hover:underline font-medium">
          About
        </Link>{' '}
        and new write-ups on the{' '}
        <Link href="/blog" className="text-blue-600 hover:underline font-medium">
          Blog
        </Link>
        .
      </>
    ),
    icon: FileText,
    cardClass: 'home-value-card--indigo',
    iconClass: 'home-value-icon--indigo',
  },
]

const audiences = [
  {
    title: 'Mid-sized Businesses',
    description: 'Check whether your EDR exposes the telemetry you need before you scale the rollout.',
    icon: Building,
    className: 'home-audience-card--blue',
    iconClass: 'text-blue-400',
  },
  {
    title: 'Large Enterprises',
    description: 'Compare telemetry evidence across platforms and guide validation in your own environment.',
    icon: Globe,
    className: 'home-audience-card--emerald',
    iconClass: 'text-emerald-400',
  },
  {
    title: 'Security Leaders',
    description: 'Show stakeholders what coverage you have and which limits the tests document.',
    icon: Users,
    className: 'home-audience-card--purple',
    iconClass: 'text-purple-400',
  },
  {
    title: 'Detection Engineers',
    description: 'Map exposed signals to MITRE ATT&CK and investigate visibility gaps.',
    icon: Shield,
    className: 'home-audience-card--orange',
    iconClass: 'text-orange-400',
  },
]

const faqs = [
  {
    question: 'Is the research vendor-neutral?',
    answer:
      'The project is vendor-agnostic and applies published evidence and methodology rules. Each result should be read with its documented validation path, configuration, and limitations.',
  },
  {
    question: 'Can we use this to guide procurement?',
    answer:
      'Use the platform scores, category depth, and eligibility criteria as one source of technical evidence. Telemetry visibility does not measure prevention, detection efficacy, operational fit, support quality, or overall product quality, so it should not determine a procurement decision by itself.',
  },
  {
    question: 'Do you offer help applying the benchmarks?',
    answer: (
      <>
        Yes. See{' '}
        <Link href="/premium-services" className="text-blue-600 hover:underline font-medium">
          Apply the Research
        </Link>{' '}
        for EDR validation, selection, and advisory support through Defendpoint Consulting.
      </>
    ),
  },
]

const mockRows = [
  { label: 'Process Creation', cells: ['full', 'high', 'mid'] },
  { label: 'Network Connection', cells: ['high', 'full', 'mid'] },
  { label: 'File Modification', cells: ['mid', 'high', 'low'] },
  { label: 'Registry / Config', cells: ['full', 'none', 'low'] },
  { label: 'Script Execution', cells: ['high', 'mid', 'high'] },
]

const missionPoints = [
  'Cross-platform telemetry coverage and depth analysis',
  'Controlled activity and evidence-backed validation',
  'Published methodology and community-informed research',
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!nodes.length) return undefined

    const reveal = (node) => node.classList.add('is-revealed')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      nodes.forEach(reveal)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <TemplatePage
      title="EDR Telemetry Project | Independent EDR Telemetry Research"
      description="Compare which endpoint events EDR products expose on Windows, Linux, and macOS under published test conditions."
      canonicalPath="/"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EDR Telemetry Project',
              url: SITE_URL,
              logo: `${SITE_URL}/images/edr_telemetry_logo.png`,
              description:
                'Public research comparing EDR endpoint telemetry visibility under controlled tests.',
              parentOrganization: {
                '@type': 'Organization',
                name: 'Defendpoint Consulting',
                description: 'Independent EDR advisory and engineering firm.',
                url: 'https://defendpoint.ca',
              },
              sameAs: [
                'https://github.com/tsale/EDR-Telemetry',
                'https://twitter.com/kostastsale',
                'https://linkedin.com/in/kostastsale',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'EDR Telemetry Project',
              url: SITE_URL,
              description:
                'Public comparison of EDR endpoint telemetry visibility across Windows, Linux, and macOS.',
            }),
          }}
        />
      </Head>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-orb home-hero-orb--blue" aria-hidden="true" />
        <div className="home-hero-orb home-hero-orb--indigo" aria-hidden="true" />

        <div className="home-hero-inner">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="home-enter home-enter-delay-1">
              <span className="home-badge">
                <span className="home-badge-dot" aria-hidden="true" />
                Independent · Evidence-backed · Open
              </span>
            </div>

            <h1 className="home-enter home-enter-delay-2 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
              Transparent Research on
              <br />{' '}
              <span className="text-blue-400">EDR Telemetry Visibility</span>
            </h1>

            <p className="home-enter home-enter-delay-3 mt-6 text-base sm:text-xl !text-slate-300 text-center leading-relaxed text-balance px-2 sm:px-4">
              Explore controlled, evidence-backed testing of the endpoint telemetry exposed by EDR
              platforms across Windows, Linux, and macOS.
            </p>

            <div className="home-enter home-enter-delay-4 mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/scores"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Scores
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center px-8 py-4 border border-slate-700 text-base font-bold rounded-xl !text-slate-200 hover:bg-slate-800 transition-all hover:border-slate-600 hover:-translate-y-0.5"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Methodology
              </Link>
            </div>
          </div>

          <div className="home-enter home-enter-delay-5 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {platforms.map((platform) => (
              <Link
                key={platform.href}
                href={platform.href}
                className={`home-platform-card group ${platform.className}`}
              >
                <div className="home-platform-icon" aria-hidden="true">
                  <platform.Logo />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{platform.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{platform.description}</p>
                <div className={`flex items-center text-sm font-bold ${platform.linkClass}`}>
                  View Telemetry{' '}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="home-enter home-enter-delay-5 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800/50 pt-12 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="home-stat">
                <div className="home-stat-icon">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-slate-300 text-center">Powered by Defendpoint Consulting</p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="home-section home-section--muted">
        <div className="home-section-inner">
          <div className="text-center max-w-3xl mx-auto mb-16" data-reveal data-reveal-delay="1">
            <div className="home-section-kicker">
              <Compass className="w-4 h-4" />
              How to use this research
            </div>
            <h2 className="home-section-title">Compare telemetry before you buy or reconfigure</h2>
            <p className="home-section-lead mx-auto">
              Use the public results to compare visibility, spot gaps, and plan validation in your
              environment. Telemetry scores measure visibility only. They do not rank overall
              product quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {valueCards.map((card, index) => (
              <div
                key={card.title}
                className={`home-value-card ${card.cardClass}`}
                data-reveal
                data-reveal-delay={String(Math.min(index + 2, 5))}
              >
                <div className={`home-value-icon ${card.iconClass}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Mission */}
      <section className="home-section home-section--white">
        <div className="home-section-inner">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0" data-reveal data-reveal-delay="1">
              <div className="home-section-kicker">Project Mission</div>
              <h2 className="home-section-title">
                Documenting EDR telemetry visibility
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                The EDR Telemetry Project documents and compares the endpoint telemetry EDR
                platforms expose under controlled, versioned tests. Practitioners can see visibility
                differences while reading the limits of what a telemetry score can show.
              </p>

              <div className="space-y-3 mb-8">
                {missionPoints.map((point) => (
                  <div key={point} className="home-check-item">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600">{point}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/methodology"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
              >
                Learn More About Our Methodology{' '}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="home-mock" data-reveal data-reveal-delay="3">
              <div className="home-mock-glow" aria-hidden="true" />
              <div className="home-mock-panel">
                <div className="home-mock-chrome">
                  <div className="home-mock-dot bg-red-400" />
                  <div className="home-mock-dot bg-amber-400" />
                  <div className="home-mock-dot bg-emerald-400" />
                  <span className="ml-3 text-xs font-medium text-slate-500 tracking-wide">
                    Telemetry coverage preview
                  </span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] gap-2 mb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                    <span>Category</span>
                    <span className="text-center">A</span>
                    <span className="text-center">B</span>
                    <span className="text-center">C</span>
                  </div>
                  {mockRows.map((row) => (
                    <div key={row.label} className="home-mock-row">
                      <span className="home-mock-label">{row.label}</span>
                      {row.cells.map((level, i) => (
                        <div
                          key={`${row.label}-${i}`}
                          className={`home-mock-cell home-mock-cell--${level}`}
                          aria-hidden="true"
                        >
                          <span />
                        </div>
                      ))}
                    </div>
                  ))}
                  <p className="mt-5 text-xs text-slate-400 text-center">
                    Illustrative only. See Scores for live results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="home-section home-section--dark">
        <div className="home-section-inner">
          <div className="text-center mb-16" data-reveal data-reveal-delay="1">
            <div className="home-section-kicker home-section-kicker--dark">
              <Users className="w-4 h-4" />
              Who it&apos;s for
            </div>
            <h2 className="home-section-title">Built for Security and Business Teams</h2>
            <p className="home-section-lead mx-auto">
              Built for people who need telemetry coverage details, not a full product ranking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience, index) => (
              <div
                key={audience.title}
                className={`home-audience-card ${audience.className}`}
                data-reveal
                data-reveal-delay={String(Math.min(index + 2, 5))}
              >
                <audience.icon className={`w-10 h-10 mb-4 ${audience.iconClass}`} />
                <h3 className="text-lg font-bold mb-2 !text-white">{audience.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-section home-section--white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-reveal data-reveal-delay="1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="home-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={faq.question}
                  data-reveal
                  data-reveal-delay={String(Math.min(index + 2, 5))}
                >
                  <div className={`home-faq-item${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="home-faq-trigger"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      <span>{faq.question}</span>
                      <span className="home-faq-chevron" aria-hidden="true">
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    <div className="home-faq-panel">
                      <div className="home-faq-panel-inner">
                        <div className="home-faq-answer">{faq.answer}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-inner" data-reveal data-reveal-delay="1">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3 tracking-tight">
              Compare platform scores
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Start with Scores, then open categories and methodology so you know what each result
              actually means.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/scores"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              View Scores
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/premium-services"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/30 !text-white font-bold hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Apply the Research
            </Link>
          </div>
        </div>
      </section>
    </TemplatePage>
  )
}

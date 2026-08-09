import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import {
  ArrowRight,
  BookOpen,
  Bug,
  CheckCircle,
  ChevronDown,
  ClipboardCheck,
  Copy,
  Check,
  FileJson,
  FileSearch,
  GitBranch,
  GitFork,
  GitPullRequest,
  HelpCircle,
  Info,
  Lightbulb,
  Camera,
  Shield,
  Users,
  ExternalLink,
} from 'lucide-react'

const navSections = [
  { id: 'contribution-paths', label: 'Paths' },
  { id: 'evidence-requirements', label: 'Evidence' },
  { id: 'contribution-steps', label: 'Steps' },
  { id: 'additional-guidelines', label: 'Guidelines' },
  { id: 'contribute-faq', label: 'FAQ' },
]

const contributionPaths = [
  {
    id: 'telemetry',
    title: 'Telemetry updates',
    short: 'Improve EDR_telem.json coverage',
    icon: FileJson,
    accent: 'blue',
    body: 'We welcome all kinds of contributions to the EDR_telem.json file. Use our tools to make contributing easier.',
    points: [
      'Convert between JSON and CSV formats',
      'Edit in your preferred format',
      'Automatic validation checks',
    ],
  },
  {
    id: 'validation',
    title: 'Evidence validation',
    short: 'Back status changes with proof',
    icon: ClipboardCheck,
    accent: 'emerald',
    body: 'All contributions require validation through either telemetry screenshots or official documentation.',
    points: [
      'Telemetry screenshots from the product',
      'Official vendor documentation',
      'Private documentation shared confidentially with Kostas',
    ],
  },
  {
    id: 'community',
    title: 'Issues & ideas',
    short: 'Report bugs or propose features',
    icon: Lightbulb,
    accent: 'amber',
    body: 'Also useful: clear issues and well-scoped feature requests that keep the work focused.',
    points: [
      'Check existing issues before opening new ones',
      'Use the latest version and clear descriptions',
      'Include reproduction steps or use-case examples',
    ],
  },
]

const acceptedEvidence = [
  'Official vendor documentation',
  'Screenshots of telemetry exposed by the product',
  'Log extracts or raw event records',
  'Direct hands-on testing results',
  'Private documentation shared confidentially for validation',
]

const directTestChecklist = [
  'Test/action executed and UTC execution timestamp',
  'Endpoint, OS build, sensor version, and policy/configuration',
  'Expected telemetry target and status being requested',
  'Query/search used, time window, raw event source, table, or index',
  'Observed fields, missing expected fields, screenshot or raw export',
  'Rationale for Yes, Partially, Via EventLogs, Via EnablingTelemetry, No, or Pending Response',
]

const statusValues = [
  { icon: '✅', label: 'Yes', description: 'Implemented', tone: 'emerald' },
  { icon: '❌', label: 'No', description: 'Not Implemented', tone: 'red' },
  { icon: '⚠️', label: 'Partially', description: 'Partially Implemented', tone: 'amber' },
  { icon: '❓', label: 'Pending', description: 'Pending Response', tone: 'slate' },
  { icon: '🪵', label: 'Via EventLogs', description: 'Collected from Windows Event Logs', tone: 'blue' },
  {
    icon: '🎚️',
    label: 'Via EnablingTelemetry',
    description: 'Additional telemetry capability',
    tone: 'sky',
  },
]

const contributionSteps = [
  {
    number: '01',
    title: 'Fork Repository',
    icon: GitFork,
    description: 'Create your own copy of the project.',
    detail: (
      <ol className="contrib-ordered">
        <li>Visit the main repository</li>
        <li>Click the &quot;Fork&quot; button</li>
        <li>Select your account</li>
      </ol>
    ),
  },
  {
    number: '02',
    title: 'Create Branch',
    icon: GitBranch,
    description: 'Make a new branch for your changes.',
    detail: null,
    command: 'git checkout -b feature-branch-name',
  },
  {
    number: '03',
    title: 'Make Changes',
    icon: FileJson,
    description: 'Update telemetry values using the project status vocabulary.',
    detail: null,
    showStatuses: true,
  },
  {
    number: '04',
    title: 'Submit PR',
    icon: GitPullRequest,
    description: 'Open a pull request with documentation and evidence.',
    detail: (
      <ul className="contrib-checklist">
        <li>Push your changes</li>
        <li>Open pull request</li>
        <li>Add documentation</li>
        <li>Wait for review</li>
      </ul>
    ),
  },
]

const faqs = [
  {
    question: 'What counts as valid contribution evidence?',
    answer:
      'Official vendor documentation, screenshots of telemetry exposed by the product, log extracts or raw event records, direct hands-on testing results, and private documentation shared confidentially for validation.',
  },
  {
    question: 'What if my documentation is private?',
    answer: (
      <>
        Private documentation can be shared confidentially with{' '}
        <a href="https://github.com/tsale" target="_blank" rel="noopener noreferrer">
          Kostas
        </a>
        . Status changes still need evidence that can be rechecked.
      </>
    ),
  },
  {
    question: 'What should I include for a direct-test status change?',
    answer:
      'Include the test/action and UTC timestamp, endpoint and sensor details, expected telemetry target, query/search and time window, observed or missing fields with a screenshot or raw export, and a clear rationale for the requested status.',
  },
  {
    question: 'How do I document a No or absence finding?',
    answer:
      'Document the search window, sources searched, queries or search terms, covered time range, endpoint identifiers examined, and any relevant vendor table or index guidance. Vague claims are not enough to upgrade or downgrade a status.',
  },
]

function SectionHead({ number, title, lead, titleId }) {
  return (
    <div className="contrib-section-head" data-reveal data-reveal-delay="1">
      <div className="contrib-section-num" aria-hidden="true">
        {number}
      </div>
      <div>
        <h2 id={titleId} className="contrib-section-title">
          {title}
        </h2>
        <p className="contrib-section-lead">{lead}</p>
      </div>
    </div>
  )
}

function CopyCommand({ command }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="contrib-code">
      <code>{command}</code>
      <button
        type="button"
        className="contrib-code-copy"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy command'}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}

export default function Contribute() {
  useHeadingLinks()
  const [activeSection, setActiveSection] = useState('contribution-paths')
  const [activePath, setActivePath] = useState('telemetry')
  const [openFaq, setOpenFaq] = useState(0)
  const [activeStatus, setActiveStatus] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
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

  const selectedPath = contributionPaths.find((path) => path.id === activePath) || contributionPaths[0]
  const PathIcon = selectedPath.icon

  return (
    <TemplatePage
      title="Contribute - EDR Telemetry Project"
      description="How to contribute telemetry evidence, pull requests, and documentation updates to the EDR Telemetry Project."
      canonicalPath="/contribute"
    >
      <section className="contrib-hero">
        <div className="contrib-hero-orb contrib-hero-orb--blue" aria-hidden="true" />
        <div className="contrib-hero-orb contrib-hero-orb--indigo" aria-hidden="true" />

        <div className="contrib-hero-inner">
          <div className="contrib-enter contrib-enter-delay-1">
            <span className="contrib-badge">
              <span className="contrib-badge-dot" aria-hidden="true" />
              <Users className="w-4 h-4" />
              Community-powered evidence
            </span>
          </div>

          <h1 className="contrib-enter contrib-enter-delay-2 contrib-hero-title text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white !text-center leading-tight w-full">
            How to{' '}
            <span className="contrib-hero-accent">Contribute</span>
          </h1>

          <p className="contrib-enter contrib-enter-delay-3 mt-2 text-xl !text-slate-300 !text-center max-w-2xl mx-auto leading-relaxed">
            Submit telemetry updates, evidence, and docs that keep the comparison accurate.
            Follow the paths below, then open a GitHub PR.
          </p>

          <div className="contrib-enter contrib-enter-delay-4 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://github.com/tsale/EDR-Telemetry"
              target="_blank"
              rel="noopener noreferrer"
              className="contrib-btn contrib-btn--primary inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold shadow-lg"
            >
              Get Started on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <Link
              href="#contribution-paths"
              className="contrib-btn contrib-btn--ghost inline-flex items-center justify-center px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl !text-slate-200 font-bold"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore contribution paths
            </Link>
          </div>
        </div>
      </section>

      <nav className="contrib-nav" aria-label="Contribute sections">
        <div className="contrib-nav-inner">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`contrib-nav-pill${activeSection === section.id ? ' is-active' : ''}`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="contrib-body">
        <div className="contrib-body-inner">
          {/* Paths */}
          <section>
            <SectionHead
              number="01"
              title="Contribution Paths"
              lead="Choose a path: telemetry data, validated evidence, or community issues"
              titleId="contribution-paths"
            />
            <span id="about-contributions" className="sr-only">
              About Contributions
            </span>
            <span id="validation-process" className="sr-only">
              Validation Process
            </span>

            <div
              className="contrib-path-tabs"
              role="tablist"
              aria-label="Contribution path options"
              data-reveal
              data-reveal-delay="2"
              onKeyDown={(event) => {
                const order = contributionPaths.map((path) => path.id)
                const current = order.indexOf(activePath)
                if (current < 0) return
                let next = current
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  next = (current + 1) % order.length
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  next = (current - 1 + order.length) % order.length
                } else if (event.key === 'Home') {
                  next = 0
                } else if (event.key === 'End') {
                  next = order.length - 1
                } else {
                  return
                }
                event.preventDefault()
                setActivePath(order[next])
                const tab = document.getElementById(`path-tab-${order[next]}`)
                if (tab) tab.focus()
              }}
            >
              {contributionPaths.map((path) => {
                const Icon = path.icon
                const selected = activePath === path.id
                return (
                  <button
                    key={path.id}
                    type="button"
                    role="tab"
                    id={`path-tab-${path.id}`}
                    aria-selected={selected}
                    aria-controls={`path-panel-${path.id}`}
                    tabIndex={selected ? 0 : -1}
                    className={`contrib-path-tab contrib-path-tab--${path.accent}${selected ? ' is-active' : ''}`}
                    onClick={() => setActivePath(path.id)}
                  >
                    <span className="contrib-path-tab-icon" aria-hidden="true">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="contrib-path-tab-copy">
                      <span className="contrib-path-tab-title">{path.title}</span>
                      <span className="contrib-path-tab-short">{path.short}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              data-reveal
              data-reveal-delay="3"
            >
              <div
                id={`path-panel-${selectedPath.id}`}
                role="tabpanel"
                aria-labelledby={`path-tab-${selectedPath.id}`}
                className={`contrib-path-panel contrib-path-panel--${selectedPath.accent}`}
              >
                <div className="contrib-path-panel-head">
                  <div className={`contrib-path-panel-icon contrib-path-panel-icon--${selectedPath.accent}`}>
                    <PathIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedPath.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-0">{selectedPath.body}</p>
                  </div>
                </div>
                <ul className="contrib-feature-list">
                  {selectedPath.points.map((point) => (
                    <li key={point}>
                      <span className="contrib-feature-check" aria-hidden="true">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                {selectedPath.id === 'validation' && (
                  <div className="contrib-note">
                    <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <p className="mb-0">
                      Private documentation can be shared confidentially with{' '}
                      <a href="https://github.com/tsale" target="_blank" rel="noopener noreferrer">
                        Kostas
                      </a>
                      .
                    </p>
                  </div>
                )}
                {selectedPath.id === 'validation' && (
                  <div className="contrib-validation-row" aria-hidden="false">
                    <div className="contrib-validation-chip">
                      <Camera className="w-4 h-4" />
                      Telemetry Screenshots
                    </div>
                    <div className="contrib-validation-chip">
                      <FileSearch className="w-4 h-4" />
                      Official Documentation
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Evidence */}
          <section>
            <SectionHead
              number="02"
              title="Evidence Requirements"
              lead="Status changes need recheckable evidence. Screenshots help. Disputed direct-test conclusions need the full evidence package."
              titleId="evidence-requirements"
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="contrib-card" data-reveal data-reveal-from="left" data-reveal-delay="2">
                <div className="contrib-card-accent contrib-card-accent--emerald" />
                <div className="contrib-card-body">
                  <h3 id="accepted-evidence" className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Accepted evidence
                  </h3>
                  <div className="grid gap-2.5">
                    {acceptedEvidence.map((item) => (
                      <div key={item} className="contrib-list-item contrib-list-item--yes">
                        <div className="contrib-list-icon contrib-list-icon--yes">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contrib-card" data-reveal data-reveal-from="right" data-reveal-delay="3">
                <div className="contrib-card-accent contrib-card-accent--blue" />
                <div className="contrib-card-body">
                  <h3 id="direct-test-checklist" className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    Direct-test checklist
                  </h3>
                  <div className="grid gap-2.5">
                    {directTestChecklist.map((item, index) => (
                      <div key={item} className="contrib-list-item contrib-list-item--blue">
                        <div className="contrib-list-icon contrib-list-icon--blue" aria-hidden="true">
                          {index + 1}
                        </div>
                        <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="contrib-callout contrib-callout--amber mt-6" data-reveal data-reveal-delay="4">
              <div className="contrib-callout-icon" aria-hidden="true">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 id="absence-findings-contribution" className="text-lg font-bold text-amber-950 mb-2">
                  For No or absence findings
                </h3>
                <p className="text-amber-900/90 text-sm leading-relaxed mb-0">
                  Document the search window, sources searched, queries or search terms, covered time
                  range, endpoint identifiers examined, and any relevant vendor table or index
                  guidance. Vague claims are not enough to upgrade or downgrade a status.
                </p>
              </div>
            </div>

            <div className="mt-6" data-reveal data-reveal-delay="5">
              <Link href="/methodology#evidence-package" className="contrib-inline-link">
                View the full evidence package standard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Steps */}
          <section>
            <SectionHead
              number="03"
              title="Contribution Steps"
              lead="Fork, branch, update statuses with evidence, then open a pull request"
              titleId="contribution-steps"
            />

            <div className="contrib-timeline" data-reveal data-reveal-delay="2">
              {contributionSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.title}
                    className="contrib-timeline-step contrib-stagger-item"
                    style={{ '--contrib-stagger': index }}
                  >
                    <div className="contrib-timeline-rail" aria-hidden="true">
                      <div className="contrib-timeline-num">{step.number}</div>
                      {index < contributionSteps.length - 1 && <div className="contrib-timeline-line" />}
                    </div>
                    <div className="contrib-timeline-card">
                      <div className="contrib-timeline-card-head">
                        <div className="contrib-timeline-icon" aria-hidden="true">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                          <p className="text-slate-600 text-sm mb-0">{step.description}</p>
                        </div>
                      </div>
                      {step.detail}
                      {step.command && <CopyCommand command={step.command} />}
                      {step.showStatuses && (
                        <div className="contrib-status-grid" role="list" aria-label="Allowed status values">
                          {statusValues.map((status, statusIndex) => {
                            const isActive = activeStatus === statusIndex
                            return (
                              <button
                                key={status.label}
                                type="button"
                                role="listitem"
                                className={`contrib-status-chip contrib-status-chip--${status.tone}${isActive ? ' is-active' : ''}`}
                                aria-pressed={isActive}
                                onClick={() => setActiveStatus(statusIndex)}
                              >
                                <span className="contrib-status-emoji" aria-hidden="true">
                                  {status.icon}
                                </span>
                                <span className="contrib-status-label">{status.label}</span>
                                <span className="contrib-status-desc">{status.description}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Guidelines */}
          <section>
            <SectionHead
              number="04"
              title="Additional Guidelines"
              lead="Keep issues and feature requests clear, current, and easy to act on"
              titleId="additional-guidelines"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="contrib-card" data-reveal data-reveal-delay="2">
                <div className="contrib-card-accent contrib-card-accent--red" />
                <div className="contrib-card-body">
                  <div className="contrib-guidelines-icon contrib-guidelines-icon--red" aria-hidden="true">
                    <Bug className="w-5 h-5" />
                  </div>
                  <h3 id="reporting-issues" className="text-xl font-bold text-slate-900 mb-3">
                    Reporting Issues
                  </h3>
                  <ul className="contrib-guidelines-list">
                    <li>Check existing issues</li>
                    <li>Use latest version</li>
                    <li>Clear descriptions</li>
                    <li>Reproduction steps</li>
                  </ul>
                </div>
              </div>

              <div className="contrib-card" data-reveal data-reveal-delay="3">
                <div className="contrib-card-accent contrib-card-accent--amber" />
                <div className="contrib-card-body">
                  <div className="contrib-guidelines-icon contrib-guidelines-icon--amber" aria-hidden="true">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 id="feature-requests" className="text-xl font-bold text-slate-900 mb-3">
                    Feature Requests
                  </h3>
                  <ul className="contrib-guidelines-list">
                    <li>Check existing proposals</li>
                    <li>Clear title</li>
                    <li>Detailed description</li>
                    <li>Use case examples</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <SectionHead
              number="05"
              title="Contribution FAQ"
              lead="Quick answers drawn from the contribution and evidence guidance above"
              titleId="contribute-faq"
            />

            <div className="contrib-faq" data-reveal data-reveal-delay="2">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={faq.question} className="contrib-faq-wrap">
                    <div className={`contrib-faq-item${isOpen ? ' is-open' : ''}`}>
                      <button
                        type="button"
                        className="contrib-faq-trigger"
                        aria-expanded={isOpen}
                        aria-controls={`contrib-faq-panel-${index}`}
                        id={`contrib-faq-trigger-${index}`}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span className="contrib-faq-q">
                          <HelpCircle className="w-4 h-4 shrink-0 text-blue-500" aria-hidden="true" />
                          {faq.question}
                        </span>
                        <span className="contrib-faq-chevron" aria-hidden="true">
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>
                      <div
                        id={`contrib-faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`contrib-faq-trigger-${index}`}
                        className="contrib-faq-panel"
                      >
                        <div className="contrib-faq-panel-inner">
                          <div className="contrib-faq-answer">{faq.answer}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="contrib-cta" data-reveal data-reveal-delay="1">
            <div className="contrib-cta-orb contrib-cta-orb--left" aria-hidden="true" />
            <div className="contrib-cta-orb contrib-cta-orb--right" aria-hidden="true" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl font-bold !text-white !text-center mb-4 w-full">
                Contribute on GitHub
              </h2>
              <p className="!text-slate-300 !text-center leading-relaxed mb-8 max-w-2xl">
                Small, well-evidenced PRs still matter. Open an issue first if the change needs
                discussion.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://github.com/tsale/EDR-Telemetry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contrib-btn contrib-btn--primary inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold shadow-lg"
                >
                  Get Started on GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <Link
                  href="/contact"
                  className="contrib-btn contrib-btn--ghost inline-flex items-center justify-center px-6 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl !text-white font-bold"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TemplatePage>
  )
}

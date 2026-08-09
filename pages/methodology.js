import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import {
  CheckCircle,
  Clock,
  FileSearch,
  Scale,
  Shield,
  XCircle,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  Target,
  Activity,
  Eye,
  Zap,
  ClipboardCheck,
} from 'lucide-react'
import { LinuxLogo, MacosLogo, WindowsLogo } from '../components/PlatformOsIcons'

const validityCriteria = [
  {
    icon: Target,
    label: 'Distinct action',
    text: 'Represents a distinct system action, not a generic clue.',
  },
  {
    icon: Activity,
    label: 'Direct collection',
    text: 'Is directly collected rather than inferred from unrelated activity.',
  },
  {
    icon: Eye,
    label: 'Consumer access',
    text: 'Is exposed to the product consumer for search, detection building, hunting, or investigation.',
  },
  {
    icon: Zap,
    label: 'Timely capture',
    text: 'Is automatically collected as the activity occurs or within the agreed near-real-time window.',
  },
  {
    icon: FileSearch,
    label: 'Investigation-ready',
    text: 'Is explicit enough for investigation and pivoting.',
  },
  {
    icon: ClipboardCheck,
    label: 'Evidence-backed',
    text: 'Is backed by the executed test, raw evidence, and expected-vs-observed mapping.',
  },
  {
    icon: Scale,
    label: 'In scope',
    text: 'Fits project scope and is not live query, historical backfill, manual collection, or unrelated module output.',
  },
]

const evidenceItems = [
  'UTC execution timestamp and endpoint identifier or hostname',
  'OS build, architecture, sensor version, sensor build, and policy/configuration in effect',
  'Test/action executed and expected telemetry target',
  'Query/search used, raw event source, table, index, and time range',
  'Observed event timestamp, event type/action, actor identity, target object, and process lineage where relevant',
  'Observed fields, missing expected fields, screenshot, raw export, and status rationale',
]

const statusDefinitions = [
  {
    status: 'Yes',
    value: '1.0',
    meaning: 'Required telemetry is implemented and exposed directly.',
    color: 'emerald',
  },
  {
    status: 'Via EnablingTelemetry',
    value: '1.0',
    meaning:
      'Telemetry exists only after enabling a built-in setting or feature. Same numeric value as Yes, but not equivalent to out-of-the-box Yes.',
    color: 'sky',
  },
  {
    status: 'Partially',
    value: '0.5',
    meaning:
      'Related telemetry exists, but full-credit validity fails because it is incomplete, conditional, subset-only, inconsistent, missing required fields, or related-but-not-direct.',
    color: 'amber',
  },
  {
    status: 'Via EventLogs',
    value: '0.5',
    meaning:
      'Telemetry is surfaced through platform-native OS logs rather than independent native sensor collection.',
    color: 'blue',
  },
  {
    status: 'No',
    value: '0.0',
    meaning: 'Telemetry is not implemented or is not exposed in a qualifying way.',
    color: 'red',
  },
  {
    status: 'Pending Response',
    value: '0.0',
    meaning:
      'Status remains unresolved at scoring time and cannot be upgraded without qualifying evidence.',
    color: 'purple',
  },
]

const directVsInferred = [
  {
    direct: 'User creation or modification event',
    substitute: 'Linux file-attribute changes instead of a user-modification event',
  },
  {
    direct: 'Scheduled task creation event',
    substitute: 'Generic cron or process activity instead of a scheduled-task event',
  },
  {
    direct: 'Handle opening or remote thread event',
    substitute: 'Generic process-created event',
  },
  {
    direct: 'Service creation event',
    substitute: 'Registry change under ',
    code: 'HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services',
  },
]

const workflow = [
  {
    title: 'Scope Confirmation',
    desc: 'Confirm OS, edition, tenant, product version, sensor version, and sign-off contact in writing.',
  },
  {
    title: 'Test System Setup',
    desc: 'Evaluator supplies test systems and installs the EDR agent. Vendor assigns intended policies and tenant-side configuration.',
  },
  {
    title: 'Validation & Sign-off',
    desc: 'Vendor validates the setup and gives written readiness/sign-off before testing begins.',
  },
  {
    title: 'Configuration Freeze',
    desc: 'Configuration is frozen after sign-off. Material changes require written agreement and may reset the evaluation.',
  },
  {
    title: 'Controlled Execution',
    desc: 'Evaluator executes the agreed activity set and collects raw product telemetry.',
  },
  {
    title: 'Event Validation',
    desc: 'Each sub-category is validated against the event-validity criteria and assigned a status.',
  },
  {
    title: 'Reporting',
    desc: 'Reporting includes category status, scoring, justification, caveats, and review material.',
  },
]

const platformLogs = [
  {
    platform: 'Windows',
    logs: 'Windows Event Logs consumed by the EDR rather than independently collected native instrumentation such as ETW.',
    Logo: WindowsLogo,
    color: 'blue',
  },
  {
    platform: 'Linux',
    logs: 'auditd, journald, syslog, or equivalent OS-level logs consumed rather than independent Linux telemetry such as eBPF probes or kernel module instrumentation.',
    Logo: LinuxLogo,
    color: 'orange',
  },
  {
    platform: 'macOS',
    logs: 'Unified Logging, OpenBSM, or equivalent OS-native logs consumed rather than native macOS telemetry such as EndpointSecurity.',
    Logo: MacosLogo,
    color: 'purple',
  },
]

const absenceItems = [
  'Search window used',
  'Sources searched',
  'Queries or search terms run',
  'Time range covered',
  'Endpoint identifiers examined',
  'Relevant vendor table or index guidance consulted',
]

const evaluateItems = [
  'Automatically collected by the endpoint sensor',
  'Generated as activity occurs',
  'Transmitted in real time or near-real time',
  'Exposed to the product consumer for analysis or hunting',
]

const notEvaluateItems = [
  'Prevention efficacy',
  'Detection efficacy',
  'Quality of built-in detections or analytics',
  'Staffing, MDR, SOC workflow maturity, or full IR capability',
  'Backend conclusions not exposed as direct event records',
]

const navSections = [
  { id: 'what-we-evaluate', label: 'Scope' },
  { id: 'direct-vs-inferred', label: 'Directness' },
  { id: 'valid-telemetry-criteria', label: 'Validity' },
  { id: 'status-taxonomy', label: 'Status' },
  { id: 'evidence-package', label: 'Evidence' },
  { id: 'optional-telemetry', label: 'Governance' },
  { id: 'vendor-assisted-workflow', label: 'Workflow' },
]

const statusBadgeColors = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
}

function SectionHead({ number, title, lead, titleId }) {
  return (
    <div className="meth-section-head" data-reveal data-reveal-delay="1">
      <div className="meth-section-num" aria-hidden="true">
        {number}
      </div>
      <div>
        <h2 id={titleId} className="meth-section-title">
          {title}
        </h2>
        <p className="meth-section-lead">{lead}</p>
      </div>
    </div>
  )
}

export default function Methodology() {
  useHeadingLinks()
  const [activeSection, setActiveSection] = useState('what-we-evaluate')

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

  return (
    <TemplatePage
      title="Methodology & Evidence Standards - EDR Telemetry Project"
      description="How the EDR Telemetry Project evaluates exposed endpoint telemetry, assigns scoring statuses, handles evidence, and runs direct evaluations."
      canonicalPath="/methodology"
    >
      {/* Hero */}
      <section className="meth-hero">
        <div className="meth-hero-orb meth-hero-orb--blue" aria-hidden="true" />
        <div className="meth-hero-orb meth-hero-orb--indigo" aria-hidden="true" />

        <div className="meth-hero-inner">
          <div className="meth-enter meth-enter-delay-1">
            <span className="meth-badge">
              <span className="meth-badge-dot" aria-hidden="true" />
              <Shield className="w-4 h-4" />
              Methodology Version 1.1
              <span className="mx-1 text-blue-500/50">|</span>
              <span className="text-blue-300/90">2026-04-27</span>
            </span>
          </div>

          <h1 className="meth-enter meth-enter-delay-2 meth-hero-title text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white !text-center leading-tight w-full">
            Methodology &amp;{' '}
            <span className="meth-hero-accent">Evidence Standards</span>
          </h1>

          <p className="meth-enter meth-enter-delay-3 mt-2 text-xl !text-slate-300 !text-center max-w-2xl mx-auto leading-relaxed">
            The EDR Telemetry Project measures exposed endpoint telemetry visibility. It does not
            measure prevention, detection efficacy, alert quality, managed service quality, or
            overall product quality.
          </p>

          <div className="meth-enter meth-enter-delay-4 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#what-we-evaluate"
              className="meth-btn meth-btn--primary inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold shadow-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read the Methodology
            </Link>
            <Link
              href="/scores"
              className="meth-btn meth-btn--ghost inline-flex items-center justify-center px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl !text-slate-200 font-bold"
            >
              View Scores
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <nav className="meth-nav" aria-label="Methodology sections">
        <div className="meth-nav-inner">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`meth-nav-pill${activeSection === section.id ? ' is-active' : ''}`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="meth-body">
        <div className="meth-body-inner">
          {/* 01 Scope */}
          <section>
            <SectionHead
              number="01"
              title="Scope & Boundaries"
              lead="What the project evaluates and what it deliberately does not"
            />
            <div className="grid lg:grid-cols-2 gap-6">
              <div
                className="meth-card"
                data-reveal
                data-reveal-from="left"
                data-reveal-delay="2"
              >
                <div className="meth-card-accent meth-card-accent--emerald" />
                <div className="meth-card-body">
                  <h3
                    id="what-we-evaluate"
                    className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    In scope
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    Telemetry visibility exposed to users: raw or near-raw event data that customers
                    and analysts can use to investigate, build detections, and hunt.
                  </p>
                  <div className="grid gap-2.5">
                    {evaluateItems.map((item) => (
                      <div key={item} className="meth-list-item meth-list-item--yes">
                        <div className="meth-list-icon meth-list-icon--yes">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="meth-card"
                data-reveal
                data-reveal-from="right"
                data-reveal-delay="3"
              >
                <div className="meth-card-accent meth-card-accent--red" />
                <div className="meth-card-body">
                  <h3
                    id="what-we-do-not-evaluate"
                    className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5 text-red-600" />
                    Out of scope
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    Scores measure telemetry availability only, not protection quality.
                  </p>
                  <div className="grid gap-2.5">
                    {notEvaluateItems.map((item) => (
                      <div key={item} className="meth-list-item meth-list-item--no">
                        <div className="meth-list-icon meth-list-icon--no">
                          <XCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 02 Direct vs inferred */}
          <section>
            <SectionHead
              number="02"
              titleId="direct-vs-inferred"
              title="Direct Telemetry vs Inferred Activity"
              lead="Direct events score; circumstantial clues do not replace them"
            />
            <div className="meth-card" data-reveal data-reveal-delay="2">
              <div className="meth-card-accent meth-card-accent--blue" />
              <div className="meth-card-body">
                <p className="text-slate-600 leading-relaxed mb-6">
                  Full credit requires a clear event that directly represents the system action.
                  Related or circumstantial evidence may help an investigation, but it does not
                  replace the direct event for scoring.
                </p>
                <div className="meth-table-wrap">
                  <table className="meth-compare-table">
                    <thead>
                      <tr>
                        <th>
                          <span className="inline-flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" /> Direct event that
                            counts
                          </span>
                        </th>
                        <th>
                          <span className="inline-flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-400" /> Insufficient substitute
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {directVsInferred.map((row) => (
                        <tr key={row.direct}>
                          <td className="text-slate-800 font-medium">{row.direct}</td>
                          <td className="text-slate-600">
                            {row.substitute}
                            {row.code && (
                              <code className="ml-1 px-2 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-700">
                                {row.code}
                              </code>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 03 Validity criteria */}
          <section>
            <SectionHead
              number="03"
              titleId="valid-telemetry-criteria"
              title="Valid Telemetry Criteria"
              lead="All conditions must be satisfied for a telemetry event to count"
            />
            <div className="grid lg:grid-cols-3 gap-6">
              <div
                className="lg:col-span-2 meth-card"
                data-reveal
                data-reveal-delay="2"
              >
                <div className="meth-card-accent meth-card-accent--cyan" />
                <div className="meth-card-body">
                  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 mb-1">
                        Required conditions
                      </p>
                      <p className="text-slate-600 text-sm mb-0 leading-relaxed">
                        Every criterion must be satisfied for telemetry to receive full validity
                        credit.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                      <CheckCircle className="h-3.5 w-3.5" />
                      7 criteria
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {validityCriteria.map((item, idx) => {
                      const Icon = item.icon
                      const isLast = idx === validityCriteria.length - 1
                      return (
                        <div
                          key={item.label}
                          className={`meth-criterion meth-stagger-item${isLast ? ' sm:col-span-2' : ''}`}
                          style={{ '--meth-stagger': idx }}
                        >
                          <div className="flex shrink-0 flex-col items-center gap-2">
                            <div className="meth-criterion-icon">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <div className="min-w-0 pt-0.5">
                            <h3 className="mb-1.5 text-sm font-bold text-slate-900">{item.label}</h3>
                            <p className="mb-0 text-sm leading-relaxed text-slate-600">{item.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div
                  className="meth-callout meth-callout--blue"
                  data-reveal
                  data-reveal-delay="3"
                >
                  <Clock className="w-8 h-8 mb-3 text-blue-100" />
                  <h3 id="near-real-time" className="text-xl font-bold mb-2 !text-white">
                    Near-Real-Time
                  </h3>
                  <p className="text-blue-50 text-sm leading-relaxed mb-0">
                    Telemetry is available for customer search within{' '}
                    <span className="font-bold text-white">10 minutes</span> by default, unless an
                    engagement explicitly defines a different window.
                  </p>
                </div>
                <div
                  className="meth-card"
                  data-reveal
                  data-reveal-delay="4"
                >
                  <div className="meth-card-accent meth-card-accent--amber" />
                  <div className="meth-card-body">
                    <AlertTriangle className="w-8 h-8 mb-3 text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Consumer Availability</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-0">
                      Telemetry must be accessible through the product UI, API, or export without
                      vendor engineering, support-only retrieval, or manual backend extraction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 04 Status taxonomy */}
          <section>
            <SectionHead
              number="04"
              titleId="status-taxonomy"
              title="Status Taxonomy & Scoring"
              lead="How each telemetry sub-category receives a numeric value"
            />
            <div className="meth-status-grid mb-6">
              {statusDefinitions.map((row, index) => (
                <div
                  key={row.status}
                  className={`meth-status-card meth-status-card--${row.color}`}
                  data-reveal
                  data-reveal-from="scale"
                  data-reveal-delay={String(Math.min(index + 1, 6))}
                >
                  <div className="flex items-center justify-between gap-3 mb-3 pl-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadgeColors[row.color]}`}
                    >
                      {row.status}
                    </span>
                    <span
                      className={`meth-status-value ${
                        row.value === '1.0'
                          ? 'meth-status-value--full'
                          : row.value === '0.5'
                            ? 'meth-status-value--half'
                            : 'meth-status-value--zero'
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-0 pl-2">{row.meaning}</p>
                </div>
              ))}
            </div>

            <div className="meth-card" data-reveal data-reveal-delay="3">
              <div className="meth-card-accent meth-card-accent--spectrum" />
              <div className="meth-card-body">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 mb-4">
                  Via EventLogs (platform context)
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {platformLogs.map((item, index) => (
                    <div
                      key={item.platform}
                      className="meth-platform-card meth-stagger-item"
                      style={{ '--meth-stagger': index }}
                    >
                      <div
                        className={`meth-platform-icon meth-platform-icon--${item.color}`}
                        aria-hidden="true"
                      >
                        <item.Logo className="home-platform-logo" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{item.platform}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-0">{item.logs}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 05 Evidence */}
          <section>
            <SectionHead
              number="05"
              title="Evidence Standards"
              lead="What reviewers need to recheck a status claim"
            />
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="meth-card" data-reveal data-reveal-delay="2">
                <div className="meth-card-accent meth-card-accent--emerald" />
                <div className="meth-card-body">
                  <div className="flex items-center gap-2 mb-4">
                    <FileSearch className="w-6 h-6 text-blue-600" />
                    <h3 id="evidence-package" className="text-xl font-bold text-slate-900 mb-0">
                      Minimum Evidence
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-5">
                    Each direct-test conclusion should be traceable to evidence that can be
                    rechecked.
                  </p>
                  <div className="space-y-2.5">
                    {evidenceItems.map((item, index) => (
                      <div
                        key={item}
                        className="meth-list-item meth-list-item--evidence meth-stagger-item"
                        style={{ '--meth-stagger': index }}
                      >
                        <div className="meth-list-icon meth-list-icon--yes">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="meth-card" data-reveal data-reveal-delay="3">
                <div className="meth-card-accent meth-card-accent--amber" />
                <div className="meth-card-body">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    <h3 id="absence-findings" className="text-xl font-bold text-slate-900 mb-0">
                      Absence Findings
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-5">
                    A <span className="font-semibold text-red-600">No</span> or absence finding must
                    document what was searched and how. If a vendor disputes the finding, they must
                    identify the specific source, table, or query for a targeted recheck.
                  </p>
                  <div className="space-y-2.5">
                    {absenceItems.map((item, index) => (
                      <div
                        key={item}
                        className="meth-list-item meth-list-item--absence meth-stagger-item"
                        style={{ '--meth-stagger': index }}
                      >
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                        <span className="text-amber-900 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 06 Governance */}
          <section>
            <SectionHead
              number="06"
              titleId="optional-telemetry"
              title="Optional Telemetry Governance"
              lead="How new sub-categories earn score-bearing status"
            />
            <div className="meth-card" data-reveal data-reveal-delay="2">
              <div className="meth-card-accent meth-card-accent--indigo" />
              <div className="meth-card-body">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="meth-threshold md:col-span-1" data-meth-threshold>
                    <span className="meth-threshold-value" data-meth-threshold-value>
                      75%
                    </span>
                    <p className="text-sm text-slate-500 mt-3 font-medium mb-0">
                      Vendor coverage threshold
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <p className="text-slate-600 leading-relaxed mb-0">
                      New sub-categories are excluded from scoring until they reach{' '}
                      <strong className="text-slate-800">75% implementation coverage</strong> across
                      the supported vendor set for the scoped platform.
                    </p>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-900 leading-relaxed mb-0">
                        Only{' '}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Yes
                        </span>{' '}
                        and{' '}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
                          Via EnablingTelemetry
                        </span>{' '}
                        count as implementation coverage. <span className="font-semibold">Partially</span>,{' '}
                        <span className="font-semibold">Via EventLogs</span>,{' '}
                        <span className="font-semibold">No</span>, and{' '}
                        <span className="font-semibold">Pending Response</span> do not count toward
                        the threshold unless a future methodology version says otherwise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 07 Workflow */}
          <section>
            <SectionHead
              number="07"
              titleId="vendor-assisted-workflow"
              title="Vendor-Assisted Direct Evaluation Workflow"
              lead="The controlled process for contracted telemetry evaluations"
            />
            <div className="meth-card" data-reveal data-reveal-delay="2">
              <div className="meth-card-accent meth-card-accent--blue" />
              <div className="meth-card-body md:p-10">
                <div className="meth-workflow">
                  {workflow.map((step, index) => (
                    <div
                      key={step.title}
                      className="meth-workflow-step meth-stagger-item group"
                      style={{ '--meth-stagger': index }}
                    >
                      <div className="meth-workflow-num">{index + 1}</div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-0">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Versioning CTA */}
          <section className="meth-cta" data-reveal data-reveal-delay="1">
            <div className="meth-cta-orb meth-cta-orb--left" aria-hidden="true" />
            <div className="meth-cta-orb meth-cta-orb--right" aria-hidden="true" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 id="versioning" className="text-3xl font-bold !text-white !text-center mb-4 w-full">
                Versioning
              </h2>
              <p className="!text-slate-300 !text-center leading-relaxed mb-8 max-w-2xl">
                This page summarizes methodology version 1.1 dated 2026-04-27. Live links are
                informational unless an agreement incorporates a later revision.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/scores"
                  className="meth-btn meth-btn--primary inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold shadow-lg"
                >
                  View Scores
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/contribute"
                  className="meth-btn meth-btn--ghost inline-flex items-center justify-center px-6 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl !text-white font-bold"
                >
                  Contribute Evidence
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </TemplatePage>
  )
}

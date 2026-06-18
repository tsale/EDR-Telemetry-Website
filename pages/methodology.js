import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import {
  CheckCircle, Clock, Database, FileSearch, GitPullRequest,
  Scale, Shield, Sliders, XCircle, ArrowRight, Monitor,
  Terminal, Command, AlertTriangle, BookOpen, Target, Activity,
  Eye, Zap, ClipboardCheck
} from 'lucide-react'

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
  'Observed fields, missing expected fields, screenshot, raw export, and status rationale'
]

const statusDefinitions = [
  { status: 'Yes', value: '1.0', meaning: 'Required telemetry is implemented and exposed directly.', color: 'emerald' },
  { status: 'Via EnablingTelemetry', value: '1.0', meaning: 'Telemetry exists only after enabling a built-in setting or feature. Same numeric value as Yes, but not equivalent to out-of-the-box Yes.', color: 'sky' },
  { status: 'Partially', value: '0.5', meaning: 'Related telemetry exists, but full-credit validity fails because it is incomplete, conditional, subset-only, inconsistent, missing required fields, or related-but-not-direct.', color: 'amber' },
  { status: 'Via EventLogs', value: '0.5', meaning: 'Telemetry is surfaced through platform-native OS logs rather than independent native sensor collection.', color: 'blue' },
  { status: 'No', value: '0.0', meaning: 'Telemetry is not implemented or is not exposed in a qualifying way.', color: 'red' },
  { status: 'Pending Response', value: '0.0', meaning: 'Status remains unresolved at scoring time and cannot be upgraded without qualifying evidence.', color: 'purple' }
]

const directVsInferred = [
  { direct: 'User creation or modification event', substitute: 'Linux file-attribute changes instead of a user-modification event' },
  { direct: 'Scheduled task creation event', substitute: 'Generic cron or process activity instead of a scheduled-task event' },
  { direct: 'Handle opening or remote thread event', substitute: 'Generic process-created event' },
  { direct: 'Service creation event', substitute: 'Registry change under ', code: 'HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services' }
]

const workflow = [
  { title: 'Scope Confirmation', desc: 'Confirm OS, edition, tenant, product version, sensor version, and sign-off contact in writing.' },
  { title: 'Test System Setup', desc: 'Evaluator supplies test systems and installs the EDR agent. Vendor assigns intended policies and tenant-side configuration.' },
  { title: 'Validation & Sign-off', desc: 'Vendor validates the setup and gives written readiness/sign-off before testing begins.' },
  { title: 'Configuration Freeze', desc: 'Configuration is frozen after sign-off. Material changes require written agreement and may reset the evaluation.' },
  { title: 'Controlled Execution', desc: 'Evaluator executes the agreed activity set and collects raw product telemetry.' },
  { title: 'Event Validation', desc: 'Each sub-category is validated against the event-validity criteria and assigned a status.' },
  { title: 'Reporting', desc: 'Reporting includes category status, scoring, justification, caveats, and review material.' }
]

const platformLogs = [
  { platform: 'Windows', logs: 'Windows Event Logs consumed by the EDR rather than independently collected native instrumentation such as ETW.', icon: Monitor, color: 'blue' },
  { platform: 'Linux', logs: 'auditd, journald, syslog, or equivalent OS-level logs consumed rather than independent Linux telemetry such as eBPF probes or kernel module instrumentation.', icon: Terminal, color: 'orange' },
  { platform: 'macOS', logs: 'Unified Logging, OpenBSM, or equivalent OS-native logs consumed rather than native macOS telemetry such as EndpointSecurity.', icon: Command, color: 'purple' }
]

const absenceItems = [
  'Search window used',
  'Sources searched',
  'Queries or search terms run',
  'Time range covered',
  'Endpoint identifiers examined',
  'Relevant vendor table or index guidance consulted'
]

const navSections = [
  { id: 'what-we-evaluate', label: 'Scope' },
  { id: 'direct-vs-inferred', label: 'Directness' },
  { id: 'valid-telemetry-criteria', label: 'Validity' },
  { id: 'status-taxonomy', label: 'Status' },
  { id: 'evidence-package', label: 'Evidence' },
  { id: 'optional-telemetry', label: 'Governance' },
  { id: 'vendor-assisted-workflow', label: 'Workflow' }
]

const statusBadgeColors = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200'
}

const platformIconColors = {
  blue: 'bg-blue-100 text-blue-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600'
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
      { rootMargin: '-30% 0px -60% 0px' }
    )
    navSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <TemplatePage
      title="Methodology & Evidence Standards - EDR Telemetry Project"
      description="How the EDR Telemetry Project evaluates exposed endpoint telemetry, assigns scoring statuses, handles evidence, and runs direct evaluations."
    >
      <style>{`
        .methodology-card {
          transition: all 0.3s ease;
        }
        .methodology-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
        }
        .methodology-nav-pill {
          transition: all 0.2s ease;
        }
        .methodology-nav-pill.active {
          background: rgb(37 99 235);
          color: white;
          border-color: rgb(37 99 235);
        }
        .workflow-line {
          position: absolute;
          left: 23px;
          top: 40px;
          bottom: -20px;
          width: 2px;
          background: linear-gradient(to bottom, #3b82f6, #93c5fd, transparent);
        }
        h1[id], h2[id], h3[id] {
          scroll-margin-top: 120px;
        }
        @media (max-width: 768px) {
          .workflow-line { display: none; }
          h1[id], h2[id], h3[id] {
            scroll-margin-top: 140px;
          }
        }
        .methodology-cta-section .heading-wrapper {
          display: block;
          width: 100%;
          text-align: center;
        }
        .methodology-cta-section .heading-link {
          left: auto;
          right: 0;
        }
        .validity-criterion {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .validity-criterion:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[5%] w-[60%] h-[60%] rounded-full bg-blue-900/30 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute -bottom-[20%] -right-[5%] w-[60%] h-[60%] rounded-full bg-indigo-900/25 blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-blue-800/10 blur-[100px]"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm">
            <Shield className="w-4 h-4 mr-2" />
            Methodology Version 1.1
            <span className="mx-2 text-blue-500/50">|</span>
            <span className="text-blue-400/80">2026-04-27</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white !text-center leading-tight w-full">
            Methodology &amp;{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Evidence Standards
            </span>
          </h1>
          <p className="mt-6 text-xl !text-slate-300 !text-center max-w-2xl leading-relaxed">
            The EDR Telemetry Project measures exposed endpoint telemetry visibility. It does not measure prevention, detection efficacy, alert quality, managed service quality, or overall product quality.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#what-we-evaluate" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              <BookOpen className="w-5 h-5 mr-2" />
              Read the Methodology
            </Link>
            <Link href="/scores" className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl !text-slate-200 font-bold transition-all hover:-translate-y-0.5">
              View Scores
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Nav Bar */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`methodology-nav-pill inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${
                  activeSection === section.id
                    ? 'active'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

          {/* Section 01: What We Evaluate / Don't Evaluate */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">01</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Scope &amp; Boundaries</h2>
                <p className="text-sm text-slate-500 mb-0">What the project evaluates and what it deliberately does not</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <h3 id="what-we-evaluate" className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  What We Evaluate
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  Telemetry visibility exposed to users: raw or near-raw event data that customers and analysts can use to investigate, build detections, and hunt.
                </p>
                <div className="grid gap-2.5">
                  {['Automatically collected by the endpoint sensor', 'Generated as activity occurs', 'Transmitted in real time or near-real time', 'Exposed to the product consumer for analysis or hunting'].map((item) => (
                    <div key={item} className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 rounded-lg border border-emerald-100/80">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
                <h3 id="what-we-do-not-evaluate" className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  What We Do Not Evaluate
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  A score is a telemetry availability score. It is not a product ranking for protection quality.
                </p>
                <div className="grid gap-2.5">
                  {['Prevention efficacy', 'Detection efficacy', 'Quality of built-in detections or analytics', 'Staffing, MDR, SOC workflow maturity, or full IR capability', 'Backend conclusions not exposed as direct event records'].map((item) => (
                    <div key={item} className="flex items-center gap-3 px-4 py-2.5 bg-red-50 rounded-lg border border-red-100/80">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Direct vs Inferred */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">02</div>
              <div>
                <h2 id="direct-vs-inferred" className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Direct Telemetry vs Inferred Activity</h2>
                <p className="text-sm text-slate-500 mb-0">Why a direct event matters more than a circumstantial clue</p>
              </div>
            </div>
            <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <p className="text-slate-600 leading-relaxed mb-6">
                Full credit requires a clear event that directly represents the system action. Related or circumstantial evidence may help an investigation, but it does not replace the direct event for scoring.
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-sm font-bold text-slate-700">
                        <span className="inline-flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Direct event that counts</span>
                      </th>
                      <th className="px-5 py-3.5 text-left text-sm font-bold text-slate-700">
                        <span className="inline-flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" /> Insufficient substitute</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {directVsInferred.map((row) => (
                      <tr key={row.direct} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-slate-800 font-medium">{row.direct}</td>
                        <td className="px-5 py-4 text-slate-600">
                          {row.substitute}
                          {row.code && <code className="ml-1 px-2 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-700">{row.code}</code>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 03: Valid Telemetry Criteria + Near-Real-Time */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">03</div>
              <div>
                <h2 id="valid-telemetry-criteria" className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Valid Telemetry Criteria</h2>
                <p className="text-sm text-slate-500 mb-0">All conditions must be satisfied for a telemetry event to count</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600 mb-1">Required conditions</p>
                    <p className="text-slate-600 text-sm mb-0 leading-relaxed">
                      Every criterion must be satisfied for telemetry to receive full validity credit.
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
                        className={[
                          'validity-criterion group relative flex gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/80 p-4 shadow-sm hover:border-blue-200 hover:shadow-md',
                          isLast ? 'sm:col-span-2' : '',
                        ].join(' ')}
                      >
                        <div className="flex shrink-0 flex-col items-center gap-2">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
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
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10"></div>
                  <Clock className="w-8 h-8 mb-3 text-blue-100" />
                  <h3 id="near-real-time" className="text-xl font-bold mb-2 !text-white">Near-Real-Time</h3>
                  <p className="text-blue-50 text-sm leading-relaxed mb-0">
                    Telemetry is available for customer search within{' '}
                    <span className="font-bold text-white">10 minutes</span> by default, unless an engagement explicitly defines a different window.
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                  <AlertTriangle className="w-8 h-8 mb-3 text-amber-500" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Consumer Availability</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-0">
                    Telemetry must be accessible through the product UI, API, or export without vendor engineering, support-only retrieval, or manual backend extraction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Status Taxonomy */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">04</div>
              <div>
                <h2 id="status-taxonomy" className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Status Taxonomy &amp; Scoring</h2>
                <p className="text-sm text-slate-500 mb-0">How each telemetry sub-category receives a numeric value</p>
              </div>
            </div>
            <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-sm font-bold text-slate-700">Status</th>
                      <th className="px-5 py-3.5 text-center text-sm font-bold text-slate-700">Value</th>
                      <th className="px-5 py-3.5 text-left text-sm font-bold text-slate-700">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {statusDefinitions.map((row) => (
                      <tr key={row.status} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadgeColors[row.color]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-12 h-7 rounded-lg text-sm font-bold ${
                            row.value === '1.0' ? 'bg-emerald-100 text-emerald-700' :
                            row.value === '0.5' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>{row.value}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 text-sm leading-relaxed">{row.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 05: Evidence Package + Absence Findings */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">05</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Evidence Standards</h2>
                <p className="text-sm text-slate-500 mb-0">What reviewers need to recheck a status claim</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                <div className="flex items-center gap-2 mb-4">
                  <FileSearch className="w-6 h-6 text-blue-600" />
                  <h3 id="evidence-package" className="text-xl font-bold text-slate-900 mb-0">Minimum Evidence</h3>
                </div>
                <p className="text-slate-600 text-sm mb-5">Each direct-test conclusion should be traceable to evidence that can be rechecked.</p>
                <div className="space-y-2.5">
                  {evidenceItems.map((item, idx) => (
                    <div key={item} className="flex items-start gap-3 px-4 py-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h3 id="absence-findings" className="text-xl font-bold text-slate-900 mb-0">Absence Findings</h3>
                </div>
                <p className="text-slate-600 text-sm mb-5">
                  A <span className="font-semibold text-red-600">No</span> or absence finding must document what was searched and how. If a vendor disputes the finding, they must identify the specific source, table, or query for a targeted recheck.
                </p>
                <div className="space-y-2.5">
                  {absenceItems.map((item) => (
                    <div key={item} className="flex items-center gap-3 px-4 py-2.5 bg-amber-50/70 rounded-lg border border-amber-100/70 hover:bg-amber-50 transition-colors">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span className="text-amber-900 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 06: Optional Telemetry Governance */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">06</div>
              <div>
                <h2 id="optional-telemetry" className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Optional Telemetry Governance</h2>
                <p className="text-sm text-slate-500 mb-0">How new sub-categories earn score-bearing status</p>
              </div>
            </div>
            <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 text-center">
                  <div className="inline-flex items-center justify-center">
                    <span className="text-6xl font-extrabold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">75%</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Vendor coverage threshold</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <p className="text-slate-600 leading-relaxed mb-0">
                    New sub-categories are excluded from scoring until they reach <strong className="text-slate-800">75% implementation coverage</strong> across the supported vendor set for the scoped platform.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-900 leading-relaxed mb-0">
                      Only <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Yes</span> and <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">Via EnablingTelemetry</span> count as implementation coverage. <span className="font-semibold">Partially</span>, <span className="font-semibold">Via EventLogs</span>, <span className="font-semibold">No</span>, and <span className="font-semibold">Pending Response</span> do not count toward the threshold unless a future methodology version says otherwise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 07: Vendor-Assisted Workflow */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm">07</div>
              <div>
                <h2 id="vendor-assisted-workflow" className="text-2xl md:text-3xl font-bold text-slate-900 mb-0">Vendor-Assisted Direct Evaluation Workflow</h2>
                <p className="text-sm text-slate-500 mb-0">The controlled process for contracted telemetry evaluations</p>
              </div>
            </div>
            <div className="methodology-card bg-white rounded-2xl shadow-lg p-7 md:p-10 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400"></div>
              <div className="relative md:pl-2">
                {workflow.map((step, index) => (
                  <div key={step.title} className="relative flex gap-5 pb-8 last:pb-0 group">
                    {index < workflow.length - 1 && <div className="workflow-line"></div>}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-0">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Versioning CTA */}
          <section className="methodology-cta-section relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
            <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[80%] rounded-full bg-blue-900/30 blur-[100px]"></div>
            <div className="absolute -bottom-[30%] -right-[10%] w-[50%] h-[80%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
            <div className="relative p-8 md:p-12 flex flex-col items-center text-center">
              <h2 id="versioning" className="text-3xl font-bold !text-white !text-center mb-4 w-full">Versioning</h2>
              <p className="!text-slate-300 !text-center leading-relaxed mb-8 max-w-2xl">
                This page summarizes methodology version 1.1 dated 2026-04-27. Live links are informational unless an agreement incorporates a later revision.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/scores" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
                  View Scores
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link href="/contribute" className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl !text-white font-bold transition-all hover:-translate-y-0.5">
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

import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import Script from 'next/script'
import Head from 'next/head'
import { useEffect } from 'react'
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ExternalLink,
  GitCompare,
  Headphones,
  Layers,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { SITE_URL } from '../lib/site'

const validationItems = [
  'Telemetry benchmarking against controlled activity',
  'Configuration and policy review',
  'Data quality and field validation',
  'Windows, Linux, and macOS visibility review',
  'Investigation workflow testing',
  'Containment and response validation',
  'SIEM and data-pipeline validation',
  'Exclusion and blind-spot review',
  'Prioritized remediation plan',
]

const selectionItems = [
  'Requirements and constraint definition',
  'Vendor shortlisting',
  'Structured product comparison',
  'Proof-of-value design',
  'Telemetry and investigation-workflow assessment',
  'Deployment and integration considerations',
  'Commercial and operational trade-offs',
  'Documented recommendation',
]

const workflow = [
  { title: 'Scope & manifest', detail: 'Capture the environment, product version, and configuration under test.' },
  { title: 'Validation sign-off', detail: 'Confirm scope and obtain written approval before testing begins.' },
  { title: 'Configuration freeze', detail: 'Lock the evaluated state so results stay attributable.' },
  { title: 'Controlled activity', detail: 'Execute repeatable actions designed to exercise telemetry paths.' },
  { title: 'Evidence collection', detail: 'Review raw or near-raw search and export paths available to the consumer.' },
  { title: 'Event validation', detail: 'Map expected versus observed telemetry and assign status.' },
  { title: 'Scoring & caveats', detail: 'Apply methodology rules and document meaningful limitations.' },
  { title: 'Reporting & review', detail: 'Deliver findings, priorities, and recommended next steps.' },
]

const manifest = [
  'Operating system version, build, and architecture',
  'Sensor version and build',
  'Tenant or cloud region, if relevant',
  'SKU, license, and enabled modules',
  'Policy/configuration export, hash, or version identifier',
  'Enabled telemetry settings',
  'Product mode',
  'Retention, search, or API path',
  'Authorized sign-off contact and timestamp',
]

const reasonSteps = [
  {
    step: '01',
    icon: Search,
    title: 'Start from the public baseline',
    copy: 'Published telemetry research shows what was observed under controlled, versioned test conditions — a useful reference, not a deployment verdict.',
  },
  {
    step: '02',
    icon: Layers,
    title: 'Account for your environment',
    copy: 'Sensor policy, OS mix, licensing, retention, exclusions, integrations, and response workflows change what visibility is actually usable.',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Validate with client-specific evidence',
    copy: "Defendpoint applies the project's evidence standards to your questions so findings stay traceable to configuration, activity, and observed data.",
  },
]

const environmentFactors = [
  'Sensor configuration',
  'OS mix',
  'Licensing & modules',
  'Retention paths',
  'Exclusions',
  'SIEM integrations',
  'Response workflows',
  'Compliance constraints',
]

const extendedLinks = [
  {
    label: 'EDR Deployment & Migration',
    description: 'Plan production rollout, migration sequencing, and cutover risk.',
    href: 'https://defendpoint.ca/edr-deployment-migration',
    icon: Rocket,
  },
  {
    label: 'EDR Advisory',
    description: 'Ongoing lifecycle guidance as policies, platforms, and threats evolve.',
    href: 'https://defendpoint.ca/edr-advisory-retainer',
    icon: Headphones,
  },
  {
    label: 'View All EDR Services',
    description: 'Explore the full Defendpoint EDR advisory and engineering catalog.',
    href: 'https://defendpoint.ca/edr-services',
    icon: RefreshCw,
  },
]

function ServicePanel({
  eyebrow,
  title,
  description,
  outcome,
  items,
  href,
  cta,
  icon: Icon,
  accent = 'blue',
  revealDelay = '1',
}) {
  const accentStyles = {
    blue: {
      shell: 'hover:border-blue-300',
      icon: 'bg-blue-600 shadow-blue-600/25',
      eyebrow: 'bg-blue-50 text-blue-700 border-blue-100',
      outcome: 'bg-blue-50/80 border-blue-100 text-blue-900',
      cta: 'bg-blue-600 hover:bg-blue-700',
      glow: 'from-blue-500/15 via-transparent to-transparent',
    },
    slate: {
      shell: 'hover:border-slate-400',
      icon: 'bg-slate-900 shadow-slate-900/20',
      eyebrow: 'bg-slate-100 text-slate-700 border-slate-200',
      outcome: 'bg-slate-100/80 border-slate-200 text-slate-800',
      cta: 'bg-slate-900 hover:bg-slate-800',
      glow: 'from-slate-500/15 via-transparent to-transparent',
    },
  }[accent]

  return (
    <article
      data-reveal
      data-reveal-delay={revealDelay}
      className={`premium-service-panel group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentStyles.shell}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentStyles.glow}`} />

      <div className="relative p-7 md:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${accentStyles.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.14em] ${accentStyles.eyebrow}`}>
            {eyebrow}
          </span>
        </div>

        <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-[1.7rem]">{title}</h3>
        <p className="mb-5 leading-relaxed text-slate-600">{description}</p>
        <p className={`rounded-xl border px-4 py-3 text-sm font-medium leading-relaxed ${accentStyles.outcome}`}>
          {outcome}
        </p>
      </div>

      <div className="relative flex-1 border-t border-slate-100 px-7 py-6 md:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">What&apos;s included</p>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-700 transition-colors group-hover:border-slate-200"
            >
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-auto border-t border-slate-100 bg-slate-50/70 p-5 md:px-8 md:py-6">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold !text-white shadow-md transition-all ${accentStyles.cta}`}
        >
          {cta}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  )
}

export default function PremiumServices() {
  useEffect(() => {
    const initialize = () => {
      if (!window.Cal) return false
      try {
        window.Cal('init', 'edr-telemetry-discussion-call', { origin: 'https://app.cal.com' })
        window.Cal.ns['edr-telemetry-discussion-call']('inline', {
          elementOrSelector: '#my-cal-inline-edr-telemetry-discussion-call',
          config: { layout: 'month_view', theme: 'auto' },
          calLink: 'kostas-hcq78e/edr-telemetry-discussion-call',
        })
        return true
      } catch (error) {
        console.error('Cal.com initialization error:', error)
        return true
      }
    }
    if (initialize()) return undefined
    const timer = window.setInterval(() => initialize() && window.clearInterval(timer), 200)
    return () => window.clearInterval(timer)
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
      { threshold: 0.05, rootMargin: '0px 0px -24px 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const title = 'Apply EDR Telemetry Research to Your Environment | EDR Telemetry Project'
  const description = 'Apply EDR Telemetry Project research to EDR selection, deployment validation, telemetry benchmarking, and optimization through Defendpoint Consulting.'

  return (
    <TemplatePage
      title={title}
      description={description}
      ogTitle={title}
      ogDescription="Use evidence-backed EDR telemetry research to validate an existing deployment, compare platforms, and plan targeted improvements with Defendpoint Consulting."
      canonicalPath="/premium-services"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: title,
              url: `${SITE_URL}/premium-services`,
              description,
              about: 'Applying public EDR telemetry research to client-specific EDR validation and evaluation',
              isPartOf: { '@type': 'WebSite', name: 'EDR Telemetry Project', url: SITE_URL },
              provider: { '@type': 'Organization', name: 'Defendpoint Consulting', url: 'https://defendpoint.ca' },
            }),
          }}
        />
      </Head>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 pt-20 pb-24 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full bg-blue-900/25 blur-[100px]" />
          <div className="absolute -right-[10%] -bottom-[30%] h-[70%] w-[70%] rounded-full bg-slate-700/30 blur-[100px]" />
          <div className="premium-hero-grid absolute inset-0 opacity-[0.12]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p data-reveal data-reveal-delay="1" className="mb-6 text-sm font-semibold tracking-[0.2em] text-blue-300">
              FROM PUBLIC RESEARCH TO YOUR ENVIRONMENT
            </p>
            <h1
              data-reveal
              data-reveal-delay="2"
              className="mb-6 text-5xl font-extrabold tracking-tight !text-white md:text-6xl md:leading-[1.1]"
            >
              Apply EDR Telemetry Research{' '}
              <span className="block text-blue-400">to Your Environment</span>
            </h1>
            <p
              data-reveal
              data-reveal-delay="3"
              className="mx-auto max-w-3xl text-xl leading-relaxed !text-slate-300"
            >
              Defendpoint Consulting helps security teams apply the EDR Telemetry Project&apos;s research to their own
              environments. Validate an existing EDR deployment, compare platforms against your requirements, and
              turn telemetry findings into practical improvements.
            </p>
            <div
              data-reveal
              data-reveal-delay="4"
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="https://defendpoint.ca/edr-validation-optimization"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold !text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25"
              >
                Plan an EDR Validation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="https://defendpoint.ca/edr-services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-8 py-4 text-base font-bold !text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800"
              >
                Explore Defendpoint EDR Services
              </a>
            </div>
            <div
              data-reveal
              data-reveal-delay="5"
              className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-slate-800/80 pt-8 text-sm font-medium text-slate-400"
            >
              <span>Evidence-backed methodology</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
              <span>Client-specific scope</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
              <span>Vendor-neutral advisory</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why client environments differ */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-slate-200/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 lg:gap-16">
            <div className="md:sticky md:top-28" data-reveal data-reveal-delay="1">
              <p className="mb-4 text-sm font-bold tracking-[0.18em] text-blue-600">FROM RESEARCH TO REALITY</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl md:leading-tight">
                Public research,
                <span className="block text-blue-600">applied to your constraints</span>
              </h2>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-600">
                Public benchmark data provides a useful baseline. Client environments introduce additional variables
                that change what visibility and investigation capability actually look like in practice.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Variables that reshape the picture
                </p>
                <div className="flex flex-wrap gap-2">
                  {environmentFactors.map((factor) => (
                    <span
                      key={factor}
                      className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ol className="premium-reason-path relative space-y-4">
              {reasonSteps.map(({ step, icon: Icon, title: reasonTitle, copy }, index) => (
                <li
                  key={reasonTitle}
                  data-reveal
                  data-reveal-delay={String(index + 2)}
                  className="premium-reason-step group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-xs font-bold tracking-[0.18em] text-blue-600">{step}</span>
                        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-slate-900">{reasonTitle}</h3>
                      <p className="leading-relaxed text-slate-600">{copy}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Two engagement paths */}
      <section id="services" className="relative overflow-hidden bg-white py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center" data-reveal data-reveal-delay="1">
            <p className="mb-3 text-sm font-bold tracking-[0.18em] text-blue-600">ENGAGEMENT PATHS</p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Two Common Ways Organizations Work With Us
            </h2>
            <p className="text-lg text-slate-600">
              Whether you already have an EDR or are choosing one, engagements are scoped around your requirements,
              infrastructure, and operating model — not a generic feature checklist.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <ServicePanel
              eyebrow="EXISTING DEPLOYMENT"
              title="EDR Validation & Optimization"
              description="Validate what your current EDR actually exposes in your environment, identify visibility and configuration gaps, and prioritize practical improvements."
              outcome="Best fit when you need evidence of real telemetry coverage, blind spots, and remediation priorities in a live deployment."
              items={validationItems}
              href="https://defendpoint.ca/edr-validation-optimization"
              cta="Discuss EDR Validation"
              icon={ShieldCheck}
              accent="blue"
              revealDelay="2"
            />
            <ServicePanel
              eyebrow="PLATFORM DECISION"
              title="EDR Selection & Comparison"
              description="Evaluate EDR platforms against your technical, operational, commercial, infrastructure, and compliance requirements instead of relying on a generic feature checklist."
              outcome="Best fit when you need a structured shortlist, proof-of-value design, and a documented recommendation for your environment."
              items={selectionItems}
              href="https://defendpoint.ca/edr-selection-comparison"
              cta="Plan an EDR Evaluation"
              icon={GitCompare}
              accent="slate"
              revealDelay="3"
            />
          </div>

          <div className="premium-extended-strip relative mt-12 overflow-hidden rounded-3xl bg-slate-900 px-7 py-9 md:px-10 md:py-10">
            <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-slate-500/20 blur-3xl" />

            <div className="relative mb-8 max-w-3xl" data-reveal data-reveal-delay="1">
              <p className="mb-3 text-sm font-bold tracking-[0.18em] text-blue-300">BEYOND EVALUATION</p>
              <h3 className="mb-3 text-2xl font-bold !text-white md:text-3xl">Need Help Beyond the Evaluation?</h3>
              <p className="text-lg !text-slate-300 leading-relaxed">
                Defendpoint also supports EDR deployment, migration, production rollout, and ongoing lifecycle advisory
                when the engagement extends beyond research or validation.
              </p>
            </div>

            <div className="relative grid gap-4 md:grid-cols-3">
              {extendedLinks.map(({ label, description: linkDescription, href, icon: Icon }, index) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                  data-reveal-delay={String(index + 2)}
                  className="group rounded-2xl border border-slate-700/80 bg-slate-800/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/60 hover:bg-slate-800/80"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mb-2 text-base font-bold !text-white">{label}</h4>
                  <p className="mb-4 text-sm leading-relaxed !text-slate-400">{linkDescription}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-blue-300 transition-colors group-hover:text-blue-200">
                    Learn more
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Methodology workflow */}
      <section id="direct-evaluation-workflow" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center" data-reveal data-reveal-delay="1">
            <p className="mb-3 text-sm font-bold tracking-[0.18em] text-blue-600">METHODOLOGY-BACKED</p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              How a Direct Evaluation Works
            </h2>
            <p className="text-lg text-slate-600">
              Contracted telemetry evaluations use a controlled, evidence-backed workflow so every result can be
              traced to the tested configuration, executed activity, raw evidence, and methodology version used for
              the engagement.
            </p>
          </div>

          <ol className="premium-workflow relative mx-auto max-w-5xl space-y-0">
            {workflow.map((step, index) => (
              <li
                key={step.title}
                data-reveal
                data-reveal-delay={String(Math.min(index + 1, 5))}
                className="premium-workflow-step relative grid gap-4 py-5 md:grid-cols-[4.5rem_1fr] md:gap-8"
              >
                <div className="relative flex md:justify-center">
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-600/25">
                    {index + 1}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-blue-200 hover:bg-blue-50/40">
                  <h3 className="mb-1 text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div
            data-reveal
            data-reveal-delay="2"
            className="mx-auto mt-14 max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <h3 className="mb-2 text-xl font-bold text-slate-900">Configuration manifest captured before testing</h3>
            <p className="mb-6 text-slate-600">
              Results stay tied to a documented environment state so findings remain interpretable after the engagement.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {manifest.map((item) => (
                <span
                  key={item}
                  className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
            <Link
              href="/methodology#vendor-assisted-workflow"
              className="mt-8 inline-flex items-center font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Read the Evaluation Methodology
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Complementary research + Defendpoint */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div
              data-reveal
              data-reveal-delay="1"
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-8 md:p-10"
            >
              <div>
                <p className="mb-3 text-sm font-bold tracking-[0.18em] text-blue-600">COMPLEMENTARY RESEARCH</p>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
                  Broader EDR Selection Research via EDR Comparison
                </h2>
                <p className="mb-4 text-slate-600 leading-relaxed">
                  Telemetry visibility is one part of an EDR decision. EDR Comparison adds broader product and feature
                  research to help security teams evaluate platform fit beyond telemetry alone.
                </p>
                <p className="mb-8 text-slate-600 leading-relaxed">
                  Use the public comparison data for initial research, or engage Defendpoint when you need a
                  client-specific evaluation based on your infrastructure, operating model, budget, integrations, and
                  compliance requirements.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://edr-comparison.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-semibold text-blue-600 hover:underline"
                >
                  Explore EDR Comparison
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="https://defendpoint.ca/edr-selection-comparison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-semibold text-blue-600 hover:underline"
                >
                  Plan a Client-Specific EDR Evaluation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div
              data-reveal
              data-reveal-delay="2"
              className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="relative">
                <p className="mb-3 text-sm font-bold tracking-[0.18em] text-blue-300">FULL LIFECYCLE</p>
                <h2 className="mb-4 text-2xl font-bold !text-white md:text-3xl">
                  Continue With Defendpoint Consulting
                </h2>
                <p className="mb-8 !text-slate-300 leading-relaxed">
                  Defendpoint provides independent EDR advisory and engineering across the full platform lifecycle,
                  from selection and proof-of-value work through deployment, migration, validation, optimization, and
                  ongoing advisory.
                </p>
                <a
                  href="https://defendpoint.ca/edr-services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold !text-white transition-colors hover:bg-blue-700"
                >
                  Explore Defendpoint EDR Services
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center" data-reveal data-reveal-delay="1">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Calendar className="h-7 w-7" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              What Are You Trying to Validate?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
              Tell us whether you are validating an existing deployment, comparing EDR platforms, preparing for
              renewal, or planning a migration. We can help define the right scope before an engagement begins.
            </p>
            <a
              href="https://cal.com/kostas-hcq78e/edr-telemetry-discussion-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold !text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25"
            >
              Discuss Your EDR Environment
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          <div
            data-reveal
            data-reveal-delay="2"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"
          >
            <div
              id="my-cal-inline-edr-telemetry-discussion-call"
              className="w-full min-h-[720px] overflow-scroll rounded-xl bg-white"
            />
            <p className="mt-6 text-center text-slate-600">
              If the calendar does not load,{' '}
              <a
                href="https://cal.com/kostas-hcq78e/edr-telemetry-discussion-call"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:underline"
              >
                discuss your EDR environment on Cal.com
              </a>
              .
            </p>
          </div>

          <div className="mt-8 text-center" data-reveal data-reveal-delay="3">
            <a
              href="https://defendpoint.ca/edr-services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-semibold text-blue-600 hover:underline"
            >
              View Defendpoint EDR Services
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <Script id="cal-inline-embed-premium" strategy="lazyOnload">{`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`}</Script>
    </TemplatePage>
  )
}

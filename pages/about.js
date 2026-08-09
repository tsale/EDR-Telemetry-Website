import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ExternalLink, Linkedin, Shield, Twitter } from 'lucide-react'
import { SITE_URL } from '../lib/site'

const goals = [
  'Document EDR telemetry visibility using repeatable, evidence-backed testing',
  'Compare telemetry coverage across supported platforms and products',
  'Identify visibility gaps and implementation differences relevant to investigation and detection work',
  'Give practitioners evidence they can use during EDR validation and evaluation',
  'Encourage clearer vendor documentation and greater transparency around telemetry capabilities',
  'Maintain explicit scope boundaries so telemetry scores are not confused with overall product quality',
]

const measures = [
  'Endpoint activity automatically collected by the sensor',
  'Events generated as activity occurs',
  "Telemetry available in real time or near real time within the methodology's defined window",
  'Data exposed through customer-accessible product interfaces, APIs, or export paths',
  "Direct event records that meet the project's validity and evidence criteria",
]

const doesNotMeasure = [
  'Prevention efficacy', 'Detection efficacy', 'Quality of built-in alerts or analytics',
  'MDR or managed service quality', 'Overall incident response maturity',
  'Overall product quality or “best EDR” ranking',
  'Commercial value, licensing, or support quality as part of the telemetry score',
]

const testSteps = [
  ['Define scope and test conditions', 'Record operating system, product and sensor versions, configuration, enabled modules, and other conditions relevant to the result.'],
  ['Execute controlled activity', 'Generate specific endpoint actions using repeatable tests and project tooling where available.'],
  ['Collect raw or near-raw evidence', 'Review telemetry available to the product consumer rather than relying only on alerts, documentation, or vendor claims.'],
  ['Map expected versus observed telemetry', 'Determine whether the event directly represents the action being tested and whether required fields or context are present.'],
  ['Apply evidence and validity criteria', 'Assign status using the published methodology and document important caveats or missing evidence.'],
  ['Publish scope and limitations', 'Keep product version, test conditions, evidence path, and known limitations visible so results can be rechecked.'],
]

function Checklist({ items }) {
  return <ul className="space-y-3">{items.map((item) => <li key={item} className="flex items-start gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{item}</span></li>)}</ul>
}

export default function About() {
  const title = 'About the EDR Telemetry Project | Independent EDR Telemetry Research'
  const description = 'Learn how the EDR Telemetry Project tests endpoint telemetry visibility, applies evidence standards, works with vendors and contributors, and maintains research independence.'

  return (
    <TemplatePage title={title} description={description} ogTitle="About the EDR Telemetry Project" ogDescription="An open, evidence-backed project documenting EDR telemetry visibility across Windows, Linux, and macOS using controlled testing and transparent methodology." canonicalPath="/about">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About the EDR Telemetry Project',
          url: `${SITE_URL}/about`, description: 'Open, evidence-backed research initiative documenting endpoint telemetry visibility across EDR platforms using controlled testing and transparent methodology.',
          isPartOf: { '@type': 'WebSite', name: 'EDR Telemetry Project', url: SITE_URL },
          maintainer: { '@type': 'Organization', name: 'Defendpoint Consulting', description: 'Independent EDR advisory and engineering firm.', url: 'https://defendpoint.ca' },
        }) }} />
      </Head>

      <section className="relative overflow-hidden bg-slate-900 pt-10 pb-10 text-white sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full bg-blue-900/20 blur-[100px]" />
          <div className="absolute -right-[10%] -bottom-[30%] h-[70%] w-[70%] rounded-full bg-indigo-900/20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.8fr)] md:items-center md:gap-10 lg:gap-14">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
                <Shield className="mr-2 h-4 w-4" />MISSION, SCOPE & GOVERNANCE
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight !text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                About the EDR Telemetry Project
              </h1>
              <p className="max-w-xl text-lg leading-relaxed !text-slate-300 sm:text-xl">
                Open, evidence-backed research documenting EDR telemetry visibility under controlled, versioned test conditions.
              </p>
            </div>

            <div className="flex flex-col gap-5 border-t border-slate-700/70 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:pl-10">
              <ul className="space-y-2.5 text-sm !text-slate-400">
                <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" aria-hidden />Windows, Linux & macOS coverage</li>
                <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" aria-hidden />Published methodology & evidence standards</li>
                <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" aria-hidden />Independent, vendor-neutral research</li>
              </ul>
              <Link
                href="/methodology"
                className="inline-flex w-fit rounded-xl bg-blue-600 px-6 py-3 font-semibold !text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
              >
                Read the Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="mx-auto max-w-3xl space-y-4 text-lg leading-relaxed text-slate-600">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">What This Project Is</h2>
            <p>The EDR Telemetry Project is an open, evidence-backed research initiative maintained by Defendpoint Consulting. It documents and compares endpoint telemetry exposed by EDR platforms under controlled, versioned test conditions.</p>
            <p>The project helps security teams understand visibility gaps, validate EDR deployments, and make better-informed platform decisions. It focuses specifically on exposed telemetry and does not rank overall protection quality, detection efficacy, managed service quality, or the complete value of an EDR product.</p>
            <p>Our goal is to make EDR telemetry claims easier to verify by showing what was tested, what evidence was observed, how results are classified, and where important limitations remain.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Project Goals</h2><Checklist items={goals} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <article className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"><h2 className="text-2xl font-bold text-slate-900 mb-4">What the Project Measures</h2><p className="text-slate-600 mb-6">The project measures telemetry visibility exposed to product consumers: raw or near-raw endpoint event data that can be searched or used for investigation, hunting, or detection engineering.</p><Checklist items={measures} /></article>
            <article className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"><h2 className="text-2xl font-bold text-slate-900 mb-6">What the Project Does Not Measure</h2><Checklist items={doesNotMeasure} /></article>
          </div>
          <div className="text-center"><Link href="/methodology" className="inline-flex px-6 py-3 rounded-xl bg-blue-600 !text-white font-semibold">Read the Full Methodology & Evidence Standards</Link></div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Test</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-4xl">Testing is designed to make every conclusion traceable to a controlled action, the environment in which it was executed, the evidence returned by the product, and the methodology version used to classify the result.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{testSteps.map(([heading, copy], index) => <article key={heading} className="bg-white rounded-2xl p-6 border border-slate-200"><div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">{index + 1}</div><h3 className="text-lg font-bold text-slate-900 mb-2">{heading}</h3><p className="text-slate-600">{copy}</p></article>)}</div>
            <Link href="/methodology" className="inline-flex mt-6 text-blue-600 hover:underline font-semibold">See the Testing Methodology</Link>
          </div>

          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What the Project Is Not</h2>
            <p className="text-lg text-slate-700 mb-6">Telemetry is an important part of EDR evaluation, but it is not the whole decision. The project should be used as one source of technical evidence alongside detection quality, response capabilities, operational fit, integrations, staffing, infrastructure, licensing, compliance requirements, vendor support, and other organization-specific factors.</p>
            <Checklist items={['Not an overall EDR ranking', 'Not a prevention test', 'Not a detection-efficacy test', 'Not an MDR evaluation', 'Not a replacement for a client-specific proof of value', 'Not a guarantee that every deployment or product version will expose identical telemetry']} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <article className="bg-slate-900 rounded-2xl p-8"><h2 className="text-2xl font-bold !text-white mb-4">How the Project Relates to Defendpoint Consulting</h2><p className="!text-slate-300 mb-4">The EDR Telemetry Project is maintained by Defendpoint Consulting and serves as a public research foundation for its EDR advisory and engineering work. The public project focuses on transparent telemetry research. Client-specific EDR selection, deployment, migration, validation, optimization, and advisory engagements are delivered separately through Defendpoint Consulting.</p><p className="!text-slate-300 mb-6">Public benchmark results remain subject to the project&apos;s published methodology and evidence standards. Client engagements may have additional scope, configuration, and decision criteria that are documented separately for the organization involved.</p><a href="https://defendpoint.ca/edr-services" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline font-semibold">Explore Defendpoint EDR Services</a></article>
            <article className="bg-white rounded-2xl p-8 border border-slate-200"><h2 className="text-2xl font-bold text-slate-900 mb-4">Research Independence and Commercial Relationships</h2><p className="text-slate-600 mb-6">The project may interact with vendors, contributors, customers, and sponsors in different ways, including product-access requests, evidence review, commissioned evaluations, and financial support. Those relationships should be disclosed where they are material to interpreting the research.</p><div className="space-y-3"><Link href="/methodology" className="block text-blue-600 hover:underline">Read the Methodology & Evidence Standards</Link><Link href="/blog/Behind-the-Curtain--How-the-EDR-Telemetry-Project-Approaches-Vendor-Relations--Evaluations--and-Transparency" className="block text-blue-600 hover:underline">Read About Vendor Relations and Transparency</Link><Link href="/sponsorship" className="block text-blue-600 hover:underline">Support the Project</Link></div></article>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Open and Community-Informed</h2>
            <p className="text-lg text-slate-600 mb-8">The project is maintained by Defendpoint Consulting and improved through public feedback, technical contributions, vendor corrections, researcher review, and community participation. Community input helps identify gaps and improve accuracy, while published findings remain subject to the project&apos;s methodology and evidence standards.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-2xl p-6 border border-slate-200"><h3 className="text-lg font-bold text-slate-900 mb-2">Public Feedback</h3><p className="text-slate-600">Researchers, practitioners, vendors, and users can report inaccuracies, provide evidence, suggest telemetry categories, and identify areas that need retesting.</p></article>
              <article className="bg-white rounded-2xl p-6 border border-slate-200"><h3 className="text-lg font-bold text-slate-900 mb-2">Contributor and Supporter Community</h3><p className="text-slate-600">The Discord community gives active contributors and project supporters a focused place to discuss findings, validation questions, research ideas, and project updates.</p></article>
              <article className="bg-white rounded-2xl p-6 border border-slate-200"><h3 className="text-lg font-bold text-slate-900 mb-2">Get Involved</h3><p className="text-slate-600">The project&apos;s research and methodology are publicly accessible. Discord access is available to active contributors and project supporters to keep the technical discussion focused and manageable.</p></article>
            </div>
            <div className="mt-6 flex flex-wrap gap-4"><Link href="/contribute" className="text-blue-600 hover:underline font-semibold">Contribute to the Project</Link><Link href="/sponsorship" className="text-blue-600 hover:underline font-semibold">Support the Project</Link></div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 md:flex">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center"><Image src="/images/mAwSPmaX_400x400.jpg" alt="Kostas" width={128} height={128} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" /></div>
            <div className="p-8"><p className="text-sm font-bold text-blue-600 mb-2">PROJECT MAINTAINER</p><h2 className="text-2xl font-bold text-slate-900 mb-3">Kostas</h2><p className="text-slate-600 mb-6">Kostas is an EDR researcher and security practitioner focused on endpoint telemetry, threat hunting, detection engineering, malware analysis, and incident response. He leads Defendpoint Consulting&apos;s EDR advisory and research work and maintains the EDR Telemetry Project, coordinating testing, evidence review, methodology development, and community contributions.</p><div className="flex gap-4"><a href="https://twitter.com/kostastsale" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600"><Twitter className="w-4 h-4 mr-2" />@kostastsale</a><a href="https://www.linkedin.com/in/kostastsale/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</a></div></div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100"><h2 className="text-3xl font-bold text-slate-900 mb-4">Get Involved or Get in Touch</h2><p className="text-slate-600 max-w-3xl mx-auto mb-8">Have evidence to contribute, a correction to report, or a question about the project? Use the project contact and contribution channels. For client-specific EDR selection, deployment, validation, or advisory work, contact Defendpoint Consulting directly.</p><div className="flex flex-wrap justify-center gap-4"><Link href="/contact" className="px-6 py-3 bg-blue-600 !text-white rounded-xl font-semibold">Contact the Project</Link><Link href="/contribute" className="px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200">Contribute Evidence</Link><a href="https://defendpoint.ca/edr-services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200">Explore Defendpoint EDR Services<ExternalLink className="w-4 h-4 ml-2" /></a></div></div>
        </div>
      </section>
    </TemplatePage>
  )
}

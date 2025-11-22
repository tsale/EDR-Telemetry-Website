import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import Script from 'next/script'
import Head from 'next/head'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import { Target, TrendingUp, Building2, ExternalLink, Calendar, CheckCircle } from 'lucide-react'

export default function PremiumServices() {
  useHeadingLinks()

  useEffect(() => {
    // Initialize Cal.com after component mounts and script loads
    const initCal = () => {
      if (typeof window !== 'undefined' && window.Cal) {
        try {
          window.Cal("init", "edr-telemetry-discussion-call", {origin:"https://app.cal.com"});
          
          window.Cal.ns["edr-telemetry-discussion-call"]("inline", {
            elementOrSelector:"#my-cal-inline-edr-telemetry-discussion-call",
            config: {"layout":"month_view","theme":"auto"},
            calLink: "kostas-hcq78e/edr-telemetry-discussion-call",
          });
          
          window.Cal.ns["edr-telemetry-discussion-call"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
        } catch (error) {
          console.error('Cal.com initialization error:', error)
        }
      }
    }

    // Check repeatedly until Cal is loaded
    const checkAndInit = () => {
      if (window.Cal) {
        initCal()
      } else {
        setTimeout(checkAndInit, 100)
      }
    }

    checkAndInit()
  }, [])

  return (
    <TemplatePage
      title="Defendpoint Consulting Telemetry Services - EDR Telemetry Project"
      description="Independent telemetry benchmarking, advisory retainers, and enterprise enablement. We also provide vendor-neutral EDR selection and side-by-side comparisons via EDR-Comparison.com."
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Defendpoint Consulting - EDR Telemetry Services',
            url: (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/premium-services` : ''),
            provider: {
              '@type': 'Organization',
              name: 'Defendpoint Consulting',
              url: 'https://defendpoint.ca'
            },
            areaServed: 'Global',
            serviceType: 'EDR Telemetry Benchmarking and Advisory'
          }) }}
        />
      </Head>
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-20 pb-24 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
              Premium Services
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
              Premium Services by<br />
              <span className="text-blue-400">Defendpoint Consulting</span>
            </h1>
            
            <p className="mt-6 text-xl !text-slate-300 text-center leading-relaxed text-balance px-4">
              A streamlined set of benchmarking and advisory engagements powered by the EDR Telemetry and comparisons research programs.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://defendpoint.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Defendpoint Consulting
              </a>
              <Link href="#services" className="inline-flex items-center justify-center px-8 py-4 border border-slate-700 text-base font-bold rounded-xl !text-slate-200 hover:bg-slate-800 transition-all hover:border-slate-600">
                <Target className="w-5 h-5 mr-2" />
                View Engagements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Focused engagements, practical outcomes</h2>
            <p className="text-lg text-slate-600">
              We concentrated the most requested work into three modular engagements that keep your telemetry program moving.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* EDR Telemetry Benchmarking */}
            <article className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Telemetry Benchmarking & Gap Analysis</h3>
                <p className="text-slate-600 mb-6">
                  Vendor-neutral benchmarking tailored to your environment to validate coverage, depth, and data quality against real workloads.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Deployment & policy review mapped to MITRE ATT&CK</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Data quality validation (schema/fields) with practical fixes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Prioritized gap analysis report and remediation plan</span>
                  </li>
                </ul>
                <a
                  href="https://defendpoint.ca/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Discuss Benchmarking
                </a>
              </div>
            </article>

            {/* Premium Reporting & Advisory */}
            <article className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Executive Reporting & Advisory Retainers</h3>
                <p className="text-slate-600 mb-6">
                  Ongoing analyst support to align engineering and leadership on telemetry maturity and outcomes.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Quarterly maturity scorecards with tactic-level insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Audience-specific briefings for engineers and executives</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Working sessions and prioritized roadmap to drive outcomes</span>
                  </li>
                </ul>
                <a
                  href="https://defendpoint.ca/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Schedule a Briefing
                </a>
              </div>
            </article>

            {/* Enterprise Telemetry Programs */}
            <article className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Enterprise Telemetry Enablement</h3>
                <p className="text-slate-600 mb-6">
                  Structured, multi-team programs to operationalize telemetry across endpoints, servers, and cloud.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Readiness assessments across operating systems and workloads</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Detection engineering workshops aligned to MITRE ATT&amp;CK</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Implementation roadmaps and SIEM/EDR pipeline integration</span>
                  </li>
                </ul>
                <a
                  href="https://defendpoint.ca/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  Plan an Engagement
                </a>
              </div>
            </article>
          </div>

          {/* EDR-Comparison.com Callout */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">New</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Independent EDR Selection via EDR-Comparison.com</h3>
              <p className="text-slate-600 mb-6">
                Explore vendor-neutral side-by-side comparisons, feature matrices, analyst notes, and evaluation guidance to support confident platform selection.
              </p>
              <a
                href="https://edr-comparison.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Explore EDR-Comparison.com
              </a>
            </div>
          </div>

          {/* Consulting Redirect */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center shadow-xl border border-slate-800">
              <h3 className="text-2xl font-bold !text-white mb-4">Continue at Defendpoint Consulting</h3>
              <p className="!text-slate-300 mb-8 text-lg">
                Full engagement details, broader cybersecurity offerings, and contact options now live on the Defendpoint Consulting site.
              </p>
              <a
                href="https://defendpoint.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Go to Defendpoint Consulting
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Schedule a Consultation</h2>
            <p className="text-lg text-slate-600">
              Book a time to discuss your telemetry goals with Defendpoint Consulting.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-slate-200">
            <div className="w-full min-h-[720px]">
              <div
                className="w-full h-full overflow-scroll min-h-[720px]"
                id="my-cal-inline-edr-telemetry-discussion-call"
              ></div>
            </div>
            <p className="text-center mt-6 text-slate-600">
              If the calendar does not load, open the scheduling page directly at{' '}
              <a
                href="https://cal.com/kostas-hcq78e/edr-telemetry-discussion-call"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                cal.com/kostas-hcq78e/edr-telemetry-discussion-call
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Script id="cal-inline-embed-premium" strategy="lazyOnload">
        {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`}
      </Script>
    </TemplatePage>
  )
}

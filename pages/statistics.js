import TemplatePage from '../components/TemplatePage'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { BarChart3, ArrowRight, BookOpen, Scale, GitBranch } from 'lucide-react'
import { EDR_TELEMETRY_STATS_GITHUB_TREE } from '../lib/edrTelemetryStats'

const StatisticsDashboard = dynamic(() => import('../components/StatisticsDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-600 font-medium">Loading charts and summary data…</p>
      </div>
    </div>
  ),
})

export default function StatisticsPage() {
  return (
    <TemplatePage
      title="EDR Telemetry Statistics: Telemetry Visibility Change Trends"
      description="Historical statistics of EDR telemetry visibility changes across the vendor matrix — vendor improvement leaderboard, score trends, category deltas, and contribution breakdown. Data is loaded from the EDR-Telemetry repository."
    >
      {/* Hero — matches Scores / Methodology */}
      <section className="relative bg-slate-900 text-white py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/25 blur-[100px]"
            aria-hidden
          />
          <div
            className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"
            aria-hidden
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm">
            <BarChart3 className="w-4 h-4 mr-2 shrink-0" />
            Telemetry change statistics
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
            EDR Telemetry{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Statistics
            </span>
          </h1>

          <p className="text-xl !text-slate-300 max-w-3xl leading-relaxed text-center">
            Historical trends in <strong className="font-semibold text-slate-200">EDR Telemetry visibility</strong>{' '}
            across the vendor matrix: which vendors gained coverage, which categories moved, and how
            contributions landed. Rankings use weighted score deltas from accepted changes — not PR counts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#how-calculated"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl !text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              How we calculate
            </a>
            <a
              href="#vendor-leaderboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl !text-slate-200 font-bold transition-all hover:-translate-y-0.5"
            >
              View leaderboards
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14 space-y-10">
          <section
            id="how-calculated"
            className="scroll-mt-24 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" aria-hidden />
            <div className="p-6 sm:p-8 md:p-10">
              <div className="max-w-3xl mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  How these statistics are calculated
                </h2>
                <p className="text-slate-600 leading-relaxed mb-0">
                  Numbers below come from accepted changes in the{' '}
                  <a
                    href={EDR_TELEMETRY_STATS_GITHUB_TREE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                  >
                    EDR-Telemetry <code className="text-sm bg-slate-100 px-1.5 py-0.5 rounded">data/generated</code>
                  </a>{' '}
                  dataset on GitHub. The site does not recompute history; it visualizes the published summaries.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <GitBranch className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-0">Methodology</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    We measure telemetry changes in the vendor matrix: each accepted update to a vendor&rsquo;s
                    telemetry status is compared against the previous repository state, scored using the
                    project&rsquo;s published status model, weighted by the relevant telemetry feature weight,
                    and linked back to the commit or pull request that introduced it.
                  </p>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5 marker:text-blue-500">
                    <li>Leaderboards rank by <strong className="text-slate-800">net weighted score delta</strong>, not activity volume.</li>
                    <li>Baselines and zero-delta references are excluded from &ldquo;improvement&rdquo; charts.</li>
                    <li>Corrections and downgrades appear as negative deltas where applicable.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                      <Scale className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-0">What this does not measure</h3>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    These statistics describe changes in <strong>user-visible telemetry coverage</strong>. They do
                    not measure product quality, prevention capability, detection quality, alert quality, or managed
                    service performance. A higher score or positive delta means broader exposed telemetry, not a
                    &ldquo;better&rdquo; product.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-0">
                    New vendor baselines, new categories, renames, documentation-only changes, and corrections are
                    labeled separately so they do not inflate improvement metrics. For the evidence standard behind
                    status values, see the{' '}
                    <Link href="/methodology" className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
                      methodology page
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          <StatisticsDashboard />
        </div>
      </div>
    </TemplatePage>
  )
}
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Activity,
  GitCommit,
  GitPullRequest,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info,
  Users,
  RefreshCw,
  ExternalLink,
  Filter,
} from 'lucide-react'
import PlatformSelector from './PlatformSelector'
import styles from '../styles/statistics.module.css'
import {
  EDR_TELEMETRY_STATS_GITHUB_TREE,
  STATS_DASHBOARD_FILES,
  edrTelemetryStatsJsonUrl,
} from '../lib/edrTelemetryStats'

// Register Chart.js primitives once. This component is loaded client-side only
// (dynamic import with ssr:false from pages/statistics.js), so canvas/window
// access is safe.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

/* ----------------------------------------------------------------------------
 * Palette + shared chart styling (matches the slate/blue visual language used
 * on the scores page: quiet cards, slate gridlines, blue accents).
 * ------------------------------------------------------------------------- */
const BLUE = '#2563eb'
const EMERALD = '#059669'
const RED = '#dc2626'
const SLATE = '#64748b'
const AMBER = '#d97706'
const INDIGO = '#4f46e5'
const PALETTE = [
  '#2563eb', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899',
  '#f59e0b', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
  '#a855f7', '#ef4444', '#f97316', '#84cc16', '#22c55e',
  '#0891b2', '#7c3aed', '#db2777', '#ca8a04', '#0d9488',
]
const GRID = 'rgba(148, 163, 184, 0.18)'
const TICK = '#64748b'
const FONT = { family: 'inherit', size: 12 }

const baseScales = {
  x: { grid: { color: GRID }, ticks: { color: TICK, font: FONT }, border: { color: GRID } },
  y: { grid: { color: GRID }, ticks: { color: TICK, font: FONT }, border: { color: GRID } },
}

/* ----------------------------------------------------------------------------
 * Pure transformation helpers (also reusable / testable in isolation).
 * ------------------------------------------------------------------------- */
export function topVendorsByNetDelta(vendorSummary, limit = 15) {
  if (!Array.isArray(vendorSummary)) return []
  return [...vendorSummary]
    .sort((a, b) => (b.net_weighted_score_delta || 0) - (a.net_weighted_score_delta || 0))
    .slice(0, limit)
}

export function scoresForPlatform(currentScores, platform) {
  if (!Array.isArray(currentScores)) return []
  return currentScores
    .filter((s) => s.platform === platform)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
}

export function timeseriesForVendor(timeseries, vendorId, platform) {
  if (!Array.isArray(timeseries) || !vendorId || !platform) return []
  const entry = timeseries.find(
    (t) => t.vendor_canonical_id === vendorId && t.platform === platform
  )
  if (!entry || !Array.isArray(entry.points)) return []
  // Collapse multiple events on the same date: keep the highest cumulative
  // score reached that day and sum the per-point deltas into a single day delta.
  const byDate = new Map()
  for (const p of entry.points) {
    const d = p.date
    const prev = byDate.get(d)
    if (!prev) {
      byDate.set(d, { date: d, score: p.score ?? 0, delta: p.score_delta || 0 })
    } else {
      prev.score = Math.max(prev.score, p.score ?? 0)
      prev.delta += p.score_delta || 0
    }
  }
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function topCategoriesByDelta(categorySummary, limit = 15) {
  if (!Array.isArray(categorySummary)) return []
  return [...categorySummary]
    .filter((c) => (c.total_weighted_score_delta || 0) > 0)
    .sort((a, b) => (b.total_weighted_score_delta || 0) - (a.total_weighted_score_delta || 0))
    .slice(0, limit)
}

export function manualReviewCounts(manualReviewItems) {
  if (!Array.isArray(manualReviewItems)) return []
  const counts = new Map()
  for (const item of manualReviewItems) {
    const reason = item.reason || 'unspecified'
    counts.set(reason, (counts.get(reason) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
}

/* ----------------------------------------------------------------------------
 * Small formatting + utility helpers.
 * ------------------------------------------------------------------------- */
const fmt = (n) => {
  const v = Number(n || 0)
  return Number.isInteger(v) ? String(v) : v.toFixed(2)
}
const truncate = (s, n = 26) =>
  !s ? '' : s.length <= n ? s : s.slice(0, n - 1) + '\u2026'
const shortSha = (sha) => (sha ? sha.slice(0, 7) : '')
const fmtDate = (iso) => {
  if (!iso) return '\u2014'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC'
}
/* ----------------------------------------------------------------------------
 * Remote data manifest (EDR-Telemetry repo). Only summary files on initial load.
 * telemetry_change_events.jsonl is drilldown-only and never loaded here.
 * ------------------------------------------------------------------------- */
const INITIAL_FILES = STATS_DASHBOARD_FILES.map(([label, filename]) => [
  label,
  edrTelemetryStatsJsonUrl(filename),
])

async function fetchJson(label, url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status} for ${url}`)
  return res.json()
}

/* ----------------------------------------------------------------------------
 * Presentational building blocks.
 * ------------------------------------------------------------------------- */
function SectionCard({ id, title, subtitle, icon: Icon, action, children }) {
  return (
    <section id={id} className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 border border-slate-200 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1 leading-snug max-w-2xl">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function ChartFrame({ height, children }) {
  return (
    <div className={styles.chartFrame} style={{ height }}>
      {children}
    </div>
  )
}

function DeltaBadge({ value }) {
  const v = Number(value || 0)
  if (v > 0) return <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><TrendingUp className="h-3.5 w-3.5" />+{fmt(v)}</span>
  if (v < 0) return <span className="inline-flex items-center gap-1 font-semibold text-red-700"><TrendingDown className="h-3.5 w-3.5" />{fmt(v)}</span>
  return <span className="text-slate-400 font-medium">{fmt(v)}</span>
}

function StatCard({ icon: Icon, label, value, sub, accent = 'blue' }) {
  const accents = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</div>
          <div className="text-2xl font-bold text-slate-900 leading-tight truncate">{value}</div>
        </div>
      </div>
      {sub && <div className="mt-2 text-xs text-slate-500 leading-snug">{sub}</div>}
    </div>
  )
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="inline-flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
      >
        {children}
      </select>
    </label>
  )
}

function EmptyNote({ children }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
      {children}
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Main dashboard component.
 * ------------------------------------------------------------------------- */
export default function StatisticsDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Section 3 + 4 control state.
  const [scorePlatform, setScorePlatform] = useState('windows')
  const [tsPlatform, setTsPlatform] = useState('windows')
  const [tsVendor, setTsVendor] = useState(null)

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.all(
        INITIAL_FILES.map(([label, url]) => fetchJson(label, url))
      )
      const next = {}
      INITIAL_FILES.forEach(([label], i) => { next[label] = results[i] })
      setData(next)
      // Default the time-series vendor to the top Windows vendor by current score.
      const topWin = scoresForPlatform(next.currentVendorScores, 'windows')[0]
      if (topWin) setTsVendor((prev) => prev || topWin.vendor_canonical_id)
    } catch (e) {
      setError(e.message || 'Failed to load statistics data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  /* ----- Derived datasets (memoized) ----- */
  const runMeta = data?.runMetadata
  const overview = useMemo(() => {
    if (!data) return null
    return {
      totalChangeEvents: runMeta?.total_change_events ?? 0,
      commitsScanned: runMeta?.total_commits_scanned ?? 0,
      prsScanned: runMeta?.total_prs_scanned ?? 0,
      prSummaryCount: Array.isArray(data.prSummary) ? data.prSummary.length : 0,
      directCommitCount: Array.isArray(data.directCommitSummary) ? data.directCommitSummary.length : 0,
      vendorCount: Array.isArray(data.vendorChangeSummary) ? data.vendorChangeSummary.length : 0,
      generatedAt: runMeta?.generated_at_utc,
      headCommit: runMeta?.head_commit,
      repository: runMeta?.repository,
    }
  }, [data, runMeta])

  const vendorLeaders = useMemo(
    () => topVendorsByNetDelta(data?.vendorChangeSummary, 50),
    [data]
  )

  const platformScores = useMemo(
    () => scoresForPlatform(data?.currentVendorScores, scorePlatform),
    [data, scorePlatform]
  )

  const tsVendors = useMemo(() => {
    if (!data?.vendorScoreTimeseries) return []
    return [...new Set(
      data.vendorScoreTimeseries
        .filter((t) => t.platform === tsPlatform)
        .map((t) => t.vendor_canonical_id)
    )]
  }, [data, tsPlatform])

  const effectiveTsVendor = useMemo(() => {
    if (tsVendors.length === 0) return null
    return tsVendors.includes(tsVendor) ? tsVendor : tsVendors[0]
  }, [tsVendors, tsVendor])

  const tsEntry = useMemo(() => {
    if (!data?.vendorScoreTimeseries) return null
    return data.vendorScoreTimeseries.find(
      (t) => t.vendor_canonical_id === effectiveTsVendor && t.platform === tsPlatform
    )
  }, [data, effectiveTsVendor, tsPlatform])

  const tsPoints = useMemo(
    () => timeseriesForVendor(data?.vendorScoreTimeseries, effectiveTsVendor, tsPlatform),
    [data, effectiveTsVendor, tsPlatform]
  )

  const topCategories = useMemo(
    () => topCategoriesByDelta(data?.categoryChangeSummary, 15),
    [data]
  )

  const contribution = useMemo(() => {
    const scoreBearing = (arr) => (arr || []).filter((x) => Number(x.score_delta || 0) !== 0)
    const sumDelta = (arr) => arr.reduce((a, x) => a + Number(x.score_delta || 0), 0)
    const prSb = scoreBearing(data?.prSummary)
    const dcSb = scoreBearing(data?.directCommitSummary)
    return {
      pr: { all: (data?.prSummary || []).length, sb: prSb.length, delta: sumDelta(prSb) },
      dc: { all: (data?.directCommitSummary || []).length, sb: dcSb.length, delta: sumDelta(dcSb) },
    }
  }, [data])

  const topContributors = useMemo(() => {
    if (!data?.contributorSummary) return []
    return [...data.contributorSummary]
      .sort((a, b) => (b.positive_score_delta || 0) - (a.positive_score_delta || 0))
      .slice(0, 6)
  }, [data])

  /* ----- Error / loading states ----- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="mt-4 text-slate-600 font-medium">Loading statistics…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-600 mb-2">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-lg font-bold">Unable to load statistics</h3>
          </div>
          <p className="text-red-700 text-sm break-words">{error}</p>
          <p className="text-red-600/80 text-xs mt-2">
            The dashboard loads summary JSON from the{' '}
            <a
              href={EDR_TELEMETRY_STATS_GITHUB_TREE}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              EDR-Telemetry <code>data/generated</code>
            </a>{' '}
            folder on GitHub. Check your network connection or try again after the generator publishes new files.
          </p>
          <button
            onClick={loadInitial}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  /* ----- Chart datasets ----- */
  const leaderChart = {
    labels: vendorLeaders.map((v) => truncate(v.vendor_display_name, 24)),
    datasets: [
      {
        label: 'Net weighted score delta',
        data: vendorLeaders.map((v) => v.net_weighted_score_delta || 0),
        backgroundColor: vendorLeaders.map((v) =>
          (v.net_weighted_score_delta || 0) > 0 ? EMERALD : (v.net_weighted_score_delta || 0) < 0 ? RED : SLATE
        ),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const scoreChart = {
    labels: platformScores.map((s) => truncate(s.vendor_display_name, 22)),
    datasets: [
      {
        label: 'Current score',
        data: platformScores.map((s) => s.score || 0),
        backgroundColor: platformScores.map((_, i) => (i === 0 ? EMERALD : i === 1 ? BLUE : i === 2 ? INDIGO : PALETTE[i % PALETTE.length])),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const tsChart = {
    labels: tsPoints.map((p) => p.date),
    datasets: [
      {
        label: 'Cumulative score',
        data: tsPoints.map((p) => p.score),
        borderColor: BLUE,
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        fill: true,
        tension: 0.2,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  }

  const categoryChart = {
    labels: topCategories.map((c) => truncate(c.sub_category, 30)),
    datasets: [
      {
        label: 'Weighted score delta',
        data: topCategories.map((c) => c.total_weighted_score_delta || 0),
        backgroundColor: EMERALD,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const contribTotal = contribution.pr.delta + contribution.dc.delta
  const contribChart = {
    labels: ['Pull requests', 'Direct commits'],
    datasets: [
      {
        data: contribTotal > 0
          ? [contribution.pr.delta, contribution.dc.delta]
          : [contribution.pr.sb, contribution.dc.sb],
        backgroundColor: [BLUE, AMBER],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  }

  const leaderHeight = Math.max(360, vendorLeaders.length * 26)
  const categoryHeight = Math.max(360, topCategories.length * 28)

  return (
    <div className="space-y-8">

        {/* 1. Overview cards */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={Activity} accent="blue" label="Change events" value={fmt(overview.totalChangeEvents)} sub="Accepted telemetry status changes scanned across history" />
            <StatCard icon={GitCommit} accent="slate" label="Commits scanned" value={fmt(overview.commitsScanned)} sub={`Across ${overview.repository || 'tsale/EDR-Telemetry'}`} />
            <StatCard icon={GitPullRequest} accent="indigo" label="PR summaries" value={fmt(overview.prSummaryCount)} sub={`${overview.prsScanned} PRs scanned in total`} />
            <StatCard icon={GitCommit} accent="emerald" label="Direct commit summaries" value={fmt(overview.directCommitCount)} sub="Commits not associated with a pull request" />
            <StatCard icon={Users} accent="amber" label="Vendors tracked" value={fmt(overview.vendorCount)} sub="Vendors with accepted telemetry changes in history" />
            <StatCard
              icon={Clock}
              accent="red"
              label="Generated"
              value={overview.generatedAt ? fmtDate(overview.generatedAt) : '—'}
              sub={overview.headCommit ? `Head commit ${shortSha(overview.headCommit)}` : ''}
            />
          </div>
        </section>

        {/* 2. Vendor improvement leaderboard */}
        <SectionCard
          id="vendor-leaderboard"
          title="Vendor improvement leaderboard"
          subtitle="Net weighted score delta per vendor across all accepted history. Positive deltas are improvements in exposed telemetry; negative deltas are corrections or downgrades. Zero means net-neutral."
          icon={TrendingUp}
        >
          {vendorLeaders.length === 0 ? (
            <EmptyNote>No vendor change summary data available.</EmptyNote>
          ) : (
            <>
              <ChartFrame height={leaderHeight}>
                <Bar
                  data={leaderChart}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          title: (items) => {
                            const v = vendorLeaders[items[0].dataIndex]
                            return v ? v.vendor_display_name : items[0].label
                          },
                          label: (ctx) => 'Net delta: ' + fmt(ctx.parsed.x),
                          afterLabel: (ctx) => {
                            const v = vendorLeaders[ctx.dataIndex]
                            if (!v) return ''
                            return [
                              'Positive: +' + fmt(v.positive_weighted_score_delta),
                              'Negative: ' + fmt(v.negative_weighted_score_delta),
                              'Categories touched: ' + v.number_of_categories_touched,
                            ]
                          },
                        },
                      },
                    },
                    scales: {
                      x: { ...baseScales.x, title: { display: true, text: 'Net weighted score delta', color: TICK, font: FONT } },
                      y: { ...baseScales.y, ticks: { ...baseScales.y.ticks, autoSkip: false } },
                    },
                  }}
                />
              </ChartFrame>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Vendor</th>
                      <th className="px-3 py-2 text-right font-semibold">Positive</th>
                      <th className="px-3 py-2 text-right font-semibold">Negative</th>
                      <th className="px-3 py-2 text-right font-semibold">Net</th>
                      <th className="px-3 py-2 text-right font-semibold">Changes</th>
                      <th className="hidden sm:table-cell px-3 py-2 text-right font-semibold">PRs</th>
                      <th className="hidden sm:table-cell px-3 py-2 text-right font-semibold">Direct</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendorLeaders.slice(0, 15).map((v) => (
                      <tr key={v.vendor_canonical_id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-medium text-slate-800">{v.vendor_display_name}</td>
                        <td className="px-3 py-2 text-right text-emerald-700">+{fmt(v.positive_weighted_score_delta)}</td>
                        <td className="px-3 py-2 text-right text-red-700">{fmt(v.negative_weighted_score_delta)}</td>
                        <td className="px-3 py-2 text-right"><DeltaBadge value={v.net_weighted_score_delta} /></td>
                        <td className="px-3 py-2 text-right text-slate-600">{v.total_accepted_changed_telemetry_cells}</td>
                        <td className="hidden sm:table-cell px-3 py-2 text-right text-slate-600">{v.number_of_prs_affecting_vendor}</td>
                        <td className="hidden sm:table-cell px-3 py-2 text-right text-slate-600">{v.number_of_direct_commits_affecting_vendor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </SectionCard>

        {/* 3. Current vendor score chart */}
        <SectionCard
          id="current-scores"
          title="Current vendor scores"
          subtitle="Current weighted telemetry-visibility score per vendor for the selected platform. This is the same score shown on the Scores page."
          icon={BarChart3}
          action={<PlatformSelector value={scorePlatform} onChange={setScorePlatform} className="!justify-end" />}
        >
          {platformScores.length === 0 ? (
            <EmptyNote>No current score data for {scorePlatform}.</EmptyNote>
          ) : (
            <ChartFrame height={400}>
              <Bar
                data={scoreChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => 'Score: ' + fmt(ctx.parsed.y),
                      },
                    },
                  },
                  scales: {
                    x: { ...baseScales.x, ticks: { ...baseScales.x.ticks, maxRotation: 45, minRotation: 0, autoSkip: false } },
                    y: { ...baseScales.y, beginAtZero: true, title: { display: true, text: 'Weighted score', color: TICK, font: FONT } },
                  },
                }}
              />
            </ChartFrame>
          )}
        </SectionCard>

        {/* 4. Vendor score over time */}
        <SectionCard
          id="score-over-time"
          title="Vendor score over time"
          subtitle="Cumulative weighted score for a single vendor and platform, plotted over accepted change history. Tooltips show the day's net delta."
          icon={Activity}
          action={
            <div className="flex flex-wrap gap-3">
              <Select label="Vendor" value={effectiveTsVendor || ''} onChange={setTsVendor}>
                {tsVendors.map((id) => {
                  const t = data.vendorScoreTimeseries.find((x) => x.vendor_canonical_id === id && x.platform === tsPlatform)
                  return <option key={id} value={id}>{t ? t.vendor_display_name : id}</option>
                })}
              </Select>
              <Select label="Platform" value={tsPlatform} onChange={setTsPlatform}>
                <option value="windows">Windows</option>
                <option value="linux">Linux</option>
                <option value="macos">macOS</option>
              </Select>
            </div>
          }
        >
          {tsPoints.length === 0 ? (
            <EmptyNote>
              No time-series points for {tsEntry ? tsEntry.vendor_display_name : 'this vendor'} on {tsPlatform}.
            </EmptyNote>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{tsEntry?.vendor_display_name}</span>
                <span className="text-slate-400">·</span>
                <span className="capitalize">{tsPlatform}</span>
                <span className="text-slate-400">·</span>
                <span>{tsPoints.length} dated points</span>
                <span className="text-slate-400">·</span>
                <span>Latest: <strong className="text-slate-800">{fmt(tsPoints[tsPoints.length - 1].score)}</strong></span>
              </div>
              <ChartFrame height={360}>
                <Line
                  data={tsChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          title: (items) => items[0].label,
                          label: (ctx) => 'Cumulative score: ' + fmt(ctx.parsed.y),
                          afterLabel: (ctx) => {
                            const p = tsPoints[ctx.dataIndex]
                            return p ? 'Day delta: ' + (p.delta > 0 ? '+' : '') + fmt(p.delta) : ''
                          },
                        },
                      },
                    },
                    scales: {
                      x: { ...baseScales.x, ticks: { ...baseScales.x.ticks, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
                      y: { ...baseScales.y, beginAtZero: true, title: { display: true, text: 'Cumulative weighted score', color: TICK, font: FONT } },
                    },
                  }}
                />
              </ChartFrame>
              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                The cumulative line is built from accepted change events only. Many same-day points
                (for example initial category baselines) are collapsed into a single dated point; the
                day delta reflects the net score change for that date. Baseline events carry a delta of 0
                and are not counted as improvements.
              </p>
            </>
          )}
        </SectionCard>

        {/* 5. Category improvement histogram */}
        <SectionCard
          id="category-improvements"
          title="Category improvement"
          subtitle="Top categories by total weighted score delta. Only categories with a positive delta are shown — baseline categories (delta = 0) are references, not improvements, and are excluded."
          icon={TrendingUp}
        >
          {topCategories.length === 0 ? (
            <EmptyNote>No category improvement data available.</EmptyNote>
          ) : (
            <>
              <ChartFrame height={categoryHeight}>
                <Bar
                  data={categoryChart}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          title: (items) => {
                            const c = topCategories[items[0].dataIndex]
                            return c ? c.sub_category : items[0].label
                          },
                          label: (ctx) => 'Weighted delta: ' + fmt(ctx.parsed.x),
                          afterLabel: (ctx) => {
                            const c = topCategories[ctx.dataIndex]
                            if (!c) return ''
                            return [
                              'Category: ' + c.telemetry_feature_category,
                              'Improvements: ' + c.number_of_improvements,
                              'Platforms: ' + (c.platforms_affected || []).join(', '),
                              'Vendors affected: ' + (c.vendors_affected || []).length,
                            ]
                          },
                        },
                      },
                    },
                    scales: {
                      x: { ...baseScales.x, title: { display: true, text: 'Total weighted score delta', color: TICK, font: FONT } },
                      y: { ...baseScales.y, ticks: { ...baseScales.y.ticks, autoSkip: false } },
                    },
                  }}
                />
              </ChartFrame>
            </>
          )}
        </SectionCard>

        {/* 6. Contribution source breakdown */}
        <SectionCard
          id="contributions"
          title="Contribution source breakdown"
          subtitle="Accepted score-bearing changes from pull requests versus direct commits. Score-bearing means the change carried a non-zero score delta."
          icon={Users}
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center">
              {contribution.pr.sb === 0 && contribution.dc.sb === 0 ? (
                <EmptyNote>No score-bearing contributions to chart.</EmptyNote>
              ) : (
                <>
                  <ChartFrame height={260}>
                    <Doughnut
                      data={contribChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '62%',
                        plugins: {
                          legend: { position: 'bottom', labels: { color: '#334155', font: FONT, padding: 14 } },
                          tooltip: {
                            callbacks: {
                              label: (ctx) =>
                                (contribTotal > 0 ? 'Score delta: ' : 'Count: ') + fmt(ctx.parsed) +
                                ' (' + ctx.label + ')',
                            },
                          },
                        },
                      }}
                    />
                  </ChartFrame>
                  <p className="mt-1 text-xs text-slate-400">
                    {contribTotal > 0 ? 'Share of total positive score delta' : 'Share of score-bearing change count'}
                  </p>
                </>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Source</th>
                    <th className="px-3 py-2 text-right font-semibold">Score-bearing</th>
                    <th className="px-3 py-2 text-right font-semibold">Net delta</th>
                    <th className="hidden sm:table-cell px-3 py-2 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-800">Pull requests</td>
                    <td className="px-3 py-2 text-right text-slate-700">{contribution.pr.sb}</td>
                    <td className="px-3 py-2 text-right"><DeltaBadge value={contribution.pr.delta} /></td>
                    <td className="hidden sm:table-cell px-3 py-2 text-right text-slate-400">{contribution.pr.all}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-800">Direct commits</td>
                    <td className="px-3 py-2 text-right text-slate-700">{contribution.dc.sb}</td>
                    <td className="px-3 py-2 text-right"><DeltaBadge value={contribution.dc.delta} /></td>
                    <td className="hidden sm:table-cell px-3 py-2 text-right text-slate-400">{contribution.dc.all}</td>
                  </tr>
                </tbody>
              </table>

              {topContributors.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-2 text-slate-700">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <h4 className="text-sm font-bold">Top contributors by positive score delta</h4>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Contributor</th>
                        <th className="px-3 py-2 text-left font-semibold">Class</th>
                        <th className="px-3 py-2 text-right font-semibold">+Delta</th>
                        <th className="hidden sm:table-cell px-3 py-2 text-right font-semibold">PRs</th>
                        <th className="hidden sm:table-cell px-3 py-2 text-right font-semibold">Changes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topContributors.map((c) => (
                        <tr key={c.contributor_login} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-slate-800">{c.contributor_login || '—'}</td>
                          <td className="px-3 py-2 text-slate-500 text-xs">{c.contributor_class?.replace(/_/g, ' ') || '—'}</td>
                          <td className="px-3 py-2 text-right text-emerald-700">+{fmt(c.positive_score_delta)}</td>
                          <td className="hidden sm:table-cell px-3 py-2 text-right text-slate-600">{c.merged_prs}</td>
                          <td className="hidden sm:table-cell px-3 py-2 text-right text-slate-600">{c.changed_telemetry_cells}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Data source footer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" />
              <span>
                Summary JSON is loaded from the{' '}
                <a
                  href={EDR_TELEMETRY_STATS_GITHUB_TREE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  EDR-Telemetry <code className="text-slate-600">data/generated</code>
                </a>{' '}
                directory on GitHub (<code className="text-slate-600">main</code> branch).
              </span>
            </div>
            <a
              href={edrTelemetryStatsJsonUrl('run_metadata.json')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              Run metadata <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Per-event detail (<code>telemetry_change_events.jsonl</code>) lives in the same GitHub folder and is not loaded by this dashboard.
          </p>
        </div>
    </div>
  )
}

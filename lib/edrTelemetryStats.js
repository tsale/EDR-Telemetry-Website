/**
 * Generated statistics published in the EDR-Telemetry repo (not copied into this website).
 * @see https://github.com/tsale/EDR-Telemetry/tree/main/data/generated
 */

export const EDR_TELEMETRY_STATS_GITHUB_TREE =
  'https://github.com/tsale/EDR-Telemetry/tree/main/data/generated'

/** Override for previews or forks: NEXT_PUBLIC_EDR_TELEMETRY_STATS_RAW_BASE */
export const EDR_TELEMETRY_STATS_RAW_BASE = (
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_EDR_TELEMETRY_STATS_RAW_BASE
    ? process.env.NEXT_PUBLIC_EDR_TELEMETRY_STATS_RAW_BASE
    : 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/data/generated'
).replace(/\/?$/, '/')

export function edrTelemetryStatsJsonUrl(filename) {
  return `${EDR_TELEMETRY_STATS_RAW_BASE}${filename}`
}

/** Summary JSON files loaded by /statistics on initial page load. */
export const STATS_DASHBOARD_FILES = [
  ['runMetadata', 'run_metadata.json'],
  ['vendorChangeSummary', 'vendor_change_summary.json'],
  ['categoryChangeSummary', 'category_change_summary.json'],
  ['currentVendorScores', 'current_vendor_scores.json'],
  ['vendorScoreTimeseries', 'vendor_score_timeseries.json'],
  ['contributorSummary', 'contributor_summary.json'],
  ['prSummary', 'pr_summary.json'],
  ['directCommitSummary', 'direct_commit_summary.json'],
]
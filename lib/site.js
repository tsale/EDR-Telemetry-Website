function normalizeOrigin(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

export const SITE_URL = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.edr-telemetry.com'
)

/**
 * Normalize a path for canonical/sitemap use:
 * - strip query and hash
 * - remove trailing slash (except root)
 * - ensure a leading slash for non-empty paths
 */
export function normalizeSitePath(path = '/') {
  if (!path) return '/'

  let normalized = String(path).split('#')[0].split('?')[0].trim()
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized || '/'
}

export function absoluteUrl(path = '/') {
  const normalized = normalizeSitePath(path)
  return normalized === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalized}`
}

import { getSortedPostsData } from '../lib/blog'
import { absoluteUrl } from '../lib/site'

export async function getServerSideProps({ res }) {
  const staticPages = [
    '/',
    '/about',
    '/blog',
    '/contact',
    '/contribute',
    '/eligibility',
    '/faq',
    '/linux',
    '/macos',
    '/methodology',
    '/mitre-mappings',
    '/premium-services',
    '/roadmap',
    '/scores',
    '/sponsorship',
    '/statistics',
    '/telemetry-categories',
    '/windows',
  ]

  const blogPages = getSortedPostsData().map((post) => `/blog/${post.id}`)

  const urls = [...staticPages, ...blogPages]
    .map((path) => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`)
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function SiteMap() {
  return null
}

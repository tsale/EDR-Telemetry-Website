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

  const blogPages = getSortedPostsData().map((post) => ({
    path: `/blog/${post.id}`,
    lastmod: post.date || null,
  }))

  const urls = [
    ...staticPages.map((path) => ({ path, lastmod: null })),
    ...blogPages,
  ]
    .map(({ path, lastmod }) => {
      const loc = absoluteUrl(path)
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
      return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n    <changefreq>weekly</changefreq>\n    <priority>${path === '/' ? '1.0' : path.startsWith('/blog/') ? '0.6' : '0.7'}</priority>\n  </url>`
    })
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

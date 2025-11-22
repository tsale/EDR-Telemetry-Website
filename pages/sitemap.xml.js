export async function getServerSideProps({ res }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const pages = [
    '/',
    '/about',
    '/blog',
    '/contact',
    '/contribute',
    '/eligibility',
    '/faq',
    '/linux',
    '/macos',
    '/mitre-mappings',
    '/premium-services',
    '/roadmap',
    '/scores',
    '/sponsorship',
    '/telemetry-categories',
    '/windows',
  ]

  const urls = pages
    .filter(Boolean)
    .map((path) => {
      const loc = siteUrl ? `${siteUrl}${path}` : path
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.7'}</priority>\n  </url>`
    })
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function SiteMap() {
  return null
}


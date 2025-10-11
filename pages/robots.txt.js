export async function getServerSideProps({ res }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const lines = [
    'User-agent: *',
    'Disallow:',
    siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml` : ''
  ].filter(Boolean)

  res.setHeader('Content-Type', 'text/plain')
  res.write(lines.join('\n'))
  res.end()

  return { props: {} }
}

export default function Robots() {
  return null
}


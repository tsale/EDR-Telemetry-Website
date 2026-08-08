import { absoluteUrl } from '../lib/site'

export async function getServerSideProps({ res }) {
  const lines = [
    'User-agent: *',
    'Disallow:',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
  ]

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(lines.join('\n'))
  res.end()

  return { props: {} }
}

export default function Robots() {
  return null
}

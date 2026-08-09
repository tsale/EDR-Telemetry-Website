/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com'
      }
    ]
  },
  async redirects() {
    return [
      // Legacy static-site .html URLs (pre-Next.js migration)
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/contribute.html', destination: '/contribute', permanent: true },
      { source: '/eligibility.html', destination: '/eligibility', permanent: true },
      { source: '/faq.html', destination: '/faq', permanent: true },
      { source: '/linux.html', destination: '/linux', permanent: true },
      { source: '/macos.html', destination: '/macos', permanent: true },
      { source: '/roadmap', destination: '/about', permanent: true },
      { source: '/roadmap.html', destination: '/about', permanent: true },
      { source: '/scores.html', destination: '/scores', permanent: true },
      { source: '/sponsorship', destination: '/support', permanent: true },
      { source: '/sponsorship.html', destination: '/support', permanent: true },
      { source: '/support.html', destination: '/support', permanent: true },
      { source: '/windows.html', destination: '/windows', permanent: true },
      // Legacy underscore paths from early static pages
      { source: '/premium_services', destination: '/premium-services', permanent: true },
      { source: '/premium_services.html', destination: '/premium-services', permanent: true },
      { source: '/mitre_mappings', destination: '/mitre-mappings', permanent: true },
      { source: '/mitre_mappings.html', destination: '/mitre-mappings', permanent: true },
      { source: '/telemetry_categories', destination: '/telemetry-categories', permanent: true },
      { source: '/telemetry_categories.html', destination: '/telemetry-categories', permanent: true },
      { source: '/telemetry-categories.html', destination: '/telemetry-categories', permanent: true },
      { source: '/premium-services.html', destination: '/premium-services', permanent: true },
      { source: '/mitre-mappings.html', destination: '/mitre-mappings', permanent: true },
      { source: '/methodology.html', destination: '/methodology', permanent: true },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://js.stripe.com 
                https://*.stripe.com
                https://www.googletagmanager.com 
                https://vercel.live 
                https://www.google-analytics.com
                https://*.vercel.live
                https://assets.calendly.com
                https://app.cal.com
                https://cal.com
                https://embed.cal.com
                https://*.cal.com
                https://formnx.com;
              style-src 'self' 'unsafe-inline' data: 
                https://fonts.googleapis.com
                https://assets.calendly.com
                https://app.cal.com
                https://cal.com
                https://*.cal.com;
              font-src * data: blob: 'unsafe-inline';
              img-src 'self' data: https: blob:;
              frame-src 'self' 
                https://js.stripe.com 
                https://*.stripe.com
                https://hooks.stripe.com 
                https://www.google.com
                https://vercel.live
                https://*.vercel.live
                https://calendly.com
                https://*.calendly.com
                https://app.cal.com
                https://cal.com
                https://embed.cal.com
                https://*.cal.com
                https://fill.formnx.com;
              connect-src 'self' 
                https://api.stripe.com 
                https://js.stripe.com 
                https://www.google-analytics.com
                https://vercel.live
                https://*.vercel.live
                https://app.cal.com
                https://cal.com
                https://embed.cal.com
                https://api.cal.com
                https://*.cal.com
                https://raw.githubusercontent.com;
              media-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              manifest-src 'self';
              worker-src 'self' blob:;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

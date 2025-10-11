/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
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

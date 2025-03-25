/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
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
                https://formnx.com;
              style-src 'self' 'unsafe-inline' data: 
                https://fonts.googleapis.com
                https://assets.calendly.com;
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
                https://fill.formnx.com;
              connect-src 'self' 
                https://api.stripe.com 
                https://js.stripe.com 
                https://www.google-analytics.com
                https://vercel.live
                https://*.vercel.live
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
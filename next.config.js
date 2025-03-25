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
                https://www.googletagmanager.com 
                https://vercel.live 
                https://www.google-analytics.com
                https://*.vercel.live;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' data: https://fonts.gstatic.com;
              img-src 'self' data: https:;
              frame-src 'self' 
                https://js.stripe.com 
                https://hooks.stripe.com 
                https://www.google.com
                https://vercel.live
                https://*.vercel.live;
              connect-src 'self' 
                https://api.stripe.com 
                https://js.stripe.com 
                https://www.google-analytics.com
                https://vercel.live
                https://*.vercel.live
                https://raw.githubusercontent.com;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 
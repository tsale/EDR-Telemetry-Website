import '../styles/globals.css'
import '../styles/windows.css'
import '../styles/linux.css'
import '../styles/macos.css'
import '../styles/about.css'
import '../styles/contact.css'
import '../styles/roadmap.css'
import '../styles/heading-links.css'
import '../styles/styles.css'
import '../styles/table-improvements.css'
import '../styles/sponsorship.css'
import '../styles/contributors.css'
import '../styles/premium-services.css'
import '../styles/scores.css'
import '../styles/mitre-mappings.css'
import '../styles/sponsorship.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Track page views when route changes
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: url,
          page_title: document.title,
          page_location: window.location.href
        })
      }
    }

    // Track initial page load
    if (typeof window !== 'undefined' && window.gtag) {
      handleRouteChange(window.location.pathname)
    }

    // Track route changes
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Track user engagement
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const trackEngagement = () => {
      if (window.gtag) {
        // Track scroll depth
        const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100)
        if (scrollDepth === 25 || scrollDepth === 50 || scrollDepth === 75 || scrollDepth === 100) {
          window.gtag('event', 'scroll_depth', {
            depth: scrollDepth,
            page_path: window.location.pathname
          })
        }

        // Track time spent
        if (window.pageLoadTime) {
          window.gtag('event', 'time_spent', {
            page_path: window.location.pathname,
            time_seconds: Math.round((new Date() - window.pageLoadTime) / 1000)
          })
        }
      }
    }

    // Set initial page load time
    window.pageLoadTime = new Date()

    // Add scroll listener
    window.addEventListener('scroll', trackEngagement)
    // Track engagement every 30 seconds
    const interval = setInterval(trackEngagement, 30000)

    return () => {
      window.removeEventListener('scroll', trackEngagement)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-WSE4W22ZYG"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WSE4W22ZYG', {
              page_path: window.location.pathname,
              user_properties: {
                first_visit_date: new Date().toISOString(),
                referrer: document.referrer || 'direct',
                screen_resolution: typeof window !== 'undefined' ? window.screen.width + 'x' + window.screen.height : '',
                language: typeof window !== 'undefined' ? navigator.language || navigator.userLanguage : ''
              }
            });

            if (typeof window !== 'undefined') {
              // Track outbound links
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.hostname !== window.location.hostname) {
                  gtag('event', 'outbound_link', {
                    link_url: link.href,
                    link_text: link.innerText,
                    page_path: window.location.pathname
                  });
                }
              });

              // Track file downloads
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href.match(/\\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i)) {
                  gtag('event', 'file_download', {
                    file_name: link.href.split('/').pop(),
                    file_extension: link.href.split('.').pop().toLowerCase(),
                    page_path: window.location.pathname
                  });
                }
              });
            }
          `
        }}
      />
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  )
}

export default MyApp 
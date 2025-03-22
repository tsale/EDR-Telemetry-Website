import '../styles/globals.css'
import '../styles/windows.css'
import '../styles/linux.css'
import '../styles/macOS.css'
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
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  )
} 
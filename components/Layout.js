import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import Navigation from './Navigation'

export default function Layout({ children, title = 'EDR Telemetry' }) {
  useEffect(() => {
    // This is where you can initialize any JavaScript that needs to run on every page
    // Similar to what you might have in a script tag at the bottom of your HTML
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EDR Telemetry Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <main>
        {children}
      </main>

      <footer>
        <p>© {new Date().getFullYear()} EDR Telemetry. All rights reserved.</p>
      </footer>
    </>
  )
} 
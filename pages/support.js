import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CheckCircle, Coffee, ExternalLink, Heart, Microscope, Users } from 'lucide-react'
import { SITE_URL } from '../lib/site'

const fundingItems = [
  'EDR licenses and temporary product access', 'Cloud and testing infrastructure',
  'Windows, Linux, and macOS test environments', 'Evidence collection and storage',
  'Retesting after meaningful product or sensor changes', 'Methodology development and maintenance',
  'Documentation and website maintenance', 'Community contribution review',
  'Research tooling and telemetry generators',
]

const contributionItems = [
  'Submit telemetry evidence', 'Report an incorrect or outdated result',
  'Provide reproducible test cases', 'Review methodology or telemetry categories',
  'Contribute code or tooling', 'Provide temporary evaluation access to an EDR product',
  'Help validate Windows, Linux, or macOS telemetry', 'Submit documentation that can be independently verified',
]

function Checklist({ items }) {
  return <ul className="space-y-3">{items.map((item) => <li key={item} className="flex items-start gap-2 text-slate-600"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{item}</span></li>)}</ul>
}

export default function Sponsorship() {
  const [selectedPrice, setSelectedPrice] = useState('15')
  const [error, setError] = useState(null)
  const priceSteps = ['15', '25', '35', '50']

  const handleProjectSupport = async (event) => {
    event.preventDefault()
    setError(null)
    try {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!key) throw new Error('Payment system is not configured. Please use the contact link below.')
      const stripe = await loadStripe(key)
      const priceIds = {
        '15': 'price_1R6Q4JJOUX0qB6cCqx1J6uuy', '25': 'price_1R6Q4JJOUX0qB6cCOx89CyTE',
        '35': 'price_1R6Q4JJOUX0qB6cCc1DMT7X5', '50': 'price_1QJl5eJOUX0qB6cC8aa6p40v',
      }
      const result = await stripe.redirectToCheckout({
        lineItems: [{ price: priceIds[selectedPrice], quantity: 1 }], mode: 'subscription',
        successUrl: `${window.location.origin}/sponsorship?tier=project-supporter&amount=${selectedPrice}&success=true`,
        cancelUrl: `${window.location.origin}/sponsorship`,
      })
      if (result.error) throw result.error
    } catch (checkoutError) {
      setError(checkoutError.message || 'Unable to open checkout. Please try again or contact the project.')
    }
  }

  const title = 'Support Independent EDR Telemetry Research | EDR Telemetry Project'
  const description = 'Support open, evidence-backed EDR telemetry research through community contributions, one-time support, or transparent organizational sponsorship.'

  return (
    <TemplatePage title={title} description={description} ogTitle={title} ogDescription="Help fund EDR testing infrastructure, product access, evidence collection, documentation, and ongoing public telemetry research." canonicalPath="/sponsorship">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'WebPage', name: title,
          url: `${SITE_URL}/sponsorship`, description,
          isPartOf: { '@type': 'WebSite', name: 'EDR Telemetry Project', url: SITE_URL },
        }) }} />
      </Head>
      <Script id="stripe-buy-button" src="https://js.stripe.com/v3/buy-button.js" strategy="afterInteractive" />

      <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">SUPPORT THE PROJECT</div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white">Support Independent EDR Telemetry Research</h1>
          <p className="mt-6 text-xl !text-slate-300 max-w-4xl mx-auto leading-relaxed">Support helps fund the infrastructure, product access, testing, evidence review, documentation, and maintenance required to keep the EDR Telemetry Project public and useful to the security community.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">What Your Support Funds</h2><p className="text-lg text-slate-600">Running repeatable EDR telemetry research requires more than hosting a website. Support helps cover the practical cost of keeping tests current and evidence available.</p></div>
          <div className="grid md:grid-cols-3 gap-4">{fundingItems.map((item) => <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-5"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-slate-700">{item}</span></div>)}</div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold !text-white mb-4">Research Independence</h2>
          <p className="text-lg !text-slate-300 mb-4">The project&apos;s public methodology and evidence standards explain how telemetry results are classified. Vendor-access paths, evidence sources, and disclosure limitations are documented in the project&apos;s transparency guidance.</p>
          <p className="text-lg !text-slate-300 mb-6">Private EDR evaluations, client-specific telemetry benchmarking, custom reports, and advisory work are separate professional engagements delivered through Defendpoint Consulting.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/methodology" className="text-blue-300 hover:underline font-semibold">Read Our Methodology and Evidence Standards</Link>
            <Link href="/blog/Behind-the-Curtain--How-the-EDR-Telemetry-Project-Approaches-Vendor-Relations--Evaluations--and-Transparency" className="text-blue-300 hover:underline font-semibold">Read About Vendor Relations and Transparency</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Support the Project?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[['Sustain Open Research', 'Help fund the infrastructure and testing needed to keep public EDR telemetry evidence current and accessible.', Microscope], ['Support Broader Coverage', 'Support continued testing across Windows, Linux, macOS, additional products, and evolving telemetry categories.', Users], ['Be Recognized as a Supporter', 'Organizations can receive transparent sponsor recognition, with the financial relationship clearly disclosed.', Heart]].map(([heading, copy, Icon]) => <article key={heading} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg"><Icon className="w-10 h-10 text-purple-600 mb-5" /><h3 className="text-xl font-bold text-slate-900 mb-3">{heading}</h3><p className="text-slate-600">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section id="monthly" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Community Supporters</h2><p className="text-lg text-slate-600">Individuals who use or value the project can support ongoing research with a small recurring contribution.</p></div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <article className="bg-slate-50 rounded-2xl p-8 border border-slate-200"><Coffee className="w-10 h-10 text-orange-600 mb-5" /><h3 className="text-2xl font-bold text-slate-900 mb-2">Community Supporter</h3><p className="text-3xl font-bold text-slate-900 mb-6">$5<span className="text-base font-normal text-slate-600">/month</span></p><Checklist items={['Supporter Discord access', 'Optional name on the supporter page', 'Project update emails or newsletter']} /><a href="https://buy.stripe.com/dR6bKJgm69ko2yIaEJ" className="mt-8 inline-flex w-full justify-center px-6 py-3 rounded-xl bg-orange-600 !text-white font-bold">Become a Community Supporter</a></article>
            <article className="bg-slate-50 rounded-2xl p-8 border border-blue-300"><Heart className="w-10 h-10 text-blue-600 mb-5" /><h3 className="text-2xl font-bold text-slate-900 mb-2">Project Supporter</h3><p className="text-slate-600 mb-4">Choose your monthly amount</p><p className="text-3xl font-bold text-slate-900 mb-5">${selectedPrice}<span className="text-base font-normal text-slate-600">/month</span></p><input aria-label="Monthly support amount" type="range" min="0" max="3" value={priceSteps.indexOf(selectedPrice)} onChange={(event) => setSelectedPrice(priceSteps[Number(event.target.value)])} className="w-full mb-2 accent-blue-600" /><div className="flex justify-between text-sm text-slate-500 mb-6">{priceSteps.map((price) => <span key={price}>${price}</span>)}</div><Checklist items={['All Community Supporter benefits', 'Optional logo recognition for organizations using this tier']} /><button onClick={handleProjectSupport} className="mt-8 inline-flex w-full justify-center px-6 py-3 rounded-xl bg-blue-600 !text-white font-bold">Become a Project Supporter</button><p className="mt-4 text-sm text-slate-500">If checkout is unavailable, <Link href="/contact" className="text-blue-600 hover:underline">contact the project</Link> for a monthly support link.</p>{error && <p role="alert" className="mt-4 text-sm text-red-700">{error} <Link href="/contact" className="underline">Contact the project</Link>.</p>}</article>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-900 mb-4">Organizational Sponsors</h2><p className="text-lg text-slate-600">Organizations that want to provide more substantial support can sponsor the public project. Sponsorship relationships are disclosed separately from commissioned research and consulting work.</p></div>
          <div className="grid md:grid-cols-2 gap-8">
            <article className="bg-white rounded-2xl p-8 border border-slate-200"><h3 className="text-xl font-bold text-slate-900 mb-5">Sponsor recognition</h3><Checklist items={['Organization name and logo on the sponsor page', 'Sponsor acknowledgment on relevant project-support materials', 'Periodic project progress briefings', 'Organizational supporter Discord role, if useful', 'A dedicated administrative contact for sponsorship logistics']} /><Link href="/contact" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-purple-600 !text-white font-bold">Discuss Organizational Sponsorship</Link></article>
            <article className="bg-slate-900 rounded-2xl p-8"><h3 className="text-xl font-bold !text-white mb-4">Sponsor Disclosure</h3><p className="!text-slate-300 mb-6">Organizational sponsor disclosures are published here when relationship information is provided for public display. Each disclosure can identify the relationship type and a relevant evaluated-vendor relationship where that information is tracked and appropriate to publish.</p><p className="!text-slate-400 text-sm">Individual supporter names are only displayed when the supporter has opted into public recognition.</p></article>
          </div>
          <div className="mt-8 bg-blue-50 rounded-2xl p-8 border border-blue-200"><h3 className="text-2xl font-bold text-slate-900 mb-3">Need a Private Evaluation or Custom Report?</h3><p className="text-slate-700 mb-5">Private EDR evaluations, client-specific telemetry benchmarking, custom reports, and advisory work are separate professional engagements delivered through Defendpoint Consulting.</p><a href="https://defendpoint.ca/edr-services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-semibold text-blue-600 hover:underline">Explore Defendpoint EDR Services<ExternalLink className="w-4 h-4 ml-2" /></a></div>
        </div>
      </section>

      <section id="one-time" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 className="text-3xl font-bold text-slate-900 mb-3">One-Time Support</h2><p className="text-lg text-slate-600 mb-8">Prefer not to subscribe? One-time contributions help cover ongoing project infrastructure, testing, and maintenance.</p><div className="bg-slate-50 rounded-2xl p-8 border border-slate-200"><stripe-buy-button buy-button-id="buy_btn_1QJlViJOUX0qB6cCvUZ0hBUX" publishable-key="pk_live_51IRtXuJOUX0qB6cCpzTTp982wIxr0zmR5xv7U79jAGLFuO7J3DJipFUezg1M2q67MABnewnfRUwXadgUnOO1tjjd00uHUj8bS9" /><noscript><p>Payment controls require JavaScript. <Link href="/contact">Contact the project</Link> for a one-time support link.</p></noscript><p className="mt-4 text-sm text-slate-500">If payment options do not load, <Link href="/contact" className="text-blue-600 hover:underline">request a direct support link</Link>.</p></div></div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-10"><h2 className="text-3xl font-bold text-slate-900 mb-4">Contribute Without Sponsoring</h2><p className="text-lg text-slate-600">Financial support is only one way to help. Technical contributions are equally valuable to the project.</p></div><div className="bg-white rounded-2xl p-8 border border-slate-200"><div className="grid md:grid-cols-2 gap-x-8"><Checklist items={contributionItems} /></div><Link href="/contribute" className="mt-8 inline-flex px-6 py-3 rounded-xl bg-blue-600 !text-white font-bold">View the Contribution Guide</Link></div></div>
      </section>
    </TemplatePage>
  )
}

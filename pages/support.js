import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  ArrowRight,
  CheckCircle,
  Coffee,
  ExternalLink,
  Heart,
  Lock,
  Microscope,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'
import { SITE_URL } from '../lib/site'

/** Same Stripe Payment Link as buy_btn_1QJlViJOUX0qB6cCvUZ0hBUX */
const ONE_TIME_CHECKOUT_URL = 'https://donate.stripe.com/7sI7ut6Lw548a1adQU'
const ONE_TIME_PRESETS = [10, 25, 50, 100]
const ONE_TIME_MIN_DOLLARS = 1
const ONE_TIME_MAX_DOLLARS = 10000

const fundingItems = [
  'EDR licenses and temporary product access',
  'Cloud and testing infrastructure',
  'Windows, Linux, and macOS test environments',
  'Evidence collection and storage',
  'Retesting after product or sensor changes',
  'Methodology development and maintenance',
  'Documentation and website maintenance',
  'Community contribution review',
  'Research tooling and telemetry generators',
]

const contributionItems = [
  'Submit telemetry evidence',
  'Report an incorrect or outdated result',
  'Provide reproducible test cases',
  'Review methodology or telemetry categories',
  'Contribute code or tooling',
  'Provide temporary evaluation access to an EDR product',
  'Help validate Windows, Linux, or macOS telemetry',
  'Submit documentation that can be independently verified',
]

const supportOutcomes = [
  {
    title: 'Keep tests current',
    copy: 'Fund licenses, labs, and retesting so public telemetry evidence stays useful.',
    icon: Microscope,
  },
  {
    title: 'Widen platform coverage',
    copy: 'Support work across Windows, Linux, macOS, more products, and new categories.',
    icon: Users,
  },
  {
    title: 'Get public recognition',
    copy: 'Organizations can be listed as sponsors, with the financial relationship disclosed.',
    icon: Heart,
  },
]

const navSections = [
  { id: 'one-time', label: 'One-time' },
  { id: 'funds', label: 'What it funds' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'organizations', label: 'Organizations' },
  { id: 'contribute-support', label: 'Contribute' },
]

const communityBenefits = [
  'Supporter Discord access',
  'Optional name on the supporter page',
  'Project update emails or newsletter',
]

const projectBenefits = [
  'All Community Supporter benefits',
  'Optional logo recognition for organizations using this tier',
]

const sponsorBenefits = [
  'Organization name and logo on the sponsor page',
  'Sponsor acknowledgment on project-support materials',
  'Periodic project progress briefings',
  'Organizational supporter Discord role, if useful',
  'A dedicated administrative contact for sponsorship logistics',
]

function Checklist({ items }) {
  return (
    <ul className="support-check">
      {items.map((item) => (
        <li key={item}>
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Support() {
  const [selectedPrice, setSelectedPrice] = useState('15')
  const [error, setError] = useState(null)
  const [oneTimeError, setOneTimeError] = useState(null)
  const [oneTimeAmount, setOneTimeAmount] = useState('25')
  const [activeSection, setActiveSection] = useState('one-time')
  const priceSteps = ['15', '25', '35', '50']

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    navSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const parsedOneTimeAmount = Number.parseFloat(oneTimeAmount)
  const oneTimeAmountValid =
    Number.isFinite(parsedOneTimeAmount) &&
    parsedOneTimeAmount >= ONE_TIME_MIN_DOLLARS &&
    parsedOneTimeAmount <= ONE_TIME_MAX_DOLLARS

  const handleOneTimeSupport = (event) => {
    event.preventDefault()
    setOneTimeError(null)
    if (!oneTimeAmountValid) {
      setOneTimeError(`Enter an amount between $${ONE_TIME_MIN_DOLLARS} and $${ONE_TIME_MAX_DOLLARS.toLocaleString()}.`)
      return
    }
    const cents = Math.round(parsedOneTimeAmount * 100)
    const checkoutUrl = new URL(ONE_TIME_CHECKOUT_URL)
    checkoutUrl.searchParams.set('__prefilled_amount', String(cents))
    window.location.assign(checkoutUrl.toString())
  }

  const handleProjectSupport = async (event) => {
    event.preventDefault()
    setError(null)
    try {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!key) throw new Error('Payment system is not configured. Please use the contact link below.')
      const stripe = await loadStripe(key)
      const priceIds = {
        15: 'price_1R6Q4JJOUX0qB6cCqx1J6uuy',
        25: 'price_1R6Q4JJOUX0qB6cCOx89CyTE',
        35: 'price_1R6Q4JJOUX0qB6cCc1DMT7X5',
        50: 'price_1QJl5eJOUX0qB6cC8aa6p40v',
      }
      const result = await stripe.redirectToCheckout({
        lineItems: [{ price: priceIds[selectedPrice], quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/support?tier=project-supporter&amount=${selectedPrice}&success=true`,
        cancelUrl: `${window.location.origin}/support`,
      })
      if (result.error) throw result.error
    } catch (checkoutError) {
      setError(checkoutError.message || 'Unable to open checkout. Please try again or contact the project.')
    }
  }

  const title = 'Support the EDR Telemetry Project | EDR Telemetry'
  const description =
    'Fund product access, test labs, evidence review, and public docs for the EDR Telemetry Project through one-time contributions, monthly support, or organizational sponsorship.'

  return (
    <TemplatePage
      title={title}
      description={description}
      ogTitle={title}
      ogDescription="Help fund EDR testing infrastructure, product access, evidence collection, documentation, and ongoing public telemetry research."
      canonicalPath="/support"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: title,
              url: `${SITE_URL}/support`,
              description,
              isPartOf: { '@type': 'WebSite', name: 'EDR Telemetry Project', url: SITE_URL },
            }),
          }}
        />
      </Head>

      <section className="support-hero">
        <div className="support-hero-orb support-hero-orb--blue" aria-hidden="true" />
        <div className="support-hero-orb support-hero-orb--slate" aria-hidden="true" />
        <div className="support-hero-inner">
          <span className="support-badge">
            <Shield className="w-4 h-4" aria-hidden="true" />
            Support the project
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 !text-white leading-tight">
            Fund public EDR telemetry research
          </h1>
          <p className="text-lg md:text-xl !text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your support pays for licenses, labs, evidence review, and docs that keep the comparison
            public.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#one-time"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 !text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Wallet className="w-5 h-5 mr-2" aria-hidden="true" />
              One-time support
            </a>
            <a
              href="#monthly"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-600 hover:bg-slate-800 !text-slate-200 font-bold transition-all"
            >
              Monthly options
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <nav className="support-nav" aria-label="Support sections">
        <div className="support-nav-inner">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`support-nav-pill${activeSection === section.id ? ' is-active' : ''}`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="support-body">
        {/* One-time */}
        <section id="one-time" className="support-section">
          <div className="support-section-inner">
            <div className="support-header center mb-10">
              <p className="support-kicker">Easiest way to help</p>
              <h2 className="support-title">One-time support</h2>
              <p className="support-lead">
                Pay once. No subscription. The amount you choose goes toward infrastructure,
                testing, and maintenance.
              </p>
            </div>

            <div className="support-onetime max-w-5xl mx-auto">
              <div className="support-onetime-grid">
                <div className="support-onetime-copy">
                  <span className="support-onetime-badge">
                    <Wallet className="w-3.5 h-3.5" aria-hidden="true" />
                    Single payment
                  </span>
                  <h3 className="support-onetime-title">Give when it suits you</h3>
                  <p className="support-onetime-lead">
                    Use the payment panel to pick an amount and complete checkout with card or
                    wallet. If the form does not load, ask us for a direct link.
                  </p>
                  <ul className="support-onetime-points">
                    <li>
                      <CheckCircle className="w-5 h-5" aria-hidden="true" />
                      <span>Covers licenses, cloud labs, and retesting costs</span>
                    </li>
                    <li>
                      <CheckCircle className="w-5 h-5" aria-hidden="true" />
                      <span>Does not create a recurring charge</span>
                    </li>
                    <li>
                      <CheckCircle className="w-5 h-5" aria-hidden="true" />
                      <span>Processed securely through Stripe</span>
                    </li>
                  </ul>
                </div>

                <div className="support-onetime-pay">
                  <form className="support-onetime-pay-card" onSubmit={handleOneTimeSupport}>
                    <div className="support-onetime-pay-bar">
                      <span className="support-onetime-pay-bar-left">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        Secure checkout
                      </span>
                      <span className="support-onetime-pay-bar-right">Stripe</span>
                    </div>

                    <div className="support-onetime-form">
                      <p className="support-onetime-form-label">One-time contribution</p>
                      <div className="support-onetime-presets" role="group" aria-label="Suggested amounts">
                        {ONE_TIME_PRESETS.map((amount) => {
                          const selected = Number(oneTimeAmount) === amount
                          return (
                            <button
                              key={amount}
                              type="button"
                              className={`support-onetime-preset${selected ? ' is-selected' : ''}`}
                              onClick={() => {
                                setOneTimeAmount(String(amount))
                                setOneTimeError(null)
                              }}
                            >
                              ${amount}
                            </button>
                          )
                        })}
                      </div>

                      <label className="support-onetime-amount-label" htmlFor="one-time-amount">
                        Amount (USD)
                      </label>
                      <div className="support-onetime-amount-field">
                        <span aria-hidden="true">$</span>
                        <input
                          id="one-time-amount"
                          name="amount"
                          type="number"
                          inputMode="decimal"
                          min={ONE_TIME_MIN_DOLLARS}
                          max={ONE_TIME_MAX_DOLLARS}
                          step="1"
                          value={oneTimeAmount}
                          onChange={(event) => {
                            setOneTimeAmount(event.target.value)
                            setOneTimeError(null)
                          }}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="support-onetime-submit"
                        disabled={!oneTimeAmountValid}
                      >
                        Contribute ${oneTimeAmountValid ? parsedOneTimeAmount.toFixed(0) : '—'}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>

                      <p className="support-onetime-methods">
                        Card, Apple Pay, Google Pay, and Link
                      </p>

                      {oneTimeError && (
                        <p role="alert" className="support-onetime-error">
                          {oneTimeError}
                        </p>
                      )}
                    </div>
                  </form>
                  <p className="support-onetime-fallback">
                    Prefer a direct link?{' '}
                    <a href={ONE_TIME_CHECKOUT_URL}>Open Stripe checkout</a>
                    {' · '}
                    <Link href="/contact">Contact the project</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funds */}
        <section id="funds" className="support-section pt-0">
          <div className="support-section-inner">
            <div className="support-header center mb-10">
              <p className="support-kicker">Where money goes</p>
              <h2 className="support-title">What your support funds</h2>
              <p className="support-lead">
                Repeatable telemetry research needs licenses, labs, evidence storage, and retesting.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
              {fundingItems.map((item) => (
                <div key={item} className="support-fund-item">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-12 max-w-5xl mx-auto">
              {supportOutcomes.map(({ title: outcomeTitle, copy, icon: Icon }) => (
                <article key={outcomeTitle} className="support-card">
                  <div className="support-card-body">
                    <Icon className="w-8 h-8 text-blue-600 mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{outcomeTitle}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-0">{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly */}
        <section id="monthly" className="support-section bg-white border-y border-slate-200">
          <div className="support-section-inner">
            <div className="support-header center mb-10">
              <p className="support-kicker">Recurring</p>
              <h2 className="support-title">Monthly supporters</h2>
              <p className="support-lead">
                A small monthly contribution helps keep testing and reviews on a steady schedule.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <article className="support-card support-tier">
                <div className="support-card-body flex flex-col h-full">
                  <Coffee className="w-9 h-9 text-orange-600 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Community Supporter</h3>
                  <p className="support-tier-price">
                    $5<span>/month</span>
                  </p>
                  <Checklist items={communityBenefits} />
                  <a
                    href="https://buy.stripe.com/dR6bKJgm69ko2yIaEJ"
                    className="support-tier-cta support-tier-cta--orange"
                  >
                    Become a Community Supporter
                  </a>
                </div>
              </article>

              <article className="support-card support-tier ring-2 ring-blue-200">
                <div className="support-card-body flex flex-col h-full">
                  <Heart className="w-9 h-9 text-blue-600 mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Project Supporter</h3>
                  <p className="text-sm text-slate-500 mb-1">Choose your monthly amount</p>
                  <p className="support-tier-price">
                    ${selectedPrice}
                    <span>/month</span>
                  </p>
                  <input
                    aria-label="Monthly support amount"
                    type="range"
                    min="0"
                    max="3"
                    value={priceSteps.indexOf(selectedPrice)}
                    onChange={(event) => setSelectedPrice(priceSteps[Number(event.target.value)])}
                    className="support-slider"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mb-5">
                    {priceSteps.map((price) => (
                      <span key={price}>${price}</span>
                    ))}
                  </div>
                  <Checklist items={projectBenefits} />
                  <button
                    type="button"
                    onClick={handleProjectSupport}
                    className="support-tier-cta support-tier-cta--blue"
                  >
                    Become a Project Supporter
                  </button>
                  <p className="mt-4 text-sm text-slate-500 mb-0">
                    Checkout unavailable?{' '}
                    <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                      Contact the project
                    </Link>
                    .
                  </p>
                  {error && (
                    <p role="alert" className="mt-3 text-sm text-red-700 mb-0">
                      {error}{' '}
                      <Link href="/contact" className="underline">
                        Contact the project
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Organizations */}
        <section id="organizations" className="support-section">
          <div className="support-section-inner">
            <div className="support-header center mb-10">
              <p className="support-kicker">For companies</p>
              <h2 className="support-title">Organizational sponsors</h2>
              <p className="support-lead">
                Larger sponsorships fund deeper coverage. We disclose the relationship separately
                from commissioned research and consulting.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <article className="support-card">
                <div className="support-card-body">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Sponsor recognition</h3>
                  <Checklist items={sponsorBenefits} />
                  <Link href="/contact" className="support-tier-cta support-tier-cta--slate">
                    Discuss organizational sponsorship
                  </Link>
                </div>
              </article>

              <article className="support-card bg-slate-900 border-slate-800">
                <div className="support-card-body">
                  <h3 className="text-xl font-bold !text-white mb-3">Sponsor disclosure</h3>
                  <p className="!text-slate-300 mb-4 leading-relaxed">
                    We publish sponsor disclosures when the organization agrees to public
                    recognition. Each disclosure can name the relationship type and any relevant
                    evaluated-vendor relationship when that information is tracked and appropriate
                    to publish.
                  </p>
                  <p className="!text-slate-400 text-sm mb-0">
                    Individual supporter names appear only when the supporter opts into public
                    recognition.
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-8 max-w-5xl mx-auto rounded-2xl border border-blue-200 bg-blue-50 p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Need a private evaluation or custom report?
              </h3>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Private EDR evaluations, client-specific telemetry benchmarking, custom reports, and
                advisory work are separate engagements through Defendpoint Consulting.
              </p>
              <a
                href="https://defendpoint.ca/edr-services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-semibold text-blue-700 hover:underline"
              >
                Explore Defendpoint EDR Services
                <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* Independence */}
        <section className="support-section support-dark">
          <div className="support-section-inner max-w-4xl">
            <h2 className="support-title">Research independence</h2>
            <p className="support-lead !max-w-none mb-4">
              Public methodology and evidence standards explain how we classify telemetry results.
              Vendor-access paths, evidence sources, and disclosure limits are covered in the
              transparency guidance.
            </p>
            <p className="support-lead !max-w-none mb-6">
              Client-specific evaluations and advisory work run separately through Defendpoint
              Consulting.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/methodology" className="text-blue-300 hover:underline font-semibold">
                Methodology and evidence standards
              </Link>
              <Link
                href="/blog/Behind-the-Curtain--How-the-EDR-Telemetry-Project-Approaches-Vendor-Relations--Evaluations--and-Transparency"
                className="text-blue-300 hover:underline font-semibold"
              >
                Vendor relations and transparency
              </Link>
            </div>
          </div>
        </section>

        {/* Contribute */}
        <section id="contribute-support" className="support-section bg-white">
          <div className="support-section-inner max-w-4xl">
            <div className="support-header center mb-8">
              <p className="support-kicker">No payment required</p>
              <h2 className="support-title">Contribute without sponsoring</h2>
              <p className="support-lead">
                Evidence, corrections, and tooling help as much as funding.
              </p>
            </div>
            <div className="support-card">
              <div className="support-card-body">
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                  <Checklist items={contributionItems} />
                </div>
                <Link href="/contribute" className="support-tier-cta support-tier-cta--blue mt-6">
                  View the contribution guide
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TemplatePage>
  )
}

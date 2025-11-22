import TemplatePage from '../components/TemplatePage'
import { useEffect, useState } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import Link from 'next/link'
import { getSortedPostsData } from '../lib/blog'
import { BookOpen, Mail, ArrowRight, X } from 'lucide-react'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Blog({ allPostsData }) {
  // Use the heading links hook
  useHeadingLinks();

  // Newsletter form state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', 'duplicate', or null
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Initialize any client-side logic if needed
  }, [])

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        if (res.status === 409) {
          // Email already subscribed
          setSubmitStatus('duplicate');
          return;
        }
        throw new Error('Subscription failed');
      }

      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup error');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TemplatePage title="EDR Telemetry Blog: Research & Insights"
      description="Research updates, methodology insights, and EDR telemetry analysis for security teams.">

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-20 pb-24 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
              EDR Telemetry <span className="text-blue-400">Blog</span>
            </h1>

            <p className="mt-6 text-xl !text-slate-300 text-center leading-relaxed text-balance px-4">
              Insights and analysis from our research into EDR telemetry capabilities,
              methodology updates, and security industry trends.
            </p>

            {/* Newsletter Signup Form - Collapsible */}
            <div className="mt-10 max-w-md mx-auto min-h-32 flex items-start justify-center">
              {!isExpanded ? (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="group relative inline-flex items-center px-6 py-3 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-200 font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Subscribe to Updates</span>
                </button>
              ) : (
                <div className="relative w-full animate-in fade-in zoom-in-95 duration-200">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-30 blur"></div>
                  <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl p-6 ring-1 ring-white/10 shadow-2xl">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                      aria-label="Close subscription form"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <p className="text-sm text-slate-200 font-medium">
                        Never miss a blog post
                      </p>
                    </div>

                    <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 px-4 py-2.5 text-sm bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {isSubmitting ? '...' : 'Subscribe'}
                        </button>
                      </div>
                    </form>

                    {/* Success/Error Messages */}
                    {submitStatus === 'success' && (
                      <p className="mt-3 text-xs text-green-400 text-center font-medium">
                        ✓ Thank you for subscribing to our newsletter!
                      </p>
                    )}
                    {submitStatus === 'duplicate' && (
                      <p className="mt-3 text-xs text-amber-300 text-center font-medium">
                        • This email is already subscribed.
                      </p>
                    )}
                    {submitStatus === 'error' && (
                      <p className="mt-3 text-xs text-red-400 text-center font-medium">
                        ✗ Something went wrong. Try again.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="blog-container">
        <div className="blog-grid">
          {allPostsData.map(({ id, date, title, subtitle, image }) => (
            <Link href={`/blog/${id}`} key={id} className="blog-card">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="blog-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/edr_telemetry_logo.png'; // Fallback image
                  }}
                />
              ) : (
                <div className="blog-image-placeholder" style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/images/edr_telemetry_logo.png" alt="Default" style={{ maxHeight: '80%', opacity: 0.5 }} />
                </div>
              )}
              <div className="blog-content">
                <h2 className="blog-title">{title}</h2>
                <p className="blog-excerpt">{subtitle}</p>
                <div className="blog-footer">
                  <span className="blog-link">Read More →</span>
                  <small className="blog-date">{date}</small>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </TemplatePage>
  )
} 

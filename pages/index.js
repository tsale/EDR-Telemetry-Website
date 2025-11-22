import TemplatePage from '../components/TemplatePage'
import Head from 'next/head'
import Link from 'next/link'
import { 
  ArrowRight, Shield, Activity, Database, Server, Terminal, 
  Command, HelpCircle, CheckCircle, Users, Building, Lock, 
  BarChart3, FileText, Globe, Compass, Monitor 
} from 'lucide-react'

export default function Home() {
  const stats = [
    { value: "20+", label: "Solutions Analyzed", icon: Database },
    { value: "2", label: "Platforms Covered", icon: Server },
    { value: "100%", label: "Open Source", icon: Globe },
    { value: "100%", label: "Vendor Agnostic", icon: Shield },
  ]

  return (
    <TemplatePage 
      title="EDR Telemetry Project: Transparent Benchmarking & Telemetry Analysis for Businesses"
      description="Explore transparent, vendor-neutral EDR telemetry benchmarks. Make confident security decisions with real-world data and practical analysis for your business."
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'EDR Telemetry Project',
            url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
            logo: (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/images/edr_telemetry_logo.png` : 'https://example.com/images/edr_telemetry_logo.png'),
            sameAs: [
              'https://github.com/tsale/EDR-Telemetry',
              'https://twitter.com/kostastsale',
              'https://linkedin.com/in/kostastsale'
            ],
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'EDR Telemetry Project',
            url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
            potentialAction: {
              '@type': 'SearchAction',
              target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }) }}
        />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-20 pb-24 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
              EDR Telemetry of<br />
              <span className="text-blue-400">Modern EDR Solutions</span>
            </h1>
            
            <p className="mt-6 text-xl !text-slate-300 text-center leading-relaxed text-balance px-4">
              Comprehensive endpoint detection and response analysis with real-time telemetry comparison, 
              behavioral analytics insights, and detailed platform coverage.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/scores" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Scores
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 border border-slate-700 text-base font-bold rounded-xl !text-slate-200 hover:bg-slate-800 transition-all hover:border-slate-600">
                <Globe className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </div>
          </div>

          {/* Platforms Cards - Hero Integrated */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
            {/* Windows */}
            <Link href="/windows" className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Monitor className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Windows</h3>
                <p className="text-slate-600 text-sm mb-4">Detailed event coverage and analysis for Windows platforms.</p>
                <div className="flex items-center text-blue-600 text-sm font-bold">
                  View Telemetry <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Linux */}
            <Link href="/linux" className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-50 rounded-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Linux</h3>
                <p className="text-slate-600 text-sm mb-4">System-level monitoring and telemetry for Linux distros.</p>
                <div className="flex items-center text-orange-500 text-sm font-bold">
                  View Telemetry <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* macOS */}
            <Link href="/macos" className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 opacity-90">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-50 rounded-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-slate-700/20 group-hover:scale-110 transition-transform">
                  <Command className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">macOS</h3>
                <p className="text-slate-600 text-sm mb-4">Native security framework integration analysis.</p>
                <div className="flex items-center text-slate-700 text-sm font-bold">
                  Coming Soon <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800/50 pt-12 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="p-3 bg-slate-800/50 rounded-lg mb-3 group-hover:bg-slate-800 transition-colors ring-1 ring-slate-700">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <p className="mt-12 text-sm text-slate-300 text-center">Powered by Defendpoint Consulting</p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Make Evidence-Based EDR Decisions</h2>
            <p className="text-lg text-slate-600">
              Use our vendor-neutral research to compare telemetry depth across platforms, validate deployment quality, and set clear improvement priorities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Compare Depth & Coverage</h3>
                <p className="text-slate-600">
                  Analyze capabilities using <Link href="/scores" className="text-blue-600 hover:underline font-medium">Scores</Link> to understand vendor performance.
                </p>
              </div>
            </div>

            <div className="flex items-start p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
              <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <Activity className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Explore Signals</h3>
                <p className="text-slate-600">
                  Deep dive into specific signals in <Link href="/telemetry-categories" className="text-blue-600 hover:underline font-medium">Telemetry Categories</Link> to validate detection logic.
                </p>
              </div>
            </div>

            <div className="flex items-start p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
              <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg text-purple-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Check Eligibility</h3>
                <p className="text-slate-600">
                  Review scope and inclusion rules in <Link href="/eligibility" className="text-blue-600 hover:underline font-medium">Eligibility</Link> to ensure fair comparison.
                </p>
              </div>
            </div>

            <div className="flex items-start p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
              <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Stay Informed</h3>
                <p className="text-slate-600">
                  Follow program direction and updates in <Link href="/about" className="text-blue-600 hover:underline font-medium">About</Link> and <Link href="/blog" className="text-blue-600 hover:underline font-medium">Blog</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                Project Mission
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Empowering Security Teams with Transparency
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                The EDR Telemetry Project provides comprehensive analysis of endpoint detection and response 
                capabilities across major operating systems. Our research helps security professionals understand 
                the telemetry landscape and make informed decisions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="ml-3 text-slate-600">Comprehensive platform coverage and depth analysis</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="ml-3 text-slate-600">Real-time telemetry analysis and validation</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="ml-3 text-slate-600">Open source methodology and community driven</p>
                </div>
              </div>

              <Link href="/about" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group">
                Learn More About Our Research <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 transform rotate-3 rounded-2xl opacity-30 blur-xl"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse delay-75"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse delay-150"></div>
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse delay-200"></div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-blue-50 rounded-lg border border-blue-100"></div>
                    <div className="h-24 bg-emerald-50 rounded-lg border border-emerald-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Benefits Section */}
      <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Security and Business Teams</h2>
            <p className="text-lg text-slate-400">Tailored insights for every stakeholder in the security lifecycle</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Building className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Mid-sized Businesses</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Validate telemetry readiness and reduce blind spots in your security posture.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Globe className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Large Enterprises</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Benchmark across fleets and guide platform strategy with data-driven insights.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Users className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Security Leaders</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Communicate coverage and risk with objective metrics to stakeholders.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <Shield className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Detection Engineers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Map signals to MITRE ATT&CK and reduce alert friction with precise data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Is the research vendor-neutral?
              </h3>
              <p className="text-slate-600 pl-5 border-l-2 border-slate-100 ml-1">
                Yes. The EDR Telemetry Project is vendor-agnostic and focuses on transparent, evidence-based comparisons without bias.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Can we use this to guide procurement?
              </h3>
              <p className="text-slate-600 pl-5 border-l-2 border-slate-100 ml-1">
                Absolutely. Use the platform scores, category depth, and eligibility criteria to frame objective evaluations for your organization.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Do you offer help applying the benchmarks?
              </h3>
              <p className="text-slate-600 pl-5 border-l-2 border-slate-100 ml-1">
                Yes. See <Link href="/premium-services" className="text-blue-600 hover:underline font-medium">Premium Services</Link> for benchmarking and advisory support.
              </p>
            </div>
          </div>
        </div>
      </div>

    </TemplatePage>
  )
} 

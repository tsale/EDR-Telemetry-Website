import TemplatePage from '../components/TemplatePage'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { loadStripe } from '@stripe/stripe-js'
import { Target, Microscope, Users, Coffee, Star, Trophy, CheckCircle } from 'lucide-react'

// Initialize Stripe with null check
const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  console.log('Stripe key status:', {
    keyExists: !!key,
    keyLength: key ? key.length : 0,
    keyPrefix: key ? key.substring(0, 7) : 'none',
    env: process.env.NODE_ENV
  });
  
  if (!key) {
    console.error('Stripe publishable key is not set in environment variables');
    return null;
  }
  return loadStripe(key);
};

// Analytics tracking function
const trackSubscriptionEvent = (action, tier, amount) => {
  try {
    // Track with Google Analytics 4
    if (window.gtag) {
      // Common parameters for all events
      const eventParams = {
        subscription_tier: tier,
        subscription_amount: amount,
        currency: 'USD'
      };

      switch (action) {
        case 'subscription_initiated':
          gtag('event', 'begin_checkout', {
            ...eventParams,
            items: [{
              item_name: `${tier} Subscription`,
              price: amount,
              currency: 'USD'
            }]
          });
          break;

        case 'subscription_completed':
          gtag('event', 'purchase', {
            ...eventParams,
            transaction_id: `${tier}_${Date.now()}`,
            value: amount,
            items: [{
              item_name: `${tier} Subscription`,
              price: amount,
              currency: 'USD'
            }]
          });
          break;

        case 'subscription_error':
          gtag('event', 'exception', {
            ...eventParams,
            description: `Subscription error for ${tier} tier`,
            fatal: false
          });
          break;

        default:
          gtag('event', action, eventParams);
      }
    }

    // Track with Plausible if needed
    if (window.plausible) {
      window.plausible(action, {
        props: {
          tier,
          amount,
          currency: 'USD'
        }
      });
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

export default function Sponsorship() {
  const [loading, setLoading] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState('15');
  const [error, setError] = useState(null);
  const priceSteps = ['15', '25', '35', '50'];

  // Handle Stripe script load
  const handleStripeLoad = () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error('Stripe publishable key is not set');
      setError('Payment system is not properly configured. Please try again later.');
      return;
    }
    console.log("Stripe script loaded");
    setLoading(false);
  };

  // Load contributors.js
  useEffect(() => {
    const loadContributors = async () => {
      if (typeof window !== 'undefined') {
        try {
          const contributorsModule = await import('../utils/contributors');
          if (contributorsModule.default) {
            contributorsModule.default();
          }
        } catch (error) {
          console.warn('Contributors script not found or error loading:', error);
        }
      }
    };

    loadContributors();
  }, []);

  const handleSliderChange = (e) => {
    const value = e.target.value;
    const index = Math.round((value * (priceSteps.length - 1)) / 100);
    setSelectedPrice(priceSteps[index]);
  };

  const getSliderValue = () => {
    const index = priceSteps.indexOf(selectedPrice);
    return (index / (priceSteps.length - 1)) * 100;
  };

  // Handle coffee supporter click
  const handleCoffeeSupporterClick = (e) => {
    // Track the click event
    trackSubscriptionEvent('subscription_initiated', 'coffee', 5);
  };

  // Handle successful subscription (called when user returns from Stripe)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const success = query.get('success');
    const tier = query.get('tier');
    const amount = query.get('amount');

    if (success === 'true' && tier) {
      trackSubscriptionEvent('subscription_completed', tier, amount);
    }
  }, []);

  const handlePremiumSubscribe = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Attempting to initialize Stripe...');
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe is not properly configured. Please check your environment variables.');
      }
      console.log('Stripe initialized successfully');

      // Track premium subscription initiation
      trackSubscriptionEvent('subscription_initiated', 'premium', parseInt(selectedPrice));

      const priceIds = {
        '15': 'price_1R6Q4JJOUX0qB6cCqx1J6uuy',
        '25': 'price_1R6Q4JJOUX0qB6cCOx89CyTE',
        '35': 'price_1R6Q4JJOUX0qB6cCc1DMT7X5',
        '50': 'price_1QJl5eJOUX0qB6cC8aa6p40v'
      };

      const { error: checkoutError } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceIds[selectedPrice], quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success?tier=premium&amount=${selectedPrice}&success=true`,
        cancelUrl: `${window.location.origin}/sponsorship`,
      });

      if (checkoutError) {
        throw checkoutError;
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'An error occurred while processing your subscription');
      
      // Track subscription error
      trackSubscriptionEvent('subscription_error', 'premium', parseInt(selectedPrice));
    }
  };

  return (
    <TemplatePage title="Sponsorship - EDR Telemetry Project">
      <Head>
        <title>Sponsorship - EDR Telemetry Project</title>
        <meta name="description" content="Support the EDR Telemetry Project and help us maintain independence in EDR research and analysis." />
        <meta httpEquiv="Content-Security-Policy" content="
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
            https://*.vercel.live;
        " />
      </Head>

      {/* Load Stripe script using Next.js Script component */}
      <Script
        id="stripe-buy-button"
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="afterInteractive"
        onLoad={handleStripeLoad}
        onError={(e) => {
          console.error('Error loading Stripe script:', e);
          setError('Failed to load payment system. Please try again later.');
        }}
      />

      {/* Add debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ display: 'none' }}>
          Stripe Key Status: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Present' : 'Missing'}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white pt-20 pb-24 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-800/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-800/20 blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 mr-2 animate-pulse"></span>
              Sponsorship Program
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
              Become a <span className="text-purple-400">Sponsor</span>
            </h1>
            
            <p className="mt-6 text-xl !text-slate-300 text-center leading-relaxed text-balance px-4">
              Support independent EDR telemetry research and gain exclusive benefits for your organization
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Sponsor the EDR Telemetry Project?</h2>
            <p className="text-lg text-slate-600">
              Your sponsorship helps maintain our independence and accelerates research that benefits the entire security community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-purple-300">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Brand Visibility</h3>
              <p className="text-slate-600">Prominent logo placement and recognition across our platform</p>
            </div>
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-indigo-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Early Access</h3>
              <p className="text-slate-600">Get early insights into new research and telemetry data</p>
            </div>
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Impact</h3>
              <p className="text-slate-600">Help shape the future of EDR telemetry standards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription section */}
      <div id="monthly" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sponsorship Tiers</h2>
            <p className="text-lg text-slate-600">
              Choose the plan that best fits your organization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Bronze Tier */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-orange-600/20 group-hover:scale-110 transition-transform">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Bronze</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">$5</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Discord community access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Name on supporters page</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Monthly newsletter</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Support independent research</span>
                  </li>
                </ul>
                <a 
                  href="https://buy.stripe.com/dR6bKJgm69ko2yIaEJ" 
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md hover:shadow-lg"
                  onClick={handleCoffeeSupporterClick}
                >
                  Become a Bronze Sponsor
                </a>
              </div>
            </div>

            {/* Silver Tier - Featured */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-2xl transition-all duration-300 border-2 border-blue-400 hover:border-blue-500 transform md:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                Most Popular
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Silver</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">${selectedPrice}</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <div className="mb-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={getSliderValue()}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2">
                    {priceSteps.map((price) => (
                      <span 
                        key={price} 
                        className={`text-sm font-medium ${selectedPrice === price ? 'text-blue-600' : 'text-slate-400'}`}
                      >
                        ${price}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">All Bronze benefits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Featured logo on website</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Early access to research</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Priority Discord support</span>
                  </li>
                </ul>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                  onClick={(e) => handlePremiumSubscribe(e)}
                >
                  Become a Silver Sponsor
                </a>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Gold Tier */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-amber-600/20 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Gold</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">Enterprise Sponsor</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">All other benefits+</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Custom research reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Dedicated communication line</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Co-branded opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Joint articles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">Logo placement on website</span>
                  </li>
                </ul>
                <Link href="/contact" className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-bold rounded-xl !text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-md hover:shadow-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One-time support section */}
      <div id="one-time" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">One-Time Support</h3>
            <p className="text-lg text-slate-600">
              Prefer to make a one-time contribution? We appreciate your support!
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600">Loading payment options...</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <stripe-buy-button
                  buy-button-id="buy_btn_1QJlViJOUX0qB6cCvUZ0hBUX"
                  publishable-key="pk_live_51IRtXuJOUX0qB6cCpzTTp982wIxr0zmR5xv7U79jAGLFuO7J3DJipFUezg1M2q67MABnewnfRUwXadgUnOO1tjjd00uHUj8bS9"
                >
                </stripe-buy-button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Sponsors */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Sponsors</h2>
              <div id="sponsorsSection" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">Loading sponsors...</p>
                </div>
              </div>
            </div>
    
            {/* One-Time Supporters */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">One-Time Supporters</h2>
              <div id="donorsSection" className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">Loading supporters...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 

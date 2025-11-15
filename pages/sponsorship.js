import TemplatePage from '../components/TemplatePage'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { loadStripe } from '@stripe/stripe-js'
import { Target, Microscope, Users, Coffee, Star, Trophy } from 'lucide-react'

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

      <div className="hero-section">
        <div className="hero-content">
          <h1>Become a Sponsor</h1>
          <p>Support independent EDR telemetry research and gain exclusive benefits for your organization</p>
        </div>
      </div>

      <div className="content-section">
        <div className="sponsor-content">
          {/* Value proposition */}
          <div className="value-section">
            <div className="value-grid">
              <div className="value-card">
                <div className="value-icon">
                  <Target size={48} strokeWidth={1.5} />
                </div>
                <h3>Brand Visibility</h3>
                <p>Prominent logo placement and recognition across our platform</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Microscope size={48} strokeWidth={1.5} />
                </div>
                <h3>Early Access</h3>
                <p>Get early insights into new research and telemetry data</p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <Users size={48} strokeWidth={1.5} />
                </div>
                <h3>Community Impact</h3>
                <p>Help shape the future of EDR telemetry standards</p>
              </div>
            </div>
          </div>

          {/* Subscription section */}
          <div id="monthly" className="subscription-section">
            <div className="subscription-header">
              <h2>Sponsorship Tiers</h2>
              <p>Choose the plan that best fits your organization</p>
            </div>
            
            <div className="sponsorship-tiers">
              <div className="tier-card bronze">
                <div className="tier-header">
                  <div className="tier-icon">
                    <Coffee size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="tier-name">Bronze</h3>
                  <div className="tier-price">
                    <span className="price-amount">$5</span>
                    <span className="price-period">/month</span>
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>Discord community access</li>
                    <li>Name on supporters page</li>
                    <li>Monthly newsletter</li>
                    <li>Support independent research</li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <a 
                    href="https://buy.stripe.com/dR6bKJgm69ko2yIaEJ" 
                    className="tier-button bronze"
                    onClick={handleCoffeeSupporterClick}
                  >
                    Become a Bronze Sponsor
                  </a>
                </div>
              </div>

              <div className="tier-card silver featured">
                <div className="featured-badge">Most Popular</div>
                <div className="tier-header">
                  <div className="tier-icon">
                    <Star size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="tier-name">Silver</h3>
                  <div className="tier-price">
                    <div className="price-display">
                      <span className="price-amount">${selectedPrice}</span>
                      <span className="price-period">/month</span>
                    </div>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={getSliderValue()}
                        onChange={handleSliderChange}
                        className="price-slider"
                      />
                      <div className="price-markers">
                        {priceSteps.map((price) => (
                          <div 
                            key={price} 
                            className={`price-marker ${selectedPrice === price ? 'active' : ''}`}
                          >
                            ${price}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>All Bronze benefits</li>
                    <li>Featured logo on website</li>
                    <li>Early access to research</li>
                    <li>Priority Discord support</li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <a 
                    href="#" 
                    className="tier-button silver"
                    onClick={(e) => handlePremiumSubscribe(e)}
                  >
                    Become a Silver Sponsor
                  </a>
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="tier-card gold">
                <div className="tier-header">
                  <div className="tier-icon">
                    <Trophy size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="tier-name">Gold</h3>
                  <div className="tier-price">
                    <span className="price-amount">Custom</span>
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>All Silver benefits</li>
                    <li>Custom research reports</li>
                    <li>Dedicated support channel</li>
                    <li>Co-branded opportunities</li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <Link href="/contact" className="tier-button gold">Contact Us</Link>
                </div>
              </div>
            </div>
          </div>

          {/* One-time support section - Secondary */}
          <div id="one-time" className="one-time-support">
            <div className="one-time-header">
              <h3>One-Time Support</h3>
              <p>Prefer to make a one-time contribution? We appreciate your support!</p>
            </div>
            
            <div className="donation-container">
              {loading ? (
                <div className="donation-loading">
                  <div className="spinner"></div>
                  <p>Loading payment options...</p>
                </div>
              ) : (
                <div className="donation-content">
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
      </div>

      <div className="community-section">
        <div className="container">    
          <div className="section-group">
            <h2>Our Sponsors</h2>
            <div id="sponsorsSection" className="section-content">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading sponsors...</p>
              </div>
            </div>
    
            <div className="section-group">
              <h2>One-Time Supporters</h2>
              <div id="donorsSection" className="section-content">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading supporters...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 

import TemplatePage from '../components/TemplatePage'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { loadStripe } from '@stripe/stripe-js'

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
          <h1>Support Our Mission</h1>
          <p>Help us revolutionize EDR telemetry research and innovation while gaining exclusive benefits</p>
        </div>
      </div>

      <div className="content-section">
        <div className="sponsor-content">
          {/* Elegant nav tabs */}
          <div className="sponsor-nav-tabs">
            <a href="#one-time" className="nav-tab active">
              <span className="tab-icon">💝</span>
              <span className="tab-text">One-time Support</span>
              <span className="tab-badge">Popular</span>
            </a>
            <a href="#monthly" className="nav-tab">
              <span className="tab-icon">⭐</span>
              <span className="tab-text">Monthly Plans</span>
            </a>
          </div>

          {/* Benefits section */}
          <div className="why-sponsor">
            <h2>Why Become a Sponsor?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h4>🎯 Brand Visibility</h4>
                <p>Your brand featured prominently across our platform and materials.</p>
              </div>
              <div className="benefit-item">
                <h4>🔒 Exclusive Access</h4>
                <p>Early access to new research, features, and detailed reports.</p>
              </div>
              <div className="benefit-item">
                <h4>🤝 Network Growth</h4>
                <p>Connect with security professionals and industry leaders.</p>
              </div>
            </div>
          </div>

          {/* One-time support section */}
          <div id="one-time" className="one-time-support">
            <div className="one-time-header">
              <div className="header-icon">💖</div>
              <h3>Make a One-time Contribution</h3>
            </div>
            
            <div className="donation-intro">
              <p>Your contribution directly funds our research and development efforts, helping us provide valuable EDR telemetry insights to the security community.</p>
            </div>
            
            <div className="donation-container">
              <div className="donation-left">
                <div className="donation-benefits">
                  <h4>Why Support Us?</h4>
                  <ul className="donation-benefits-list">
                    <li>
                      <span className="benefit-icon">🧪</span>
                      <span>Fund independent EDR research</span>
                    </li>
                    <li>
                      <span className="benefit-icon">🏆</span>
                      <span>Recognition on our website</span>
                    </li>
                    <li>
                      <span className="benefit-icon">🔍</span>
                      <span>Support unbiased telemetry evaluations</span>
                    </li>
                    <li>
                      <span className="benefit-icon">🫣</span>
                      <span>Gartner, who? This is the <strong>EDR Telemetry Project</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="donation-right">
                <div className="donation-card">
                  <div className="donation-card-header">
                    <h4>Your Contribution</h4>
                  </div>
                  <div className="donation-card-content">
                    {loading ? (
                      <div className="donation-loading">
                        <div className="spinner-small"></div>
                        <p>Loading payment form...</p>
                      </div>
                    ) : (
                      <div className="stripe-container">
                        <stripe-buy-button
                          buy-button-id="buy_btn_1QJlViJOUX0qB6cCvUZ0hBUX"
                          publishable-key="pk_live_51IRtXuJOUX0qB6cCpzTTp982wIxr0zmR5xv7U79jAGLFuO7J3DJipFUezg1M2q67MABnewnfRUwXadgUnOO1tjjd00uHUj8bS9"
                        >
                        </stripe-buy-button>
                      </div>
                    )}
                  </div>
                  <div className="donation-card-footer">
                    <div className="donation-security">
                      <span className="security-icon">🔒</span>
                      <span className="security-text">Secure payment via Stripe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="donation-testimonial">
              <blockquote>
                "Your contributions enable us to maintain independence and focus on what matters most: accurate and unbiased EDR telemetry analysis."
              </blockquote>
              <div className="donation-note">
                <p>Every contribution makes a difference, no matter the size. Thank you for your support!</p>
              </div>
            </div>
          </div>

          {/* Subscription section */}
          <div id="monthly" className="subscription-section">
            <div className="subscription-header">
              <div className="header-icon">⭐</div>
              <h3>Monthly Sponsorship Plans</h3>
              <p>Join our community of supporters and help drive innovation in EDR telemetry research. Choose a plan that matches your commitment to advancing security intelligence.</p>
            </div>
            
            <div className="sponsorship-tiers">
              <div className="tier-card coffee">
                <div className="tier-header">
                  <div className="tier-icon">☕️</div>
                  <h4 className="tier-name">Coffee Supporter</h4>
                  <div className="tier-price">
                    <span className="price-amount">$5</span>
                    <span className="price-period">/month</span>
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>
                      <span>Private Discord channel invitation</span>
                    </li>
                    <li>
                      <span>Name on supporters page</span>
                    </li>
                    <li>
                      <span>Monthly newsletter</span>
                    </li>
                    <li>
                      <span>Public recognition of support</span>
                    </li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <a 
                    href="https://buy.stripe.com/dR6bKJgm69ko2yIaEJ" 
                    className="tier-button coffee"
                    onClick={handleCoffeeSupporterClick}
                  >
                    Buy me a coffee
                  </a>
                </div>
              </div>

              <div className="tier-card premium">
                <div className="popular-badge">Most Popular</div>
                <div className="tier-header">
                  <div className="tier-icon">⭐</div>
                  <h4 className="tier-name">Premium Supporter</h4>
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
                    <li>
                      <span>All Coffee Supporter benefits</span>
                    </li>
                    <li>
                      <span>Featured recognition on website</span>
                    </li>
                    <li>
                      <span>Early access to articles</span>
                    </li>
                    <li>
                      <span>Priority Discord support & channels</span>
                    </li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <a 
                    href="#" 
                    className="tier-button premium"
                    id="premium-subscribe-button"
                    onClick={(e) => handlePremiumSubscribe(e)}
                  >
                    Become Premium Supporter
                  </a>
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              <div className="tier-card enterprise">
                <div className="tier-header">
                  <div className="tier-icon">🏢</div>
                  <h4 className="tier-name">Enterprise Sponsor</h4>
                  <div className="tier-price">
                    <span className="price-amount">Custom</span>
                    <span className="price-period">Solution</span>
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>
                      <span>All Premium Supporter benefits</span>
                    </li>
                    <li>
                      <span>Custom research reports</span>
                    </li>
                    <li>
                      <span>Dedicated support channel</span>
                    </li>
                    <li>
                      <span>Co-branded content opportunities</span>
                    </li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <a href="/contact" className="tier-button enterprise">Contact Us</a>
                </div>
              </div>
            </div>
            
            <div className="subscription-footer">
              <div className="subscription-note">
                <p>All plans include our commitment to transparency and ongoing EDR telemetry research.</p>
                <p>Have questions about our plans? <a href="/contact">Contact us</a> for more information.</p>
              </div>
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
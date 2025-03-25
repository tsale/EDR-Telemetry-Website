import TemplatePage from '../components/TemplatePage'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with null check
const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('Stripe publishable key is not set in environment variables');
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
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Please configure your Stripe publishable key');
      }

      // Track premium subscription initiation
      trackSubscriptionEvent('subscription_initiated', 'premium', parseInt(selectedPrice));

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

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
      </Head>

      {/* Load Stripe script using Next.js Script component */}
      <Script
        id="stripe-buy-button"
        src="https://js.stripe.com/v3/buy-button.js"
        strategy="lazyOnload"
        onLoad={handleStripeLoad}
      />

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
              <p>Support us continuously and receive exclusive benefits</p>
            </div>
            
            <div className="sponsorship-tiers">
              <div className="tier-card">
                <div className="tier-header">
                  <div className="tier-badge">Coffee</div>
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
                    className="tier-button-link"
                    onClick={handleCoffeeSupporterClick}
                  >
                    Buy me a coffee monthly
                  </a>
                </div>
              </div>

              <div className="tier-card">
                <div className="tier-header">
                  <div className="tier-badge">Premium</div>
                  <div className="popular-tag">Popular</div>
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
                    className="tier-button-link"
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
                  <div className="tier-badge">Elite</div>
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
                  <a href="/contact" className="tier-button-link">Contact Us</a>
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

      <style jsx>{`
        .price-display {
          text-align: center;
          margin-bottom: 2rem;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: bold;
          color: #2d3748;
        }

        .price-period {
          color: #718096;
          margin-left: 0.5rem;
          font-size: 1.2rem;
        }

        .slider-container {
          width: 100%;
          max-width: 400px;
          padding: 0;
          margin: 2rem auto;
          position: relative;
        }

        .price-slider {
          width: calc(100% - 24px);
          height: 8px;
          -webkit-appearance: none;
          background: #e2e8f0;
          border-radius: 4px;
          outline: none;
          margin: 2rem 12px;
          position: relative;
        }

        .price-markers {
          display: flex;
          justify-content: space-between;
          width: calc(100% - 24px);
          margin: 1rem auto 0;
          position: relative;
          padding: 0;
        }

        .price-markers::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e2e8f0;
          z-index: -1;
        }

        .price-marker {
          font-size: 1rem;
          color: #718096;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          padding-top: 1rem;
          text-align: center;
          flex: 1;
          transform-origin: top center;
        }

        .price-marker::before {
          content: '';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 8px;
          background: #cbd5e0;
        }

        .price-marker:first-child {
          text-align: left;
        }

        .price-marker:last-child {
          text-align: right;
        }

        .price-marker.active {
          color: #4299e1;
          font-weight: 600;
          transform: scale(1.1);
        }

        .price-marker.active::before {
          background: #4299e1;
          height: 10px;
        }

        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #4299e1;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #3182ce;
        }

        .price-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #4299e1;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .price-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          background: #3182ce;
        }

        .tier-price {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 1.5rem;
        }

        @media (max-width: 640px) {
          .slider-container {
            padding: 0;
          }

          .price-slider {
            width: calc(100% - 16px);
            margin: 1.5rem 8px;
          }

          .price-markers {
            width: calc(100% - 16px);
          }

          .price-marker {
            font-size: 0.875rem;
          }

          .price-amount {
            font-size: 2.5rem;
          }

          .price-period {
            font-size: 1rem;
          }

          .price-slider::-webkit-slider-thumb {
            width: 20px;
            height: 20px;
          }

          .price-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
          }
        }

        @media (max-width: 380px) {
          .price-marker {
            font-size: 0.75rem;
          }

          .slider-container {
            padding: 0;
          }
        }

        .error-message {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          text-align: center;
        }
      `}</style>
    </TemplatePage>
  )
} 
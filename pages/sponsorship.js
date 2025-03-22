import TemplatePage from '../components/TemplatePage'
import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Sponsorship() {
  const [loading, setLoading] = useState(true);
  const stripeContainerRef = useRef(null);
  const stripeInitialized = useRef(false);

  useEffect(() => {
    // Client-side code for Sponsorship page
    const loadScripts = async () => {
      // Only initialize Stripe once
      if (stripeInitialized.current) return;

      // Function to create stripe button
      const createStripeButton = () => {
        if (!stripeContainerRef.current || stripeInitialized.current) return;
        
        // Get container and clear it
        const container = stripeContainerRef.current;
        container.innerHTML = '';
        
        // Create a custom container to prevent auto-initialization
        const customContainer = document.createElement('div');
        customContainer.id = 'custom-stripe-container';
        container.appendChild(customContainer);
        
        // Create stripe button manually
        const stripeBuyButton = document.createElement('stripe-buy-button');
        stripeBuyButton.setAttribute('buy-button-id', 'buy_btn_1QJlViJOUX0qB6cCvUZ0hBUX');
        stripeBuyButton.setAttribute('publishable-key', 'pk_live_51IRtXuJOUX0qB6cCpzTTp982wIxr0zmR5xv7U79jAGLFuO7J3DJipFUezg1M2q67MABnewnfRUwXadgUnOO1tjjd00uHUj8bS9');
        
        // Add button to custom container
        customContainer.appendChild(stripeBuyButton);
        
        // Mark as initialized
        stripeInitialized.current = true;
      };

      // First remove any existing Stripe scripts to avoid duplicates
      const existingScripts = document.querySelectorAll('script[src*="stripe.com"]');
      existingScripts.forEach(script => script.remove());

      // Load Stripe script
      const stripeScript = document.createElement('script');
      stripeScript.async = true;
      stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
      
      // Set loading to false and create button after stripe loads
      stripeScript.onload = () => {
        setTimeout(() => {
          setLoading(false);
          createStripeButton();
        }, 500);
      };
      
      document.body.appendChild(stripeScript);

      // Load contributors.js if it exists
      if (typeof window !== 'undefined') {
        try {
          // Dynamically load the contributors script
          const contributorsModule = await import('../utils/contributors');
          if (contributorsModule.default) {
            contributorsModule.default();
          }
        } catch (error) {
          console.warn('Contributors script not found or error loading:', error);
        }
      }
    };

    // Cleanup and initialize
    const cleanup = () => {
      if (stripeContainerRef.current) {
        stripeContainerRef.current.innerHTML = '';
      }
      stripeInitialized.current = false;
    };

    cleanup();
    loadScripts();
    
    // Cleanup function
    return cleanup;
  }, []);

  return (
    <TemplatePage title="Sponsorship - EDR Telemetry Project">
      <Head>
      </Head>

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
                      <div className="stripe-container" ref={stripeContainerRef}></div>
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
                  <div className="tier-badge">Basic</div>
                  <div className="popular-tag">Popular</div>
                  <h4 className="tier-name">Supporter</h4>
                  <div className="tier-price">
                    <span className="price-amount">$50</span>
                    <span className="price-period">/month</span>
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>
                      <span>Private Discord channel invitation</span>
                    </li>
                    <li>
                      <span>Recognition on our website</span>
                    </li>
                    <li>
                      <span>Monthly newsletter</span>
                    </li>
                    <li>
                      <span>Early access to articles</span>
                    </li>
                  </ul>
                </div>
                <div className="tier-footer">
                  <a href="https://buy.stripe.com/14k2a92vg8gka1acMM" className="tier-button-link">Become a Supporter</a>
                </div>
              </div>

              <div className="tier-card">
                <div className="tier-header">
                  <div className="tier-badge">Pro</div>
                  <h4 className="tier-name">Professional Partner</h4>
                  <div className="tier-price">
                  </div>
                </div>
                <div className="tier-content">
                  <ul className="tier-features">
                    <li>
                      <span>All Basic Supporter benefits</span>
                    </li>
                    <li>
                      <span>Priority feature requests</span>
                    </li>
                    <li>
                      <span>Quarterly strategic project updates</span>
                    </li>
                    <li>
                      <span>Early beta access to new platforms</span>
                    </li>
                  </ul>
                </div>
                <div className="tier-footer">
                <a href="/contact" className="tier-button-link">Contact Us</a>
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
                      <span>All Professional benefits</span>
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
    </TemplatePage>
  )
} 
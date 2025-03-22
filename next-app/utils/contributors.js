/**
 * Utility to load and display sponsors and one-time supporters
 */

const OWNER = 'tsale'; // Replace with your GitHub username
const REPOSITORY = 'EDR-Telemetry'; // Replace with your repository name

// Sample contributor data - replace with API call or actual data source
const SPONSORS = [
  {
    name: 'Acme Security',
    tier: 'Enterprise',
    logo: '/images/sponsors/acme.png',
    url: 'https://example.com/acme'
  },
  {
    name: 'SecureTech',
    tier: 'Professional',
    logo: '/images/sponsors/securetech.png',
    url: 'https://example.com/securetech'
  }
];

const ONE_TIME_DONORS = [
  {
    name: "Tanisha L. Turner",
    handle: "cybersecdiva",
    twitter: "cybersecdiva",
    linkedin: "tanisha-l-t-079a7b17"
  },
  {
    name: "Anonymous",
  },
  {
    name: "Spiros Antonatos",
    linkedin: "antonatos"
  },
  {
    name: "Anonymous",
    handle: "anonymous"
  }
];

const SUBSCRIBERS = {
  professional: [
    {
      name: "Alice Johnson",
      avatar: "https://unavatar.io/github/alice",
      github: "alice"
    },
    {
      name: "David Wilson",
      avatar: "https://unavatar.io/github/david",
      github: "david"
    }
  ],
  supporter: [
    {
      name: "Bob Smith",
      avatar: "https://unavatar.io/github/bob",
      github: "bob"
    },
    {
      name: "Eve Anderson",
      avatar: "https://unavatar.io/github/eve",
      github: "eve"
    }
  ],
  basic: [
    {
      name: "Charlie Brown",
      avatar: "https://unavatar.io/github/charlie",
      github: "charlie"
    }
  ]
};

/**
 * Fetches contributors from GitHub repository
 * @returns {string} HTML markup for contributors list
 */
async function fetchContributors() {
  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPOSITORY}/contributors`);
    if (!response.ok) {
      throw new Error(`Failed to fetch contributors: ${response.status}`);
    }
    const contributors = await response.json();
    return renderContributors(contributors);
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return '<p class="error-message">Failed to load contributors</p>';
  }
}

/**
 * Renders GitHub contributors
 * @param {Array} contributors - GitHub contributors data
 * @returns {string} HTML markup for contributors
 */
function renderContributors(contributors) {
  return `
    <div class="contributors-grid">
      ${contributors.map(contributor => `
        <a href="${contributor.html_url}" target="_blank" class="contributor-link">
          <img src="${contributor.avatar_url}" alt="${contributor.login}" 
                class="contributor-avatar" loading="lazy" />
          <span class="contributor-name">${contributor.login}</span>
          <span class="commit-count">${contributor.contributions} commits</span>
        </a>
      `).join('')}
    </div>
  `;
}

/**
 * Renders sponsor cards
 * @param {Array} sponsors - List of sponsor objects
 * @returns {string} HTML markup for sponsor cards
 */
function renderSponsors(sponsors) {
  if (!sponsors || sponsors.length === 0) {
    return '<p class="no-sponsors">No sponsors yet. <a href="#monthly">Become our first sponsor!</a></p>';
  }

  return sponsors.map(sponsor => `
    <div class="sponsor-card">
      <a href="${sponsor.url}" target="_blank" rel="noopener noreferrer">
        ${sponsor.logo ? 
          `<img src="${sponsor.logo}" alt="${sponsor.name} logo" class="sponsor-logo">` : 
          `<div class="sponsor-name-logo">${sponsor.name.charAt(0)}</div>`
        }
        <div class="sponsor-details">
          <h4>${sponsor.name}</h4>
          <span class="sponsor-tier">${sponsor.tier} Sponsor</span>
        </div>
      </a>
    </div>
  `).join('');
}

/**
 * Renders one-time donor cards
 * @param {Array} donors - List of donor objects
 * @returns {string} HTML markup for donor cards
 */
function renderDonors() {
  if (!ONE_TIME_DONORS || ONE_TIME_DONORS.length === 0) {
    return '<p class="no-donors">No one-time supporters yet. <a href="#one-time">Become our first supporter!</a></p>';
  }

  return `
    <div class="donors-grid">
      ${ONE_TIME_DONORS.map(donor => `
        <div class="donor-card">
          <img src="${donor.twitter ? `https://unavatar.io/twitter/${donor.twitter}` : '/images/edr-telemetry-logo.png'}" 
                alt="${donor.name}" 
                class="donor-avatar" 
                onerror="this.src='/images/edr_telemetry_logo.png'"
          />
          <div class="donor-info">
            <div class="donor-name">${donor.name}</div>
            ${donor.handle ? `<div class="donor-handle">@${donor.handle}</div>` : ''}
            <div class="donor-social">
              ${donor.twitter ? `
                <a href="https://twitter.com/${donor.twitter}" class="social-link twitter" title="Twitter">
                  <svg class="social-icon" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                  </svg>
                </a>
              ` : ''}
              ${donor.linkedin ? `
                <a href="https://linkedin.com/in/${donor.linkedin}" class="social-link linkedin" title="LinkedIn">
                  <svg class="social-icon" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                  </svg>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Renders subscribers section
 * @returns {string} HTML markup for subscribers section
 */
function renderSubscribers() {
  const subscribers = [
    { 
      name: "Tanisha L. Turner",
      handle: "cybersecdiva", 
      linkedin: "tanisha-l-t-079a7b17",
      twitter: "cybersecdiva",
      tier: "basic"
    },
    {
      name: "Daniel Koifman",
      linkedin: "daniel-koifman-61072218b",
      customImage: "https://media.licdn.com/dms/image/v2/D4D03AQFubXcH8Y2myw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1693372981400?e=1740614400&v=beta&t=ROKPDzdKaEH2nDpYNJuZhrxMm6yF2ou2M1S1LPySwbg",
      tier: "basic"
    }
  ];

  const tierBadges = {
    professional: '👑 Pro',
    supporter: '⭐ Supporter',
    basic: '💫 Basic'
  };

  return `
    <div class="subscribers-grid">
      ${subscribers.map(subscriber => `
        <div class="subscriber-item ${subscriber.tier}">
          <img src="${subscriber.twitter ? `https://unavatar.io/twitter/${subscriber.handle}` : (subscriber.customImage || '/images/edr_telemetry_logo.png')}" 
                alt="${subscriber.handle ? `@${subscriber.handle}` : subscriber.name}" 
                class="subscriber-avatar"
                onerror="this.src='/images/edr_telemetry_logo.png'" />
          <div class="subscriber-info">
            <div class="subscriber-tier">${tierBadges[subscriber.tier]}</div>
            <div class="subscriber-name" title="${subscriber.name}">${subscriber.name}</div>
            ${subscriber.handle ? `<div class="subscriber-handle">@${subscriber.handle}</div>` : ''}
            <div class="subscriber-social" style="position: relative; z-index: 2;">
              ${subscriber.twitter ? `
                <a href="https://twitter.com/${subscriber.twitter}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="social-link twitter" 
                    title="Follow on Twitter"
                    onclick="event.stopPropagation();">
                  <svg class="social-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                  </svg>
                </a>
              ` : ''}
              ${subscriber.linkedin ? `
                <a href="https://www.linkedin.com/in/${subscriber.linkedin}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="social-link linkedin" 
                    title="Connect on LinkedIn"
                    onclick="event.stopPropagation();">
                  <svg class="social-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                  </svg>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Renders all sponsors, includes corporate sponsors and subscribers
 */
async function fetchSponsors() {
  return `
    <div class="sponsors-wrapper">
      <section class="sponsors-section">
        <div class="sponsors-header">
          <h3>Enterprise Sponsors</h3>
          <p>Organizations supporting our mission</p>
        </div>
        <div class="sponsors-grid">
          <div class="sponsor-placeholder">
            <h4>Your Logo Here</h4>
            <p>Become our first Enterprise Sponsor</p>
          </div>
          <div class="become-member">
            <h4>Become an Enterprise Sponsor</h4>
            <p>Partner with us and support the development of EDR Telemetry</p>
            <a href="/sponsorship#monthly" class="cta-button">Learn More</a>
          </div>
        </div>
      </section>

      <section class="sponsors-section">
        <div class="sponsors-header">
          <h3>Our Subscribers</h3>
          <p>Individual supporters and contributors</p>
        </div>
        <div class="sponsors-grid">
          <div class="subscribers-grid">
            ${renderSubscribers()}
          </div>
          <div class="become-member">
            <h4>Join Our Community</h4>
            <p>Support the project and get access to exclusive content</p>
            <a href="/sponsorship#monthly" class="cta-button">Become a Subscriber</a>
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * Initializes the contributors display
 */
export default function initContributors() {
  if (typeof window === 'undefined') return;
  
  // Simulate loading delay
  setTimeout(async () => {
    const contributorsSection = document.getElementById('contributorsSection');
    const sponsorsSection = document.getElementById('sponsorsSection');
    const donorsSection = document.getElementById('donorsSection');
    
    if (contributorsSection) {
      contributorsSection.innerHTML = await fetchContributors();
    }
    
    if (sponsorsSection) {
      sponsorsSection.innerHTML = await fetchSponsors();
    }
    
    if (donorsSection) {
      donorsSection.innerHTML = renderDonors();
    }
    
    // Initialize stripe buy button for one-time donations
    const stripeOneTimeContainer = document.getElementById('stripe-one-time-container');
    if (stripeOneTimeContainer) {
      const stripeBuyButton = document.createElement('stripe-buy-button');
      stripeBuyButton.setAttribute('buy-button-id', 'buy_btn_1QJlViJOUX0qB6cCvUZ0hBUX');
      stripeBuyButton.setAttribute('publishable-key', 'pk_live_51IRtXuJOUX0qB6cCpzTTp982wIxr0zmR5xv7U79jAGLFuO7J3DJipFUezg1M2q67MABnewnfRUwXadgUnOO1tjjd00uHUj8bS9');
      
      stripeOneTimeContainer.appendChild(stripeBuyButton);
    }
  }, 1000);
} 
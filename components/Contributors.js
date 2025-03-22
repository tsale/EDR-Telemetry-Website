import { useState, useEffect } from 'react';

const OWNER = 'tsale'; // Replace with GitHub username
const REPOSITORY = 'EDR-Telemetry'; // Replace with repository name

export default function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState({
    contributors: true,
    sponsors: true,
    donors: true
  });
  
  useEffect(() => {
    // Fetch contributors from GitHub
    const fetchContributors = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPOSITORY}/contributors`);
        if (!response.ok) {
          throw new Error(`Failed to fetch contributors: ${response.status}`);
        }
        const data = await response.json();
        setContributors(data);
        setLoading(prev => ({ ...prev, contributors: false }));
      } catch (error) {
        console.error('Error fetching contributors:', error);
        setLoading(prev => ({ ...prev, contributors: false }));
      }
    };

    fetchContributors();
    
    // Simulate loading sponsors and donors (would be fetched from API in production)
    setTimeout(() => {
      setLoading(prev => ({ ...prev, sponsors: false, donors: false }));
    }, 1000);
  }, []);

  // Static subscriber data (this would be loaded from an API in production)
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

  // Static donor data (this would be loaded from an API in production)
  const donors = [
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

  const tierBadges = {
    professional: '👑 Pro',
    supporter: '⭐ Supporter',
    basic: '💫 Basic'
  };

  return (
    <div className="community-section">
      <div className="container">
        <div className="section-group">
          <h2>Project Contributors</h2>
          <div className="section-content">
            {loading.contributors ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading contributors...</p>
              </div>
            ) : (
              <div className="contributors-grid">
                {contributors.map(contributor => (
                  <a key={contributor.id} href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="contributor-link">
                    <img src={contributor.avatar_url} alt={contributor.login} className="contributor-avatar" loading="lazy" />
                    <span className="contributor-name">{contributor.login}</span>
                    <span className="commit-count">{contributor.contributions} commits</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="section-group">
          <h2>Our Sponsors</h2>
          <div className="section-content">
            {loading.sponsors ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading sponsors...</p>
              </div>
            ) : (
              <div className="sponsors-wrapper">
                <section className="sponsors-section">
                  <div className="sponsors-header">
                    <h3>Enterprise Sponsors</h3>
                    <p>Organizations supporting our mission</p>
                  </div>
                  <div className="sponsors-grid">
                    <div className="sponsor-placeholder">
                      <h4>Your Logo Here</h4>
                      <p>Become our first Enterprise Sponsor</p>
                    </div>
                    <div className="become-member">
                      <h4>Become an Enterprise Sponsor</h4>
                      <p>Partner with us and support the development of EDR Telemetry</p>
                      <a href="/sponsorship#monthly" className="cta-button">Learn More</a>
                    </div>
                  </div>
                </section>

                <section className="sponsors-section">
                  <div className="sponsors-header">
                    <h3>Our Subscribers</h3>
                    <p>Individual supporters and contributors</p>
                  </div>
                  <div className="sponsors-grid">
                    <div className="subscribers-grid">
                      {subscribers.map((subscriber, index) => (
                        <div key={index} className={`subscriber-item ${subscriber.tier}`}>
                          <img 
                            src={subscriber.twitter 
                              ? `https://unavatar.io/twitter/${subscriber.twitter}` 
                              : (subscriber.customImage || '/images/edr_telemetry_logo.png')} 
                            alt={`@${subscriber.handle || subscriber.name}`} 
                            className="subscriber-avatar"
                            onError={(e) => { e.target.src = '/images/edr_telemetry_logo.png' }}
                          />
                          <div className="subscriber-info">
                            <div className="subscriber-tier">{tierBadges[subscriber.tier]}</div>
                            <div className="subscriber-name" title={subscriber.name}>{subscriber.name}</div>
                            {subscriber.handle && <div className="subscriber-handle">@{subscriber.handle}</div>}
                            <div className="subscriber-social">
                              {subscriber.twitter && (
                                <a 
                                  href={`https://twitter.com/${subscriber.twitter}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="social-link twitter" 
                                  title="Follow on Twitter"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg className="social-icon" viewBox="0 0 16 16" fill="white" style={{fill: 'white'}}>
                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                                  </svg>
                                </a>
                              )}
                              {subscriber.linkedin && (
                                <a 
                                  href={`https://www.linkedin.com/in/${subscriber.linkedin}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="social-link linkedin" 
                                  title="Connect on LinkedIn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg className="social-icon" viewBox="0 0 16 16" fill="white" style={{fill: 'white'}}>
                                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="become-member">
                      <h4>Join Our Community</h4>
                      <p>Support the project and get access to exclusive content</p>
                      <a href="/sponsorship#monthly" className="cta-button">Become a Subscriber</a>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>

        <div className="section-group">
          <h2>One-Time Supporters</h2>
          <div className="section-content">
            {loading.donors ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading supporters...</p>
              </div>
            ) : (
              <div className="donors-grid">
                {donors.map((donor, index) => (
                  <div key={index} className="donor-card">
                    <img 
                      src={donor.twitter ? `https://unavatar.io/twitter/${donor.twitter}` : '/images/edr_telemetry_logo.png'} 
                      alt={donor.name} 
                      className="donor-avatar" 
                      onError={(e) => { e.target.src = '/images/edr_telemetry_logo.png' }}
                    />
                    <div className="donor-info">
                      <div className="donor-name" title={donor.name}>{donor.name}</div>
                      {donor.handle && <div className="donor-handle" title={`@${donor.handle}`}>@{donor.handle}</div>}
                      <div className="donor-social">
                        {donor.twitter && (
                          <a href={`https://twitter.com/${donor.twitter}`} className="social-link twitter" title="Twitter">
                            <svg className="social-icon" viewBox="0 0 16 16" fill="white" style={{fill: 'white'}}>
                              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                            </svg>
                          </a>
                        )}
                        {donor.linkedin && (
                          <a href={`https://linkedin.com/in/${donor.linkedin}`} className="social-link linkedin" title="LinkedIn">
                            <svg className="social-icon" viewBox="0 0 16 16" fill="white" style={{fill: 'white'}}>
                              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
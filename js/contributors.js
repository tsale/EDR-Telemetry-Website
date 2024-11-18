const OWNER = 'tsale'; // Replace with your GitHub username
const REPOSITORY = 'EDR-Telemetry'; // Replace with your repository name

class ContributorsManager {
    constructor() {
        this.contributors = [];
        this.sponsors = [];
        this.oneTimeDonors = [];
    }

    async fetchContributors() {
        try {
            const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPOSITORY}/contributors`);
            if (!response.ok) {
                throw new Error(`Failed to fetch contributors: ${response.status}`);
            }
            this.contributors = await response.json();
            return this.renderContributors();
        } catch (error) {
            console.error('Error fetching contributors:', error);
            return '<p class="error-message">Failed to load contributors</p>';
        }
    }

    renderContributors() {
        return `
            <div class="contributors-grid">
                ${this.contributors.map(contributor => `
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

    async fetchSponsors() {
        return `
            <div class="sponsors-section">
                        <h3>Become Our First Sponsor! 🌟</h3>
                        <p>Support this open-source project and help shape the future of EDR telemetry research.</p>
                        <a href="sponsorship.html" class="sponsor-button">
                            Become a Sponsor
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 3.5l4.5 4.5-4.5 4.5M3.5 8h9"/>
                            </svg>
                        </a>
            </div>
        `;
    }

    async fetchOneTimeDonors() {
        const donors = [
            {
                name: "Tanisha",
                twitter: "cybersecdiva",
                linkedin: "tanisha-l-t-079a7b17"
            },
            {
                name: "Anonymous"
            },
            {
                name: "Spiros Antonatos",
                linkedin: "antonatos"
            },
            {
                name: "Anonymous"
            }
        ];

        const donorsHtml = donors.map(donor => `
            <div class="donor-card">
                <img 
                    src="${donor.twitter ? `https://unavatar.io/twitter/${donor.twitter}` : './images/edr-telemetry-logo.png'}" 
                    alt="${donor.name}" 
                    class="donor-avatar" 
                    onerror="this.src='./images/edr_telemetry_logo.png'"
                />
                <div class="donor-info">
                    <div class="donor-name">${donor.name}</div>
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
        `).join('');

        return `
            <div class="donors-grid">
                ${donorsHtml}
            </div>
        `;
    }

    async initializeAll() {
        const contributorsSection = document.getElementById('contributorsSection');
        const sponsorsSection = document.getElementById('sponsorsSection');
        const donorsSection = document.getElementById('donorsSection');

        if (contributorsSection) {
            contributorsSection.innerHTML = await this.fetchContributors();
        }
        if (sponsorsSection) {
            sponsorsSection.innerHTML = await this.fetchSponsors();
        }
        if (donorsSection) {
            donorsSection.innerHTML = await this.fetchOneTimeDonors();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const manager = new ContributorsManager();
    manager.initializeAll();
});
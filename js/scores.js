let currentPlatform = 'windows';
let windowsTelemetryData = null;
let linuxTelemetryData = null;

// Load both Windows and Linux data
async function loadAllTelemetryData() {
    try {
        // Load Windows data
        const windowsResponse = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json');
        windowsTelemetryData = await windowsResponse.json();

        // Load Linux data
        const linuxResponse = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json');
        linuxTelemetryData = await linuxResponse.json();

        // Display initial scores (Windows by default)
        displayPlatformScores('windows');
    } catch (error) {
        console.error('Error loading telemetry data:', error);
        document.getElementById('scoreTableContainer').innerHTML = `
            <div class="error-message">
                <h3>Error loading data</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Display scores for selected platform
function displayPlatformScores(platform) {
    const data = platform === 'windows' ? windowsTelemetryData : linuxTelemetryData;
    if (!data) {
        console.error(`No data available for ${platform}`);
        return;
    }

    const scores = calculateScores(data, platform);
    const containerDiv = document.getElementById('scoreTableContainer');
    containerDiv.innerHTML = '';

    // Create score section container
    const scoreSection = document.createElement('div');
    scoreSection.className = 'score-section';
    
    // Create table with modern styling
    const table = document.createElement('table');
    table.className = 'scores-table';
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>EDR Solution</th>
            <th>Score</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body with enhanced styling
    const tbody = document.createElement('tbody');
    scores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.className = index < 3 ? `rank-${index + 1}` : '';
        
        // Create rank cell with medal for top 3
        const rankDisplay = index < 3 ? 
            `<span class="rank-medal">${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>` : 
            `${index + 1}`;

        row.innerHTML = `
            <td>${rankDisplay}</td>
            <td>
                <div class="edr-name-cell">
                    <span class="edr-name">${entry.edr}</span>
                    <span class="platform-badge ${platform}">${platform}</span>
                </div>
            </td>
            <td class="score-value">${entry.score.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    scoreSection.appendChild(table);

    // Add statistics section
    const statsSection = document.createElement('div');
    statsSection.className = 'score-stats';
    
    const avgScore = scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length;
    const maxScore = Math.max(...scores.map(s => s.score));
    const minScore = Math.min(...scores.map(s => s.score));

    statsSection.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Average Score</h4>
                <div class="stat-value">${avgScore.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h4>Highest Score</h4>
                <div class="stat-value">${maxScore.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h4>Lowest Score</h4>
                <div class="stat-value">${minScore.toFixed(2)}</div>
            </div>
        </div>
    `;

    containerDiv.appendChild(scoreSection);
    containerDiv.appendChild(statsSection);
}

// Initialize tabs and event listeners
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current platform and display scores
            currentPlatform = button.dataset.os;
            displayPlatformScores(currentPlatform);
        });
    });
    
    // Load data
    loadAllTelemetryData();
});

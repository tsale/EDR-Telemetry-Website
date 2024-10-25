// Initialize variables
let telemetryData = [];
let hoverEnabled = localStorage.getItem('hoverEnabled') === 'true'; // Retrieve saved hover state

// Define the scoring dictionaries
const FEATURES_DICT_VALUED = {
    "Yes": 1,
    "No": 0,
    "Via EnablingTelemetry": 1,
    "Partially": 0.5,
    "Via EventLogs": 0.75,
    "Pending Response": 0
};

const CATEGORIES_VALUED = {
    "Process Creation": 1,
    "Process Termination": 0.5,
    "Process Access": 1,
    "Image/Library Loaded": 1,
    "Remote Thread Creation": 1,
    "Process Tampering Activity": 1,
    "File Creation": 1,
    "File Opened": 1,
    "File Deletion": 1,
    "File Modification": 1,
    "File Renaming": 0.7,
    "Local Account Creation": 1,
    "Local Account Modification": 1,
    "Local Account Deletion": 0.5,
    "Account Login": 0.7,
    "Account Logoff": 0.4,
    "TCP Connection": 1,
    "UDP Connection": 1,
    "URL": 1,
    "DNS Query": 1,
    "File Downloaded": 1,
    "MD5": 1,
    "SHA": 1,
    "IMPHASH": 1,
    "Key/Value Creation": 1,
    "Key/Value Modification": 1,
    "Key/Value Deletion": 0.7,
    "Scheduled Task Creation": 0.7,
    "Scheduled Task Modification": 0.7,
    "Scheduled Task Deletion": 0.5,
    "Service Creation": 1,
    "Service Modification": 0.7,
    "Service Deletion": 0.6,
    "Driver Loaded": 1,
    "Driver Modification": 1,
    "Driver Unloaded": 1,
    "Virtual Disk Mount": 0.5,
    "USB Device Unmount": 0.7,
    "USB Device Mount": 1,
    "Group Policy Modification": 0.3,
    "Pipe Creation": 0.8,
    "Pipe Connection": 1,
    "Agent Start": 0.2,
    "Agent Stop": 0.8,
    "Agent Install": 0.2,
    "Agent Uninstall": 1,
    "Agent Keep-Alive": 0.2,
    "Agent Errors": 0.2,
    "WmiEventConsumerToFilter": 1,
    "WmiEventConsumer": 1,
    "WmiEventFilter": 1,
    "BIT JOBS Activity": 1,
    "Script-Block Activity": 1
};

// Function to load telemetry data
async function loadTelemetry() {
    if (telemetryData.length > 0) {
        return; // Data already loaded
    }
    try {
        const response = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        telemetryData = await response.json();
    } catch (error) {
        const contentDiv = document.getElementById('content') || document.getElementById('scoreTableContainer');
        contentDiv.innerHTML = `<p>Error loading telemetry data: ${error.message}</p>`;
    }
}

// Function to populate filter options
function populateFilterOptions() {
    // Clear existing options
    const filterSelect = document.getElementById('edrFilter');
    const comparisonSelect = document.getElementById('comparisonMode');
    filterSelect.innerHTML = '<option value="all">All</option>';
    comparisonSelect.innerHTML = '';

    const edrHeaders = Object.keys(telemetryData[0]).filter(key => key !== 'Telemetry Feature Category' && key !== 'Sub-Category');
    edrHeaders.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        filterSelect.appendChild(option);

        const compareOption = document.createElement('option');
        compareOption.value = header;
        compareOption.textContent = header;
        comparisonSelect.appendChild(compareOption);
    });

    // Event listener for EDR filter
    filterSelect.addEventListener('change', () => {
        const selectedEDR = filterSelect.value;
        displayTelemetry(telemetryData, selectedEDR);
    });

    // Event listener for compare button
    document.getElementById('compareButton').addEventListener('click', () => {
        const selectedEDRs = Array.from(comparisonSelect.selectedOptions).map(option => option.value);
        if (selectedEDRs.length > 0) {
            displayTelemetry(telemetryData, 'all', selectedEDRs, true);
        } else {
            alert('Please select at least one EDR for comparison.');
        }
    });

    // Event listener for show scores button
    document.getElementById('showScoresButton').addEventListener('click', () => {
        window.location.href = 'scores.html';
    });

    // Event listener for back button
    document.getElementById('backButton').addEventListener('click', () => {
        displayTelemetry(telemetryData);
        document.getElementById('backButton').classList.add('hidden');
    });

    // Event listener for hover toggle
    const hoverToggle = document.getElementById('hoverToggle');
    hoverToggle.checked = hoverEnabled; // Set the checkbox based on saved state
    hoverToggle.addEventListener('change', function() {
        hoverEnabled = this.checked;
        localStorage.setItem('hoverEnabled', hoverEnabled); // Save state
        addHoverEffect(); // Apply or remove hover effects immediately
    });
}

// Function to display telemetry data
function displayTelemetry(data, filter = 'all', comparison = [], isComparisonMode = false) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    const edrHeaders = Object.keys(data[0]).filter(key => key !== 'Telemetry Feature Category' && key !== 'Sub-Category');

    // Determine which headers to display
    let displayedHeaders;
    if (comparison.length > 0) {
        displayedHeaders = comparison;
    } else if (filter !== 'all') {
        displayedHeaders = [filter];
    } else {
        displayedHeaders = edrHeaders;
    }

    // Create table
    const table = document.createElement('table');
    table.id = 'telemetryTable';

    // Create thead and tbody elements
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Telemetry Feature Category</th><th>Sub-Category</th>`;
    displayedHeaders.forEach((header, index) => {
        headerRow.innerHTML += `<th data-col-index="${index}">${header}</th>`;
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create data rows
    data.forEach((entry, rowIndex) => {
        const row = document.createElement('tr');
        row.innerHTML += `<td>${entry['Telemetry Feature Category'] || ''}</td>`;
        row.innerHTML += `<td>${entry['Sub-Category'] || ''}</td>`;

        displayedHeaders.forEach((header, colIndex) => {
            const cell = document.createElement('td');
            cell.dataset.rowIndex = rowIndex + 1; // +1 to account for header row
            cell.dataset.colIndex = colIndex + 2; // +2 to account for first two columns

            const status = entry[header];
            cell.innerHTML = `<span class="status-${status.replace(/\s+/g, '')}" data-tooltip="${status}">${getStatusIcon(status)}</span>`;

            if (isComparisonMode) {
                cell.dataset.status = status;
            }

            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    contentDiv.appendChild(table);

    if (isComparisonMode && displayedHeaders.length > 1) {
        highlightDifferences(table, displayedHeaders.length);
    }

    // Add hover effect
    addHoverEffect();

    if (filter !== 'all' || comparison.length > 0) {
        document.getElementById('backButton').classList.remove('hidden');
    } else {
        document.getElementById('backButton').classList.add('hidden');
    }
}

// Function to get status icon
function getStatusIcon(status) {
    switch (status) {
        case "Yes":
            return "✅";
        case "No":
            return "❌";
        case "Partially":
            return "⚠️";
        case "Pending Response":
            return "❓";
        case "Via EventLogs":
            return "🪵";
        case "Via EnablingTelemetry":
            return "🎚️";
        default:
            return "";
    }
}

// Function to highlight differences in comparison mode
function highlightDifferences(table, numEDRs) {
    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) { // Skip header row
        const cells = rows[i].getElementsByTagName('td');
        let statuses = [];
        for (let j = 2; j < cells.length; j++) { // Skip first two columns
            const cell = cells[j];
            statuses.push(cell.dataset.status);
        }
        if (statuses.some(status => status !== statuses[0])) {
            // Highlight cells that are different
            for (let j = 2; j < cells.length; j++) {
                cells[j].classList.add('difference');
            }
        }
    }
}

// Function to display scores on scores page
function displayScoresOnScoresPage() {
    const contentDiv = document.getElementById('scoreTableContainer');
    contentDiv.innerHTML = '';
    const scores = calculateScores(telemetryData);

    if (!scores) {
        contentDiv.innerHTML = '<p>Scores data not available.</p>';
        return;
    }

    // Create table
    const table = document.createElement('table');
    table.id = 'scoreTable'; // Changed ID to 'scoreTable' to avoid conflicts

    // Create thead and tbody elements
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Rank</th><th>EDR</th><th>Score</th>`;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create score rows
    scores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${entry.edr}</td><td>${entry.score.toFixed(2)}</td>`;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    contentDiv.appendChild(table);
}

// Function to calculate scores
function calculateScores(data) {
    const edrHeaders = Object.keys(data[0]).filter(
        key => key !== 'Telemetry Feature Category' && key !== 'Sub-Category'
    );

    // Initialize scores object for each EDR
    let scores = edrHeaders.map(edr => ({ edr: edr, score: 0 }));

    data.forEach(entry => {
        const subCategory = entry['Sub-Category'];
        const featureWeight = CATEGORIES_VALUED[subCategory] || 0;

        edrHeaders.forEach((edr, index) => {
            const status = entry[edr];
            const statusValue = FEATURES_DICT_VALUED[status] !== undefined ? FEATURES_DICT_VALUED[status] : 0;
            const scoreIncrement = statusValue * featureWeight;
            scores[index].score += scoreIncrement;
        });
    });

    // Sort scores in descending order
    scores.sort((a, b) => b.score - a.score);

    return scores;
}

// Function to add hover effect
function addHoverEffect() {
    const table = document.getElementById('telemetryTable');
    if (!table) return;
    const cells = table.getElementsByTagName('td');
    const headers = table.getElementsByTagName('th');

    // Remove existing event listeners if any
    for (let cell of cells) {
        cell.onmouseenter = null;
        cell.onmouseleave = null;
    }
    for (let header of headers) {
        header.onmouseenter = null;
        header.onmouseleave = null;
    }

    if (hoverEnabled) {
        for (let cell of cells) {
            cell.addEventListener('mouseenter', function() {
                const rowIndex = cell.parentElement.rowIndex;
                const colIndex = cell.cellIndex;

                // Highlight row
                const row = table.rows[rowIndex];
                for (let cell of row.cells) {
                    cell.classList.add('highlight-row');
                }

                // Highlight column
                for (let i = 0; i < table.rows.length; i++) {
                    const cell = table.rows[i].cells[colIndex];
                    if (cell) {
                        cell.classList.add('highlight-column');
                    }
                }

                // Highlight current cell
                cell.classList.add('highlight-cell');
            });

            cell.addEventListener('mouseleave', function() {
                const rowIndex = cell.parentElement.rowIndex;
                const colIndex = cell.cellIndex;

                // Remove highlight from row
                const row = table.rows[rowIndex];
                for (let cell of row.cells) {
                    cell.classList.remove('highlight-row');
                }

                // Remove highlight from column
                for (let i = 0; i < table.rows.length; i++) {
                    const cell = table.rows[i].cells[colIndex];
                    if (cell) {
                        cell.classList.remove('highlight-column');
                    }
                }

                // Remove highlight from current cell
                cell.classList.remove('highlight-cell');
            });
        }

        // Add hover effect to EDR header cells
        for (let i = 2; i < headers.length; i++) { // Start from 2 to skip first two headers
            let headerCell = headers[i];
            headerCell.addEventListener('mouseenter', function() {
                const colIndex = headerCell.cellIndex;

                // Highlight column
                for (let i = 0; i < table.rows.length; i++) {
                    const cell = table.rows[i].cells[colIndex];
                    if (cell) {
                        cell.classList.add('highlight-column');
                    }
                }

                // Highlight current header cell
                headerCell.classList.add('highlight-cell');
            });

            headerCell.addEventListener('mouseleave', function() {
                const colIndex = headerCell.cellIndex;

                // Remove highlight from column
                for (let i = 0; i < table.rows.length; i++) {
                    const cell = table.rows[i].cells[colIndex];
                    if (cell) {
                        cell.classList.remove('highlight-column');
                    }
                }

                // Remove highlight from current header cell
                headerCell.classList.remove('highlight-cell');
            });
        }
    }
}

// Load telemetry data when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('edrFilter')) {
        // We're on windows.html
        loadTelemetry().then(() => {
            populateFilterOptions();
            displayTelemetry(telemetryData);
        });
    } else if (document.getElementById('scoreTableContainer')) {
        // We're on scores.html
        loadTelemetry().then(() => {
            displayScoresOnScoresPage();
        });
    }
});
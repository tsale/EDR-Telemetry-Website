// Initialize variables
let linuxTelemetryData = [];
let linuxPartiallyExplanations = [];
let hoverEnabled = localStorage.getItem('hoverEnabled') === 'true'; // Retrieve saved hover state

// Add loading spinner to container
function showLoading(container) {
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading telemetry data...</p>
        </div>
    `;
}

// Validate telemetry data
function isValidTelemetryData(data) {
    return Array.isArray(data) && 
           data.length > 0 && 
           data[0].hasOwnProperty('Telemetry Feature Category') &&
           data[0].hasOwnProperty('Sub-Category');
}

// Function to sort data with Sysmon and Auditd first and group together
function sortDataWithSysmonFirst(data) {
    if (!Array.isArray(data) || !data.length) return data;
    
    const sysmonEntries = [];
    const auditdEntries = [];
    const otherEntries = [];
    
    // Separate Sysmon, Auditd and other entries
    data.forEach(entry => {
        const category = String(entry['Telemetry Feature Category'] || '');
        if (category.toLowerCase().includes('sysmon')) {
            sysmonEntries.push(entry);
        } else if (category.toLowerCase().includes('auditd')) {
            auditdEntries.push(entry);
        } else {
            otherEntries.push(entry);
        }
    });
    
    // Return combined array with Sysmon and Auditd entries first
    return [...sysmonEntries, ...auditdEntries, ...otherEntries];
}

// Function to load telemetry data
async function loadTelemetry() {
    const contentDiv = document.getElementById('content') || document.getElementById('scoreTableContainer');
    
    try {
        // Fetch both resources in parallel
        const [telemetryResponse, explanationsResponse] = await Promise.all([
            fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json'),
            fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/partially_value_explanations_linux.json')
        ]);

        if (!telemetryResponse.ok || !explanationsResponse.ok) 
            throw new Error('Network response was not ok');
        
        const [telemetry, explanations] = await Promise.all([
            telemetryResponse.json(),
            explanationsResponse.json()
        ]);

        telemetryData = sortDataWithSysmonFirst(telemetry);
        partiallyExplanations = explanations;
        return telemetryData;
    } catch (error) {
        console.error('Error loading data:', error);
        contentDiv.innerHTML = `
            <div class="error-message">
                <h3>Error loading data</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        throw error;
    }
}

// Function to populate filter options
function populateFilterOptions() {
    const filterSelect = document.querySelector('#edrFilter');
    const comparisonSelect = document.querySelector('#comparisonMode');
    
    // Return early if elements don't exist
    if (!filterSelect || !comparisonSelect) {
        console.debug('Filter elements not found');
        return;
    }

    // Get unique EDR names from telemetry data
    const edrNames = Object.keys(telemetryData[0] || {}).filter(key => 
        key !== 'Telemetry Feature Category' && 
        key !== 'Sub-Category'
    );

    // Update dropdown with EDR options
    if (edrNames.length > 0) {
        const edrDropdown = document.querySelector('.edr-dropdown');
        if (edrDropdown) {
            edrDropdown.innerHTML = edrNames.map(edr => `
                <div class="edr-option" data-edr="${edr}">
                    ${edr}
                </div>
            `).join('');
        }
    }
}

// Enhanced display function with memoization
const memoizedDisplayTelemetry = (() => {
    let lastArgs = null;
    let lastResult = null;

    return (data, filter = 'all', comparison = [], isComparisonMode = false) => {
        const argsKey = JSON.stringify({ data, filter, comparison, isComparisonMode });
        
        if (lastArgs === argsKey) {
            console.debug('Using memoized table display');
            return lastResult;
        }

        console.debug('Rendering new table configuration');
        lastArgs = argsKey;
        lastResult = displayTelemetry(data, filter, comparison, isComparisonMode);
        return lastResult;
    };
})();

// Function to display telemetry data
function displayTelemetry(data, filter = 'all', comparison = [], isComparisonMode = false) {
    if (!data || !data.length) {
        console.error('No data to display');
        return;
    }

    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;
    
    contentDiv.innerHTML = '';

    // Get headers and ensure Sysmon and Auditd are first if they exist
    const edrHeaders = Object.keys(data[0])
        .filter(key => key !== 'Telemetry Feature Category' && key !== 'Sub-Category');
    
    // Move Sysmon and Auditd to the front if they exist
    const priorityTools = ['sysmon', 'auditd'];
    priorityTools.forEach(tool => {
        const index = edrHeaders.findIndex(header => header.toLowerCase().includes(tool));
        if (index > -1) {
            const item = edrHeaders.splice(index, 1)[0];
            edrHeaders.unshift(item);
        }
    });

    // Determine which headers to display
    let displayedHeaders = comparison.length > 0 ? comparison : 
                         filter !== 'all' ? [filter] : 
                         edrHeaders;

    // Create table structure
    const table = document.createElement('table');
    table.id = 'telemetryTable';
    
    // Add comparison-mode class if in comparison mode
    if (isComparisonMode) {
        table.classList.add('comparison-mode');
    }
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Telemetry Feature Category</th>
        <th>Sub-Category</th>
        ${displayedHeaders.map((header, index) => {
            const isSysmon = header.toLowerCase().includes('sysmon');
            const isAuditd = header.toLowerCase().includes('auditd');
            const specialClass = isSysmon ? 'class="sysmon-header"' : 
                               isAuditd ? 'class="auditd-header"' : '';
            return `<th ${specialClass} data-col-index="${index}">${header}</th>`;
        }).join('')}
    `;
    
    const thead = document.createElement('thead');
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody and populate rows
    const tbody = document.createElement('tbody');
    data.forEach((entry, rowIndex) => {
        const row = document.createElement('tr');
        const category = entry['Telemetry Feature Category'] || '';
        const subcategory = entry['Sub-Category'] || '';
        
        row.innerHTML = `
            <td>${category}</td>
            <td>${subcategory}</td>
        `;

        // Add data cells for each EDR
        displayedHeaders.forEach((header, colIndex) => {
            const cell = document.createElement('td');
            const isSysmon = header.toLowerCase().includes('sysmon');
            const isAuditd = header.toLowerCase().includes('auditd');
            
            if (isSysmon) {
                cell.classList.add('sysmon-column');
            } else if (isAuditd) {
                cell.classList.add('auditd-column');
            }
            
            const status = entry[header] || '';
            cell.innerHTML = `
                <span class="status-${status.replace(/\s+/g, '')}">
                    ${getStatusIcon(status, entry['Telemetry Feature Category'], entry['Sub-Category'], header)}
                </span>
            `;
            
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
        highlightDifferences(table);
    }

    addHoverEffect();
}

// Helper function to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Function to get status icon
function getStatusIcon(status, category, subcategory, vendor) {
    // Find explanation for "Partially" status
    let explanation = '';
    if (status === "Partially" && partiallyExplanations) {
        const entry = partiallyExplanations.find(e => 
            e['Sub-Category'] === subcategory
        );
        
        // Debug log to see what we found
        console.log('Found entry:', entry);
        
        // Access the nested Partially value correctly
        if (entry && entry[vendor] && entry[vendor].Partially) {
            explanation = entry[vendor].Partially;
            console.log('Found explanation:', explanation);
        }
    }

    // Escape the explanation for use in the title attribute
    const escapedExplanation = explanation ? escapeHtml(explanation) : '';
    
    switch (status) {
        case "Yes":
            return `<span data-tooltip="Yes">✅</span>`;
        case "No":
            return `<span data-tooltip="No">❌</span>`;
        case "Partially":
            return `<span class="tooltip-trigger" data-tooltip="${escapedExplanation || 'Partially implemented'}" style="cursor: help;">⚠️</span>`;
        case "Pending Response":
            return `<span data-tooltip="Pending Response">❓</span>`;
        case "Via EnablingTelemetry":
            return `<span data-tooltip="Via EnablingTelemetry">🎚️</span>`;
        default:
            return '';
    }
}

// Function to highlight differences in comparison mode
function highlightDifferences(table) {
    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) { // Skip header row
        const cells = rows[i].getElementsByTagName('td');
        let statuses = [];
        for (let j = 2; j < cells.length; j++) { // Skip first two columns
            const cell = cells[j];
            statuses.push(cell.dataset.status);
        }
        
        // Only highlight if there are differences and more than one status
        if (statuses.length > 1 && statuses.some(status => status !== statuses[0])) {
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
    const scores = calculateScores(telemetryData, 'linux');

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

// Function to add hover effect
function addHoverEffect() {
    const table = document.getElementById('telemetryTable');
    if (!table) return;

    const cells = table.getElementsByTagName('td');
    const headers = table.getElementsByTagName('th');

    // Remove existing event listeners
    for (let cell of cells) {
        cell.onmouseenter = null;
        cell.onmouseleave = null;
    }
    for (let header of headers) {
        header.onmouseenter = null;
        header.onmouseleave = null;
    }

    // Only add new listeners if hover is enabled
    if (!hoverEnabled) return;

    // Add cell hover effects
    for (let cell of cells) {
        cell.addEventListener('mouseenter', function() {
            if (!hoverEnabled) return;
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
            if (!hoverEnabled) return;
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

    // Add header hover effects
    for (let i = 2; i < headers.length; i++) {
        let headerCell = headers[i];
        headerCell.addEventListener('mouseenter', function() {
            if (!hoverEnabled) return;
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
            if (!hoverEnabled) return;
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

// EDR Filter Functionality
function initializeEDRFilter() {
    const searchInput = document.querySelector('#edrFilter');
    const dropdown = document.querySelector('.edr-dropdown');
    const comparisonTags = document.querySelector('.comparison-tags');
    const compareButton = document.querySelector('#compareButton');
    
    // Return early if required elements are missing
    if (!searchInput || !dropdown || !comparisonTags || !compareButton) {
        console.debug('Required filter elements not found');
        return;
    }

    // Extract EDR names from telemetry data
    const edrNames = telemetryData.length > 0 ? 
        Object.keys(telemetryData[0]).filter(key => 
            key !== 'Telemetry Feature Category' && 
            key !== 'Sub-Category'
        ) : [];

    let selectedEDRs = new Set();

    // Populate dropdown with EDR options
    function populateDropdown(edrs) {
        if (!dropdown) return;
        dropdown.innerHTML = edrs.map(edr => `
            <div class="edr-option" data-edr="${edr}">
                ${edr}
            </div>
        `).join('');
    }

    // Rest of event listeners
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEDRs = edrNames.filter(edr => 
            edr.toLowerCase().includes(searchTerm)
        );
        populateDropdown(filteredEDRs);
        dropdown.classList.add('active');
    });

    // Handle focus/blur of search input
    searchInput.addEventListener('focus', () => {
        populateDropdown(edrNames);
        dropdown.classList.add('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-select')) {
            dropdown.classList.remove('active');
        }
    });

    // Handle EDR selection
    dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.edr-option');
        if (!option) return;

        const edrName = option.dataset.edr;
        if (!selectedEDRs.has(edrName)) {
            selectedEDRs.add(edrName);
            updateComparisonTags();
        }
        
        searchInput.value = '';
        dropdown.classList.remove('active');
    });

    // Update comparison tags
    function updateComparisonTags() {
        comparisonTags.innerHTML = Array.from(selectedEDRs).map(edr => `
            <div class="comparison-tag">
                ${edr}
                <span class="remove" data-edr="${edr}">×</span>
            </div>
        `).join('');

        // Enable compare button if at least one EDR is selected
        compareButton.disabled = selectedEDRs.size < 1;
    }

    // Handle tag removal
    comparisonTags.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove')) {
            const edrToRemove = e.target.dataset.edr;
            selectedEDRs.delete(edrToRemove);
            updateComparisonTags();
        }
    });

    // Handle compare button click
    compareButton.addEventListener('click', () => {
        if (selectedEDRs.size > 0) {
            displayTelemetry(telemetryData, 'all', Array.from(selectedEDRs), true);
        }
    });

    // Initial setup with safety check
    if (edrNames.length > 0) {
        populateDropdown(edrNames);
        updateComparisonTags();
    } else {
        console.debug('No EDR names available');
    }

    // Add hover toggle listener
    const hoverToggle = document.getElementById('hoverToggle');
    if (hoverToggle) {
        hoverToggle.checked = hoverEnabled;
        hoverToggle.addEventListener('change', function() {
            hoverEnabled = this.checked;
            localStorage.setItem('hoverEnabled', hoverEnabled);
            
            // Remove all existing highlights when disabled
            if (!hoverEnabled) {
                const table = document.getElementById('telemetryTable');
                if (table) {
                    table.querySelectorAll('.highlight-row, .highlight-column, .highlight-cell')
                        .forEach(el => {
                            el.classList.remove('highlight-row', 'highlight-column', 'highlight-cell');
                        });
                }
            }
            
            // Reinitialize hover effects
            addHoverEffect();
        });
    }
}

// Update the event listener to use memoized display
document.addEventListener('DOMContentLoaded', async () => {
    const contentDiv = document.getElementById('content') || document.getElementById('scoreTableContainer');
    if (!contentDiv) return;

    showLoading(contentDiv);
    
    try {
        const data = await loadTelemetry();
        if (!data) throw new Error('No data loaded');

        // Initialize filters only if we're on the main page
        if (window.location.pathname.includes('linux.html')) {
            populateFilterOptions();
            displayTelemetry(data);
            initializeEDRFilter();
        } else if (document.getElementById('scoreTableContainer')) {
            displayScoresOnScoresPage();
        }
    } catch (error) {
        console.error('Failed to initialize:', error);
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div class="error-message">
                    <h3>Failed to load data</h3>
                    <p>Please try refreshing the page</p>
                </div>
            `;
        }
    }
});

// Add debug mode for development
const DEBUG_MODE = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
if (DEBUG_MODE) {
    window.debugTelemetry = {
        clearCache: () => {
            localStorage.removeItem(CACHE_KEY);
            console.log('Telemetry cache cleared');
        },
        getData: () => telemetryData,
        refreshData: () => loadTelemetry(3)
    };
}
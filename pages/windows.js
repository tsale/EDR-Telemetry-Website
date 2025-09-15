import TemplatePage from '../components/TemplatePage'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import Link from 'next/link'
import Head from 'next/head'

export default function Windows() {
  // State for telemetry data
  const [telemetryData, setTelemetryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [selectedEDRs, setSelectedEDRs] = useState([]);
  const [edrDropdownOpen, setEdrDropdownOpen] = useState(false);
  const [edrOptions, setEdrOptions] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  
  // Refs for DOM elements
  const tableRef = useRef(null);

  // Add heading links
  useHeadingLinks();
  
  // Custom styles for highlighting
  const customStyles = `
    /* Table container styling */
    .telemetry-table-container {
      overflow-x: auto;
      margin: 1.5rem 0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      max-height: 70vh; /* Control the container height to enable scrolling */
      overflow-y: auto;
      position: relative; /* Create a positioning context for sticky elements */
      max-width: 90vw; /* Increased width from default */
      margin-left: auto;
      margin-right: auto;
    }
    
    /* Base table styling */
    .telemetry-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.95rem;
      background: #fff;
      border-radius: 8px;
      overflow: visible; /* Allow sticky elements to extend beyond container */
    }
    
    /* Header styling */
    .telemetry-table thead {
      position: sticky;
      top: 0;
      z-index: 45;
    }
    
    .telemetry-table th {
      padding: 1rem 0.8rem;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #000000;
      position: sticky;
      top: 0;
      background-color: #e0e5eb;
      z-index: 45;
      white-space: nowrap;
    }
    
    /* Feature column styling - for both header and cells */
    .telemetry-table .feature-column {
      font-weight: 600;
      min-width: 150px;
      background-color: #d0d6e0;
      position: sticky;
      left: 0;
      z-index: 40;
      border-right: 1px solid #bbc0c7;
      color: #2c3e50;
    }
    
    /* Subcategory column styling - for both header and cells */
    .telemetry-table .subcategory-column {
      min-width: 180px;
      background-color: #d0d6e0;
      position: sticky;
      left: 150px;
      z-index: 40;
      border-right: 1px solid #bbc0c7;
      color: #2c3e50;
    }
    
    /* Corner header cells - intersection of sticky headers and sticky columns */
    .telemetry-table th.feature-column {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 60; /* Highest z-index for corner cells */
      background-color: #d0d6e0;
    }
    
    .telemetry-table th.subcategory-column {
      position: sticky;
      top: 0;
      left: 150px;
      z-index: 60; /* Highest z-index for corner cells */
      background-color: #d0d6e0;
    }
    
    /* Regular header cells (non-Sysmon) */
    .telemetry-table th.edr-column {
      background-color: #d0d6e0;
      color: #2c3e50;
      border-bottom: 2px solid #000000;
      border-right: 2px solid rgb(154, 152, 152);
      position: sticky;
      top: 0;
      z-index: 45;
    }
    
    /* Cell styling */
    .telemetry-table td {
      padding: 0.85rem 0.8rem;
      border-bottom: 1px solid #e9ecef;
      text-align: center;
      transition: background-color 0.2s;
    }
    
    /* When rows are alternating colors, keep first two columns consistent */
    .telemetry-table tbody tr:nth-child(even) td.feature-column,
    .telemetry-table tbody tr:nth-child(even) td.subcategory-column {
      background-color: #d0d6e0;
    }
    
    /* Alternating row colors */
    .telemetry-table tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    .telemetry-table tbody tr:hover {
      background-color: #f0f7ff;
    }
    
    /* Override hover for sticky columns */
    .telemetry-table tbody tr:hover td.feature-column,
    .telemetry-table tbody tr:hover td.subcategory-column {
      background-color: #c0c8d8;
    }
    
    /* Status icon styling */
    .status-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1.25rem;
      transition: transform 0.2s ease;
      position: relative;
    }
    
    .telemetry-table td:hover .status-icon {
      transform: scale(1.2);
    }
    
    /* Sysmon styling */
    .sysmon-header {
      background-color: #1b5e20 !important;
      color: white !important;
      border-bottom: 3px solid #0d3f13 !important;
    }
    
    .sysmon-column {
      background-color: #f5fff5;
    }
    
    /* Hover highlighting effects */
    .telemetry-table td.highlight-row {
      background-color: rgba(255, 255, 0, 0.1);
    }
    
    .telemetry-table td.highlight-column {
      background-color: rgba(0, 200, 255, 0.1);
    }
    
    .telemetry-table td.highlight-cell {
      background-color: rgba(255, 165, 0, 0.2);
      font-weight: bold;
    }
    
    /* Comparison mode styling */
    .telemetry-table.comparison-mode td.difference {
      background-color: rgba(255, 0, 0, 0.08);
      position: relative;
    }
    
    .telemetry-table.comparison-mode td.difference::after {
      content: "≠";
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 10px;
      color: #e53935;
      font-weight: bold;
    }
    
    tr.has-differences {
      box-shadow: inset 0 0 0 2px rgba(255, 0, 0, 0.2);
    }
    
    /* Custom tooltip styling */
    .custom-tooltip-wrapper {
      position: relative;
      display: inline-block;
    }
    
    .custom-tooltip-wrapper:hover .custom-tooltip {
      visibility: visible;
      opacity: 1;
    }
    
    .custom-tooltip {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(33, 33, 33, 0.9);
      color: white;
      text-align: center;
      border-radius: 6px;
      padding: 8px 12px;
      width: max-content;
      max-width: 250px;
      z-index: 100;
      transition: opacity 0.3s;
      font-size: 0.85rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      pointer-events: none;
      white-space: normal;
      line-height: 1.4;
    }
    
    .custom-tooltip::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: rgba(33, 33, 33, 0.9) transparent transparent transparent;
    }
    
    /* Info indicator for partially implemented status */
    .has-explanation {
      position: relative;
    }
    
    .has-explanation .status-icon::after {
      content: "i";
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #2196f3;
      color: white;
      border-radius: 50%;
      font-size: 10px;
      line-height: 14px;
      font-weight: bold;
      font-style: italic;
    }
    
    /* Status icon colors */
    .status-icon.yes {
      background-color: rgba(46, 125, 50, 0.1);
    }
    
    .status-icon.no {
      background-color: rgba(211, 47, 47, 0.1);
    }
    
    .status-icon.partially {
      background-color: rgba(245, 124, 0, 0.1);
    }
    
    .status-icon.pending {
      background-color: rgba(123, 31, 162, 0.1);
    }
    
    .status-icon.via-logs {
      background-color: rgba(2, 119, 189, 0.1);
    }
    
    .status-icon.via-enabling {
      background-color: rgba(0, 137, 123, 0.1);
    }
    
    /* Toggle switch styling */
    .toggle-switch {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      position: relative;
      height: 30px;
    }
    
    .toggle-switch input[type="checkbox"] {
      height: 0;
      width: 0;
      visibility: hidden;
      position: absolute;
    }
    
    .toggle-switch label {
      cursor: pointer;
      width: 50px;
      height: 24px;
      background: #ccc;
      display: inline-block;
      border-radius: 24px;
      position: relative;
      margin-right: 12px;
      top: 0;
      flex-shrink: 0;
    }
    
    .toggle-switch label:after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 18px;
      transition: 0.3s;
    }
    
    .toggle-switch input:checked + label {
      background: #2196F3;
    }
    
    .toggle-switch input:checked + label:after {
      left: calc(100% - 3px);
      transform: translateX(-100%);
    }
    
    .toggle-switch span {
      display: inline-block;
      font-size: 0.95rem;
      color: #2c3e50;
      font-weight: 500;
      line-height: 24px;
      position: relative;
      top: 0;
    }
    
    /* Legend styling */
    .legend-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .legend-title {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.8rem;
      border-bottom: 1px solid #e9ecef;
      padding-bottom: 0.5rem;
    }
    
    .legend-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s;
    }
    
    .legend-item:hover {
      background-color: #f8f9fa;
    }
    
    .legend-icon {
      font-size: 1.25rem;
      margin-right: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
    }
    
    .legend-text {
      display: flex;
      flex-direction: column;
    }
    
    .legend-label {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .legend-description {
      font-size: 0.8rem;
      color: #7f8c8d;
    }
    
    /* Optional telemetry message and badge styling */
    .optional-message {
      background-color: #f0f7ff;
      border: 1px solid #e3f2fd;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin: 0.5rem 0 1rem 0;
      font-size: 0.9rem;
      line-height: 1.5;
      color: #6c757d;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .optional-message a {
      color: #1976d2;
      text-decoration: underline;
      font-weight: 500;
    }
    
    .optional-message a:hover {
      color: #1565c0;
      text-decoration: none;
    }
    
    .optional-badge {
      display: inline-block;
      background-color: #2196f3;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1;
    }
    
    .optional-badge:hover {
      background-color: #1976d2;
    }
    
    .optional-badge:focus {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }
    
    /* Filter controls styling */
    .filter-controls {
      background-color: #fff;
      border-radius: 8px;
      padding: 1.2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .filter-group {
      margin-bottom: 1rem;
    }
    
    .filter-control {
      margin-bottom: 0.8rem;
    }
    
    .filter-control label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 500;
      color: #2c3e50;
    }
    
    .search-select {
      position: relative;
    }
    
    .search-select input {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.95rem;
    }
    
    .edr-dropdown {
      position: absolute;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 4px 4px;
      z-index: 100;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .edr-option {
      padding: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .edr-option:hover {
      background-color: #f0f7ff;
    }
    
    .comparison-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    
    .comparison-tag {
      display: inline-flex;
      align-items: center;
      background-color:rgb(55, 91, 117);
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    
    .remove-tag {
      margin-left: 0.5rem;
      cursor: pointer;
      font-weight: bold;
      color: #2196f3;
    }
    
    .compare-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.6rem 1.2rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .compare-button:hover:not(:disabled) {
      background-color: #1976d2;
    }
    
    .compare-button:disabled {
      background-color: #bbdefb;
      cursor: not-allowed;
    }
    
    .compare-button .icon {
      margin-right: 0.5rem;
    }
    
    /* Responsive layout */
    @media (max-width: 768px) {
      .legend-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
      
      .telemetry-table th,
      .telemetry-table td {
        padding: 0.5rem 0.3rem;
        font-size: 0.85rem;
      }
      
      .telemetry-table .feature-column,
      .telemetry-table .subcategory-column {
        min-width: 120px;
      }
      
      .telemetry-table th.subcategory-column {
        left: 120px;
      }
      
      .status-icon {
        width: 22px;
        height: 22px;
        font-size: 0.9rem;
      }
      
      .custom-tooltip {
        max-width: 200px;
      }
      
      .telemetry-table-container {
        max-width: 100vw;
        margin-left: -0.5rem;
        margin-right: -0.5rem;
        border-radius: 0;
      }
      
      .filter-controls {
        padding: 0.8rem;
      }
      
      .comparison-tag {
        padding: 0.3rem 0.5rem;
        font-size: 0.8rem;
      }
      
      .compare-button {
        padding: 0.5rem 0.8rem;
        font-size: 0.9rem;
      }
      
      .optional-message {
        padding: 0.6rem 0.8rem;
        font-size: 0.85rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
      }
      
      .optional-badge {
        font-size: 0.7rem;
        padding: 0.15rem 0.4rem;
        margin-right: 0.3rem;
      }
    }
    
    @media (max-width: 480px) {
      .telemetry-table th,
      .telemetry-table td {
        padding: 0.4rem 0.2rem;
        font-size: 0.75rem;
      }
      
      .telemetry-table .feature-column,
      .telemetry-table .subcategory-column {
        min-width: 100px;
      }
      
      .telemetry-table th.subcategory-column {
        left: 100px;
      }
      
      .status-icon {
        width: 18px;
        height: 18px;
        font-size: 0.8rem;
      }
      
      .legend-item {
        padding: 0.3rem;
      }
      
      .legend-icon {
        font-size: 1rem;
        margin-right: 0.5rem;
        min-width: 24px;
      }
      
      .legend-label {
        font-size: 0.85rem;
      }
      
      .legend-description {
        font-size: 0.7rem;
      }
    }
    
    @media (max-width: 360px) {
      .telemetry-table .feature-column,
      .telemetry-table .subcategory-column {
        min-width: 90px;
      }
      
      .telemetry-table th.subcategory-column {
        left: 90px;
      }
      
      .telemetry-table th,
      .telemetry-table td {
        padding: 0.35rem 0.15rem;
        font-size: 0.7rem;
      }
      
      .status-icon {
        width: 16px;
        height: 16px;
        font-size: 0.75rem;
      }
      
      .toggle-switch label {
        width: 40px;
        height: 20px;
      }
      
      .toggle-switch label:after {
        width: 14px;
        height: 14px;
      }
      
      .toggle-switch span {
        font-size: 0.8rem;
      }
      
      .optional-message {
        padding: 0.5rem 0.6rem;
        font-size: 0.8rem;
        margin: 0.3rem 0 0.8rem 0;
      }
      
      .optional-badge {
        font-size: 0.65rem;
        padding: 0.1rem 0.3rem;
        margin-right: 0.25rem;
        letter-spacing: 0.3px;
      }
    }
    
    /* Touch-friendly enhancements */
    @media (hover: none) {
      .telemetry-table td:active .status-icon {
        transform: scale(1.2);
      }
      
      .compare-button:active:not(:disabled) {
        background-color: #1976d2;
      }
      
      .edr-option:active {
        background-color: #f0f7ff;
      }
      
      .custom-tooltip-wrapper:active .custom-tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
  `;

  // Function to sort data with Sysmon first
  const sortDataWithSysmonFirst = useCallback((data) => {
    if (!Array.isArray(data) || !data.length) return data;
    
    const sysmonEntries = [];
    const otherEntries = [];
    
    // Separate Sysmon and other entries
    data.forEach(entry => {
      const category = String(entry['Telemetry Feature Category'] || '');
      if (category.toLowerCase().includes('sysmon')) {
        sysmonEntries.push(entry);
      } else {
        otherEntries.push(entry);
      }
    });
    
    // Return combined array with Sysmon entries first
    return [...sysmonEntries, ...otherEntries];
  }, []);

  // Function to load telemetry data
  const loadTelemetry = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch data from our API endpoint (which gets data from Supabase)
      const telemetryResponse = await fetch('/api/telemetry/windows');

      if (!telemetryResponse.ok) 
        throw new Error(`Failed to fetch telemetry data: ${telemetryResponse.status} ${telemetryResponse.statusText}`);

      const telemetry = await telemetryResponse.json().catch(error => {
        throw new Error(`Error parsing JSON: ${error.message}`);
      });

      if (!telemetry || !Array.isArray(telemetry) || telemetry.length === 0) {
        throw new Error('Invalid telemetry data format received');
      }

      // Debug the data structure
      console.log('Telemetry Data First Item:', telemetry[0]);
      console.log('Available Keys:', Object.keys(telemetry[0]));
      
      // Data is already filtered for Windows in the API, no need to filter again
      const windowsData = telemetry;

      console.log(`Loaded ${windowsData.length} Windows entries from database`);
      
      // Explicitly ensure Sysmon entries are sorted first
      const sortedData = sortDataWithSysmonFirst(windowsData);
      console.log('Sorted data first few entries:', sortedData.slice(0, 3));
      
      setTelemetryData(sortedData);
      
      // Extract EDR options for filter
      if (sortedData && sortedData.length > 0) {
        const edrNames = Object.keys(sortedData[0] || {}).filter(key => 
          key !== 'Telemetry Feature Category' && 
          key !== 'Sub-Category' &&
          key !== 'optional' &&
          key !== '__explanations'
        );
        
        // Sort EDR options - ensure Sysmon is first if present
        const sortedEdrNames = [...edrNames].sort((a, b) => {
          if (a.toLowerCase().includes('sysmon')) return -1;
          if (b.toLowerCase().includes('sysmon')) return 1;
          return a.localeCompare(b);
        });
        
        console.log('EDR Names (sorted):', sortedEdrNames);
        setEdrOptions(sortedEdrNames);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message || 'Failed to load telemetry data. Please try again later.');
      setIsLoading(false);
    }
  }, [sortDataWithSysmonFirst]);

  // Add hover highlighting effect to table
  const addHoverEffect = useCallback(() => {
    if (!tableRef.current || !hoverEnabled) return;
    
    const table = tableRef.current;
    const rows = table.querySelectorAll('tbody tr');
    const headerCells = table.querySelectorAll('thead th');
    
    // Process all rows
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      
      // Add hover events to each cell
      cells.forEach((cell, cellIndex) => {
        cell.onmouseenter = () => {
          if (!hoverEnabled) return;
          
          // Highlight row
          cells.forEach(c => c.classList.add('highlight-row'));
          
          // Highlight column - find all cells in this column position
          rows.forEach(r => {
            const columnCell = r.querySelectorAll('td')[cellIndex];
            if (columnCell) columnCell.classList.add('highlight-column');
          });
          
          // Highlight current cell
          cell.classList.add('highlight-cell');
        };
        
        cell.onmouseleave = () => {
          if (!hoverEnabled) return;
          
          // Remove all highlights
          cells.forEach(c => c.classList.remove('highlight-row'));
          rows.forEach(r => {
            const columnCell = r.querySelectorAll('td')[cellIndex];
            if (columnCell) columnCell.classList.remove('highlight-column');
          });
          cell.classList.remove('highlight-cell');
        };
      });
    });
    
    // Add hover effects to header cells (columns only)
    headerCells.forEach((headerCell, headerIndex) => {
      // Skip first two columns (Category and Sub-Category)
      if (headerIndex < 2) return;
      
      headerCell.onmouseenter = () => {
        if (!hoverEnabled) return;
        
        // Highlight column
        rows.forEach(r => {
          const cell = r.querySelectorAll('td')[headerIndex];
          if (cell) cell.classList.add('highlight-column');
        });
        headerCell.classList.add('highlight-cell');
      };
      
      headerCell.onmouseleave = () => {
        if (!hoverEnabled) return;
        
        // Remove highlights
        rows.forEach(r => {
          const cell = r.querySelectorAll('td')[headerIndex];
          if (cell) cell.classList.remove('highlight-column');
        });
        headerCell.classList.remove('highlight-cell');
      };
    });
  }, [hoverEnabled]);

  // Highlight differences in comparison mode
  const highlightDifferences = useCallback(() => {
    if (!tableRef.current || !isComparisonMode) return;
    
    const table = tableRef.current;
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length <= 2) return; // Skip if not enough cells
      
      // Get statuses from cells (skipping first two columns)
      const statuses = [];
      for (let i = 2; i < cells.length; i++) {
        // Get status from data-status attribute for more reliable comparison
        const status = cells[i].getAttribute('data-status')?.toLowerCase() || '';
        statuses.push(status);
      }
      
      // Check if there are differences
      const hasMultipleStatuses = statuses.length > 1;
      const hasDifferences = hasMultipleStatuses && statuses.some(s => s !== statuses[0]);
      
      if (hasDifferences) {
        // Highlight cells with differences
        for (let i = 2; i < cells.length; i++) {
          cells[i].classList.add('difference');
        }
        // Also add a class to the row for styling
        row.classList.add('has-differences');
      }
    });
    
    console.log('Highlighted differences in comparison mode');
  }, [isComparisonMode]);

  // Function to compare selected EDRs
  const compareEDRs = useCallback(() => {
    if (selectedEDRs.length >= 2) {
      setIsComparisonMode(true);
      
      // After setting comparison mode, ensure differences are highlighted
      // when the table is rendered in the next cycle
      setTimeout(() => {
        highlightDifferences();
      }, 0);
    }
  }, [selectedEDRs, highlightDifferences]);

  // Toggle hover highlighting
  const toggleHover = useCallback(() => {
    const newState = !hoverEnabled;
    setHoverEnabled(newState);
    localStorage.setItem('hoverEnabled', newState);
  }, [hoverEnabled]);

  // Add an EDR to comparison
  const addToComparison = useCallback((edr) => {
    if (!selectedEDRs.includes(edr)) {
      setSelectedEDRs(prev => [...prev, edr]);
    }
    setEdrDropdownOpen(false);
    setFilterText('');
  }, [selectedEDRs]);

  // Remove an EDR from comparison
  const removeFromComparison = useCallback((edr) => {
    setSelectedEDRs(prev => prev.filter(e => e !== edr));
  }, []);

  // Filter EDR options based on search text
  const filteredEdrOptions = useMemo(() => 
    edrOptions.filter(edr => edr.toLowerCase().includes(filterText.toLowerCase())),
    [edrOptions, filterText]
  );

  // Custom tooltip component for better display of explanations
  const TooltipWrapper = ({ children, tooltip }) => {
    if (!tooltip) return children;
    
    return (
      <div className="custom-tooltip-wrapper">
        {children}
        <div className="custom-tooltip">{tooltip}</div>
      </div>
    );
  };

  // Function to get status icon based on value
  const getStatusIcon = useCallback((status, explanation) => {
    // Handle undefined or null values
    if (status === undefined || status === null) {
      return <span className="status-icon unknown" title="Unknown">-</span>;
    }

    // Convert to lowercase string for comparison
    const statusLower = String(status).toLowerCase().trim();
    const explanationText = typeof explanation === 'string' ? explanation : '';
    
    if (statusLower === 'yes') {
      return <span className="status-icon yes" title="Implemented">✅</span>;
    } else if (statusLower === 'no') {
      return <span className="status-icon no" title="Not Implemented">❌</span>;
    } else if (statusLower === 'partially') {
      const tooltipText = explanationText || 'Partially Implemented';
      const hasExplanation = Boolean(explanationText);

      return (
        <TooltipWrapper tooltip={tooltipText}>
          <span className={`status-icon partially ${hasExplanation ? 'has-explanation' : ''}`}>
            ⚠️
          </span>
        </TooltipWrapper>
      );
    } else if (statusLower === 'pending' || statusLower === 'pending response') {
      return <span className="status-icon pending" title="Pending Response">❓</span>;
    } else if (statusLower === 'via eventlogs') {
      return <span className="status-icon via-logs" title="Via EventLogs">🪵</span>;
    } else if (statusLower === 'via enablingtelemetry') {
      return <span className="status-icon via-enabling" title="Via Enabling Telemetry">🎚️</span>;
    }
    
    // Default case for any other value
    return <span className="status-icon unknown" title={`Unknown value: ${status}`}>-</span>;
  }, []);

  // Group data by category
  const groupedData = useMemo(() => {
    const groups = {};
    telemetryData.forEach(item => {
      const category = item['Telemetry Feature Category'];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [telemetryData]);

  // Function to display telemetry table
  const renderTelemetryTable = useCallback(() => {
    // Filter EDRs if any are selected
    const displayedEdrs = isComparisonMode || selectedEDRs.length > 0 
      ? selectedEDRs 
      : edrOptions;

    return (
      <div className="telemetry-table-container">
        <table 
          className={`telemetry-table ${isComparisonMode ? 'comparison-mode' : ''}`}
          ref={tableRef}
        >
          <thead>
            <tr>
              <th className="feature-column">Telemetry Feature Category</th>
              <th className="subcategory-column">Sub-Category</th>
              {displayedEdrs.map(edr => {
                // Format EDR name for better display on mobile
                const displayName = window.innerWidth <= 480 ? 
                  edr.replace(/\s*\(.+\)/, '').trim() : edr;
                
                return (
                  <th 
                    key={edr} 
                    className={`edr-column ${edr.toLowerCase().includes('sysmon') ? 'sysmon-header' : ''}`}
                  >
                    {displayName}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([category, items]) => (
              items.map((item, itemIndex) => {
                const subcategory = item['Sub-Category'];
                const rowKey = `${category}-${subcategory}-${itemIndex}`;
                
                return (
                  <tr 
                    key={rowKey} 
                    className={hoverEnabled ? 'hover-highlight' : ''}
                  >
                    {itemIndex === 0 && (
                      <td 
                        className="feature-column" 
                        rowSpan={items.length}
                      >
                        {category}
                      </td>
                    )}
                    <td className="subcategory-column">
                      {subcategory}
                      {item.optional && <span className="optional-badge">New</span>}
                    </td>
                    
                    {displayedEdrs.map(edr => {
                      const status = item[edr];
                      const statusKey = `${rowKey}-${edr}`;
                      const explanationMap = item.__explanations || {};
                      const explanation = explanationMap[edr] || '';
                      const isPartial = typeof status === 'string' && status.toLowerCase() === 'partially';
                      const cellTitle = isPartial ? (explanation || 'Partially Implemented') : '';

                      return (
                        <td 
                          key={statusKey} 
                          className={`${edr.toLowerCase().includes('sysmon') ? 'sysmon-column' : ''}`}
                          data-status={status}
                          title={cellTitle}
                        >
                          {getStatusIcon(status, explanation)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [groupedData, isComparisonMode, selectedEDRs, edrOptions, hoverEnabled, getStatusIcon]);

  // Initialize component
  useEffect(() => {
    // Load saved hover state from localStorage
    const savedHoverState = localStorage.getItem('hoverEnabled') === 'true';
    setHoverEnabled(savedHoverState);
    
    // Load telemetry data
    loadTelemetry();
  }, [loadTelemetry]);

  // Effect to add hover and highlight functionality after rendering
  useEffect(() => {
    if (telemetryData.length > 0 && !isLoading) {
      // Add hover effect
      addHoverEffect();
      
      // Highlight differences if in comparison mode
      if (isComparisonMode) {
        highlightDifferences();
      }
    }
  }, [telemetryData, isLoading, hoverEnabled, isComparisonMode, addHoverEffect, highlightDifferences]);

  return (
    <TemplatePage title="EDR Telemetry Project - Windows">
      <Head>
        <style>{customStyles}</style>
      </Head>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Windows EDR Telemetry</h1>
          <p>Explore detailed telemetry capabilities and comparisons for Windows-based EDR solutions.</p>
        </div>
      </div>

      <div className="content-section">
        {/* Legend Section */}
        <div className="legend-container">
          <div className="legend-title">Legend</div>
          <div className="legend-grid">
            <div className="legend-item">
              <span className="legend-icon">✅</span>
              <div className="legend-text">
                <span className="legend-label">Yes</span>
                <span className="legend-description">Implemented</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-icon">❌</span>
              <div className="legend-text">
                <span className="legend-label">No</span>
                <span className="legend-description">Not Implemented</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-icon">⚠️</span>
              <div className="legend-text">
                <span className="legend-label">Partially</span>
                <span className="legend-description">Partially Implemented (hover-over for explanation)</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-icon">❓</span>
              <div className="legend-text">
                <span className="legend-label">Pending</span>
                <span className="legend-description">Pending Response</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-icon">🪵</span>
              <div className="legend-text">
                <span className="legend-label">Via EventLogs</span>
                <span className="legend-description">Indicates telemetry that is available Via EventLogs</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-icon">🎚️</span>
              <div className="legend-text">
                <span className="legend-label">Via EnablingTelemetry</span>
                <span className="legend-description">Additional telemetry collection capability that can be enabled as part of the EDR product but is not ON by default.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="hoverToggle" 
                checked={hoverEnabled}
                onChange={toggleHover}
              />
              <label htmlFor="hoverToggle"></label>
              <span>Enable Hover Highlight</span>
            </div>
            <Link href="/scores" className="action-button primary-button">
              <span>Show Scores</span>
            </Link>
            <Link href="/mitre-mappings" className="action-button primary-button">
              <span>Mitre ATT&CK Mappings</span>
            </Link>
            <Link href="/telemetry-categories" className="action-button primary-button">
              <span>Categories Breakdown</span>
            </Link>
          </div>
          
          <div className="filter-group">
            <div className="filter-control">
              <label htmlFor="edrFilter">Filter by EDR:</label>
              <div className="search-select">
                <input 
                  type="text" 
                  id="edrFilter" 
                  placeholder="Search EDR solutions..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  onClick={() => setEdrDropdownOpen(true)}
                />
                {edrDropdownOpen && (
                  <div className="edr-dropdown">
                    {filteredEdrOptions.map(edr => (
                      <div 
                        key={edr}
                        className="edr-option" 
                        onClick={() => addToComparison(edr)}
                      >
                        {edr}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="filter-control">
              <label>Selected for Comparison:</label>
              <div className="comparison-tags">
                {selectedEDRs.map(edr => (
                  <div key={edr} className="comparison-tag">
                    {edr}
                    <span 
                      className="remove-tag" 
                      onClick={() => removeFromComparison(edr)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              id="compareButton" 
              className="compare-button"
              disabled={selectedEDRs.length < 2}
              onClick={compareEDRs}
            >
              <span className="icon">⟷</span>
              <span>Compare</span>
            </button>
          </div>
        </div>
        
        {/* Subtle Optional Telemetry Message */}
        <div className="optional-message">
          <span className="optional-badge">New</span> telemetry doesn't affect scoring until 75% vendor adoption. <a href="/scores#optional-telemetry">Learn more</a>
        </div>
        
        {/* Content Area */}
        <div id="content">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading telemetry data...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <h3>Error loading data</h3>
              <p>{error}</p>
              <button onClick={() => loadTelemetry()}>Retry</button>
            </div>
          ) : (
            renderTelemetryTable()
          )}
        </div>
      </div>
    </TemplatePage>
  )
} 

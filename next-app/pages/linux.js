import TemplatePage from '../components/TemplatePage'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import Link from 'next/link'
import Head from 'next/head'

export default function Linux() {
  // State for telemetry data and UI
  const [telemetryData, setTelemetryData] = useState([]);
  const [partiallyExplanations, setPartiallyExplanations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [selectedEDRs, setSelectedEDRs] = useState([]);
  const [edrDropdownOpen, setEdrDropdownOpen] = useState(false);
  const [edrOptions, setEdrOptions] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  // Ref for the table element (for hover and comparison effects)
  const tableRef = useRef(null);

  // Custom CSS styles (copied from windows.js)
  const customStyles = `
    /* Table container styling */
    .telemetry-table-container {
      overflow-x: auto;
      margin: 1.5rem 0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      max-height: 70vh;
      overflow-y: auto;
      position: relative;
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
      overflow: visible;
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
    /* Feature column styling */
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
    /* Subcategory column styling */
    .telemetry-table .subcategory-column {
      min-width: 180px;
      background-color: #d0d6e0;
      position: sticky;
      left: 150px;
      z-index: 40;
      border-right: 1px solid #bbc0c7;
      color: #2c3e50;
    }
    /* Corner header cells */
    .telemetry-table th.feature-column {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 60;
      background-color: #d0d6e0;
    }
    .telemetry-table th.subcategory-column {
      position: sticky;
      top: 0;
      left: 150px;
      z-index: 60;
      background-color: #d0d6e0;
    }
    /* Regular header cells */
    .telemetry-table th.edr-column {
      background-color: #d0d6e0;
      color: #2c3e50;
      border-bottom: 2px solid #000000;
      border-right: 2px solid rgb(154, 152, 152);
      position: sticky;
      top: 0;
      z-index: 45;
    }
    /* Auditd styling */
    .auditd-header {
      background-color: #1565c0 !important;
      color: white !important;
      border-bottom: 3px solid #0d47a1 !important;
    }
    .auditd-column {
      background-color: #e3f2fd;
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
    /* Cell styling */
    .telemetry-table td {
      padding: 0.85rem 0.8rem;
      border-bottom: 1px solid #e9ecef;
      text-align: center;
      transition: background-color 0.2s;
    }
    /* Alternating row colors */
    .telemetry-table tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .telemetry-table tbody tr:hover {
      background-color: #f0f7ff;
    }
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
      background-color: #e3f2fd;
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
    @media (max-width: 768px) {
      .legend-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
      .telemetry-table th,
      .telemetry-table td {
        padding: 0.6rem 0.5rem;
        font-size: 0.9rem;
      }
      .status-icon {
        width: 24px;
        height: 24px;
        font-size: 1rem;
      }
      .custom-tooltip {
        max-width: 200px;
      }
      .telemetry-table-container {
        max-width: 95vw;
      }
    }
  `;

  // Add heading links
  useHeadingLinks();

  // Sort telemetry data (Sysmon, Auditd, then others)
  const sortDataWithSysmonFirst = (data) => {
    if (!Array.isArray(data) || !data.length) return data;
    const sysmonEntries = [];
    const auditdEntries = [];
    const otherEntries = [];
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
    return [...sysmonEntries, ...auditdEntries, ...otherEntries];
  };

  // Load telemetry data from Linux endpoints
  const loadTelemetry = async () => {
    setIsLoading(true);
    try {
      const [telemetryResponse, explanationsResponse] = await Promise.all([
        fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json'),
        fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/partially_value_explanations_linux.json')
      ]);
      if (!telemetryResponse.ok || !explanationsResponse.ok) throw new Error('Network response was not ok');
      const [telemetry, explanations] = await Promise.all([
        telemetryResponse.json(),
        explanationsResponse.json()
      ]);
      const sortedData = sortDataWithSysmonFirst(telemetry);
      setTelemetryData(sortedData);
      setPartiallyExplanations(explanations);
      if (sortedData && sortedData.length > 0) {
        const edrNames = Object.keys(sortedData[0] || {}).filter(key =>
          key !== 'Telemetry Feature Category' &&
          key !== 'Sub-Category'
        );
        setEdrOptions(edrNames);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Toggle hover highlighting and save state
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

  // Filter EDR options based on input text
  const filteredEdrOptions = edrOptions.filter(edr =>
    edr.toLowerCase().includes(filterText.toLowerCase())
  );

  // Add hover effect to table cells and headers
  const addHoverEffect = useCallback(() => {
    if (!tableRef.current || !hoverEnabled) return;
    const table = tableRef.current;
    const rows = table.querySelectorAll('tbody tr');
    const headerCells = table.querySelectorAll('thead th');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        cell.onmouseenter = () => {
          if (!hoverEnabled) return;
          cells.forEach(c => c.classList.add('highlight-row'));
          rows.forEach(r => {
            const columnCell = r.querySelectorAll('td')[cellIndex];
            if (columnCell) columnCell.classList.add('highlight-column');
          });
          cell.classList.add('highlight-cell');
        };
        cell.onmouseleave = () => {
          if (!hoverEnabled) return;
          cells.forEach(c => c.classList.remove('highlight-row'));
          rows.forEach(r => {
            const columnCell = r.querySelectorAll('td')[cellIndex];
            if (columnCell) columnCell.classList.remove('highlight-column');
          });
          cell.classList.remove('highlight-cell');
        };
      });
    });
    headerCells.forEach((headerCell, headerIndex) => {
      if (headerIndex < 2) return;
      headerCell.onmouseenter = () => {
        if (!hoverEnabled) return;
        rows.forEach(r => {
          const cell = r.querySelectorAll('td')[headerIndex];
          if (cell) cell.classList.add('highlight-column');
        });
        headerCell.classList.add('highlight-cell');
      };
      headerCell.onmouseleave = () => {
        if (!hoverEnabled) return;
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
      if (cells.length <= 2) return;
      const statuses = [];
      for (let i = 2; i < cells.length; i++) {
        const status = cells[i].getAttribute('data-status')?.toLowerCase() || '';
        statuses.push(status);
      }
      const hasDifferences = statuses.length > 1 && statuses.some(s => s !== statuses[0]);
      if (hasDifferences) {
        for (let i = 2; i < cells.length; i++) {
          cells[i].classList.add('difference');
        }
        row.classList.add('has-differences');
      }
    });
  }, [isComparisonMode]);

  // Comparison functionality
  const compareEDRs = useCallback(() => {
    if (selectedEDRs.length >= 2) {
      setIsComparisonMode(true);
      setTimeout(() => {
        highlightDifferences();
      }, 0);
    }
  }, [selectedEDRs, highlightDifferences]);

  // Custom tooltip wrapper component
  const TooltipWrapper = ({ children, tooltip }) => {
    if (!tooltip) return children;
    return (
      <div className="custom-tooltip-wrapper">
        {children}
        <div className="custom-tooltip">{tooltip}</div>
      </div>
    );
  };

  // Get status icon with tooltip for "partially" status
  const getStatusIcon = useCallback((status, category, subcategory, edr) => {
    if (status === undefined || status === null) {
      return <span className="status-icon unknown" title="Unknown">-</span>;
    }
    const statusLower = String(status).toLowerCase().trim();
    let explanation = '';
    if (statusLower === 'partially') {
      if (
        partiallyExplanations[edr] &&
        partiallyExplanations[edr][category] &&
        partiallyExplanations[edr][category][subcategory]
      ) {
        explanation = partiallyExplanations[edr][category][subcategory];
      }
    }
    if (statusLower === 'yes') {
      return <span className="status-icon yes" title="Implemented">✅</span>;
    } else if (statusLower === 'no') {
      return <span className="status-icon no" title="Not Implemented">❌</span>;
    } else if (statusLower === 'partially') {
      return (
        <TooltipWrapper tooltip={explanation || "Partially Implemented"}>
          <span className={`status-icon partially ${explanation ? 'has-explanation' : ''}`}>
            ⚠️
          </span>
        </TooltipWrapper>
      );
    } else if (statusLower === 'pending' || statusLower === 'pending response') {
      return <span className="status-icon pending" title="Pending Response">❓</span>;
    } else if (statusLower === 'via enablingtelemetry') {
      return <span className="status-icon via-enabling" title="Via Enabling Telemetry">🎚️</span>;
    }
    return <span className="status-icon unknown" title={`Unknown value: ${status}`}>-</span>;
  }, [partiallyExplanations]);

  // Render telemetry table with sticky headers/columns and custom hover/comparison effects
  const renderTelemetryTable = useCallback(() => {
    // Filter and order EDRs for display
    let displayedEdrs = selectedEDRs.length > 0 ? [...selectedEDRs] : [...edrOptions];
    
    // For comparison mode, just use selected EDRs
    if (isComparisonMode) {
      return (
        <div className="telemetry-table-container">
          <table className={`telemetry-table comparison-mode`} ref={tableRef}>
            <thead>
              <tr>
                <th className="feature-column">Telemetry Feature Category</th>
                <th className="subcategory-column">Sub-Category</th>
                {displayedEdrs.map(edr => {
                  const isAuditd = edr.toLowerCase().includes('auditd');
                  const isSysmon = edr.toLowerCase().includes('sysmon');
                  return (
                    <th 
                      key={edr} 
                      className={`edr-column ${isAuditd ? 'auditd-header' : ''} ${isSysmon ? 'sysmon-header' : ''}`}
                    >
                      {edr}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {telemetryData.map((item, index) => {
                const category = item['Telemetry Feature Category'];
                const subcategory = item['Sub-Category'];
                const rowKey = `${category}-${subcategory}-${index}`;
                return (
                  <tr key={rowKey} className={hoverEnabled ? 'hover-highlight' : ''}>
                    <td className="feature-column">{category}</td>
                    <td className="subcategory-column">{subcategory}</td>
                    {displayedEdrs.map(edr => {
                      const status = item[edr];
                      const statusKey = `${rowKey}-${edr}`;
                      const isAuditd = edr.toLowerCase().includes('auditd');
                      const isSysmon = edr.toLowerCase().includes('sysmon');
                      return (
                        <td 
                          key={statusKey} 
                          data-status={status} 
                          className={`${isAuditd ? 'auditd-column' : ''} ${isSysmon ? 'sysmon-column' : ''} ${status?.toLowerCase() === 'partially' ? 'has-tooltip' : ''}`} 
                          title={status?.toLowerCase() === 'partially' && partiallyExplanations[edr] && partiallyExplanations[edr][category] && partiallyExplanations[edr][category][subcategory] ? partiallyExplanations[edr][category][subcategory] : ''}
                        >
                          {getStatusIcon(status, category, subcategory, edr)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
    
    // For normal display mode, rearrange to put Auditd and Sysmon first (after first two columns)
    const auditdEdr = displayedEdrs.find(edr => edr.toLowerCase().includes('auditd'));
    const sysmonEdr = displayedEdrs.find(edr => edr.toLowerCase().includes('sysmon'));
    
    // Remove Auditd and Sysmon from the array if they exist
    if (auditdEdr) {
      displayedEdrs = displayedEdrs.filter(edr => edr !== auditdEdr);
    }
    if (sysmonEdr) {
      displayedEdrs = displayedEdrs.filter(edr => edr !== sysmonEdr);
    }
    
    // Add Auditd and Sysmon at the beginning
    const orderedEdrs = [];
    if (auditdEdr) orderedEdrs.push(auditdEdr);
    if (sysmonEdr) orderedEdrs.push(sysmonEdr);
    
    // Add the rest of the EDRs
    orderedEdrs.push(...displayedEdrs);
    
    return (
      <div className="telemetry-table-container">
        <table className={`telemetry-table`} ref={tableRef}>
          <thead>
            <tr>
              <th className="feature-column">Telemetry Feature Category</th>
              <th className="subcategory-column">Sub-Category</th>
              {orderedEdrs.map(edr => {
                const isAuditd = edr.toLowerCase().includes('auditd');
                const isSysmon = edr.toLowerCase().includes('sysmon');
                return (
                  <th 
                    key={edr} 
                    className={`edr-column ${isAuditd ? 'auditd-header' : ''} ${isSysmon ? 'sysmon-header' : ''}`}
                  >
                    {edr}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {telemetryData.map((item, index) => {
              const category = item['Telemetry Feature Category'];
              const subcategory = item['Sub-Category'];
              const rowKey = `${category}-${subcategory}-${index}`;
              return (
                <tr key={rowKey} className={hoverEnabled ? 'hover-highlight' : ''}>
                  <td className="feature-column">{category}</td>
                  <td className="subcategory-column">{subcategory}</td>
                  {orderedEdrs.map(edr => {
                    const status = item[edr];
                    const statusKey = `${rowKey}-${edr}`;
                    const isAuditd = edr.toLowerCase().includes('auditd');
                    const isSysmon = edr.toLowerCase().includes('sysmon');
                    return (
                      <td 
                        key={statusKey} 
                        data-status={status} 
                        className={`${isAuditd ? 'auditd-column' : ''} ${isSysmon ? 'sysmon-column' : ''} ${status?.toLowerCase() === 'partially' ? 'has-tooltip' : ''}`} 
                        title={status?.toLowerCase() === 'partially' && partiallyExplanations[edr] && partiallyExplanations[edr][category] && partiallyExplanations[edr][category][subcategory] ? partiallyExplanations[edr][category][subcategory] : ''}
                      >
                        {getStatusIcon(status, category, subcategory, edr)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }, [telemetryData, isComparisonMode, selectedEDRs, edrOptions, hoverEnabled, partiallyExplanations, getStatusIcon, tableRef]);

  // Initial load: get hover state and telemetry data
  useEffect(() => {
    const savedHoverState = localStorage.getItem('hoverEnabled') === 'true';
    setHoverEnabled(savedHoverState);
    loadTelemetry();
  }, []);

  // Apply hover effects and comparison highlights after table render
  useEffect(() => {
    if (telemetryData.length > 0 && !isLoading) {
      addHoverEffect();
      if (isComparisonMode) {
        highlightDifferences();
      }
    }
  }, [telemetryData, isLoading, hoverEnabled, isComparisonMode, addHoverEffect, highlightDifferences]);

  return (
    <TemplatePage title="EDR Telemetry Project - Linux">
      <Head>
        <style>{customStyles}</style>
      </Head>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Linux EDR Telemetry</h1>
          <p>Explore detailed telemetry capabilities and comparisons for Linux-based EDR solutions.</p>
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

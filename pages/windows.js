import TemplatePage from '../components/TemplatePage'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import Link from 'next/link'
import Head from 'next/head'
import {
  Monitor, Search, Filter, ArrowRight, CheckCircle, XCircle,
  AlertTriangle, HelpCircle, FileText, Settings, Sliders,
  BarChart3, Globe, Activity, Database
} from 'lucide-react'
import TransparencyIndicator from '../components/TransparencyIndicator'

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
  const [transparencyData, setTransparencyData] = useState({});

  // Refs for DOM elements
  const tableRef = useRef(null);

  // Add heading links
  useHeadingLinks();

  // Custom styles for highlighting
  const customStyles = `
    /* Table container styling */
    .telemetry-table-container {
      overflow-x: auto;
      margin: 0;
      border-radius: 0.75rem;
      max-height: 70vh; /* Control the container height to enable scrolling */
      overflow-y: auto;
      position: relative; /* Create a positioning context for sticky elements */
      width: 100%;

      overscroll-behavior: contain; /* Prevent parent scroll chaining */
    }
    
    /* Base table styling */
    .telemetry-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.9rem;
      background: #fff;
      /* Ensure the table can expand beyond the viewport so horizontal scroll appears */
      min-width: 600px;
    }
    
    /* Header styling */
    .telemetry-table thead {
      position: sticky;
      top: 0;
      z-index: 45;
    }
    
    .telemetry-table th {
      padding: 1rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #334155;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      background-color: #f8fafc;
      z-index: 45;
      white-space: nowrap;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* Feature column styling - for both header and cells */
    .telemetry-table .feature-column {
      font-weight: 600;
      width: var(--feature-col-width, 180px);
      min-width: var(--feature-col-width, 180px);
      background-color: #f1f5f9;
      position: static; /* no sticky lock for feature column */
      left: auto;
      z-index: auto;
      border-right: 1px solid #e2e8f0;
      color: #334155;
    }
    
    /* Subcategory column styling - for both header and cells */
    .telemetry-table .subcategory-column {
      width: var(--subcategory-col-width, 200px);
      min-width: var(--subcategory-col-width, 200px);
      background-color: #f1f5f9;
      position: sticky;
      left: 0; /* keep only subcategory frozen */
      z-index: 40;
      border-right: 1px solid #e2e8f0;
      color: #475569;
    }
    
    /* Corner header cells - intersection of sticky headers and sticky columns */
    .telemetry-table th.feature-column {
      position: sticky;
      top: 0;
      left: auto; /* no horizontal stick */
      z-index: 45; /* align with other headers */
      background-color: #f1f5f9;
      color: #1e293b;
    }
    
    .telemetry-table th.subcategory-column {
      position: sticky;
      top: 0;
      left: 0; /* first sticky column */
      z-index: 60; /* Highest z-index for corner cells */
      background-color: #f1f5f9;
      color: #1e293b;
    }
    
    /* Regular header cells (non-Sysmon) */
    .telemetry-table th.edr-column {
      background-color: #f8fafc;
      color: #334155;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 45;
    }
    
    /* Cell styling */
    .telemetry-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      text-align: center;
      transition: background-color 0.2s;
      white-space: nowrap;
    }
    
    /* When rows are alternating colors, keep first two columns consistent */
    .telemetry-table tbody tr:nth-child(even) td.feature-column,
    .telemetry-table tbody tr:nth-child(even) td.subcategory-column {
      background-color: #f1f5f9;
    }
    
    /* Alternating row colors */
    .telemetry-table tbody tr:nth-child(even) {
      background-color: #ffffff;
    }
    .telemetry-table tbody tr:nth-child(odd) {
      background-color: #fcfcfd;
    }
    
    /* Status icon styling */
    .status-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      font-size: 1.1rem;
      transition: transform 0.2s ease;
      position: relative;
    }
    
    .telemetry-table td:hover .status-icon {
      transform: scale(1.2);
    }
    
    /* Sysmon styling */
    .sysmon-header {
      background-color: #eff6ff !important; /* blue-50 */
      color: #1e40af !important; /* blue-800 */
      border-bottom: 2px solid #3b82f6 !important;
    }
    
    .sysmon-column {
      background-color: #eff6ff;
    }
    
    /* Hover highlighting effects */
    .telemetry-table td.highlight-row {
      background-color: rgba(59, 130, 246, 0.05) !important;
    }
    
    .telemetry-table td.highlight-column {
      background-color: rgba(59, 130, 246, 0.05) !important;
    }
    
    .telemetry-table td.highlight-cell {
      background-color: rgba(59, 130, 246, 0.1) !important;
      font-weight: 600;
    }
    
    /* Comparison mode styling */
    .telemetry-table.comparison-mode td.difference {
      background-color: rgba(239, 68, 68, 0.05);
      position: relative;
    }
    
    .telemetry-table.comparison-mode td.difference::after {
      content: "≠";
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 9px;
      color: #ef4444;
      font-weight: bold;
    }
    
    tr.has-differences {
      box-shadow: inset 2px 0 0 0 #ef4444;
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
      background-color: #1e293b;
      color: white;
      text-align: center;
      border-radius: 6px;
      padding: 8px 12px;
      width: max-content;
      max-width: 250px;
      z-index: 100;
      transition: opacity 0.2s;
      font-size: 0.75rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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
      border-color: #1e293b transparent transparent transparent;
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
      width: 12px;
      height: 12px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      font-size: 9px;
      line-height: 12px;
      font-weight: bold;
      font-style: italic;
      border: 1px solid white;
    }
    
    /* Status icon colors - refined */
    .status-icon.yes {
      background-color: rgba(34, 197, 94, 0.1); /* green-500 */
      color: #15803d;
    }
    
    .status-icon.no {
      background-color: rgba(239, 68, 68, 0.1); /* red-500 */
      color: #b91c1c;
    }
    
    .status-icon.partially {
      background-color: rgba(249, 115, 22, 0.1); /* orange-500 */
      color: #c2410c;
    }
    
    .status-icon.pending {
      background-color: rgba(168, 85, 247, 0.1); /* purple-500 */
      color: #7e22ce;
    }
    
    .status-icon.via-logs {
      background-color: rgba(59, 130, 246, 0.1); /* blue-500 */
      color: #1d4ed8;
    }
    
    .status-icon.via-enabling {
      background-color: rgba(14, 165, 233, 0.1); /* sky-500 */
      color: #0369a1;
    }
    
    .status-icon.unknown {
      background-color: #f1f5f9;
      color: #64748b;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .telemetry-table th,
      .telemetry-table td {
        padding: 0.5rem 0.5rem;
        font-size: 0.8rem;
      }
      
      .telemetry-table .feature-column,
      .telemetry-table .subcategory-column {
        min-width: 120px;
      }
      
      .telemetry-table .subcategory-column {
        left: 0;
      }
      
      .status-icon {
        width: 24px;
        height: 24px;
        font-size: 0.9rem;
      }
    }
    
    @media (max-width: 480px) {
      .telemetry-table .feature-column,
      .telemetry-table .subcategory-column {
        min-width: 100px;
        left: 0;
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
      // Fetch telemetry and transparency data in parallel
      const [telemetryResponse, transparencyResponse] = await Promise.all([
        fetch('/api/telemetry/windows'),
        fetch('/api/telemetry/transparency')
      ]);

      if (!telemetryResponse.ok)
        throw new Error(`Failed to fetch telemetry data: ${telemetryResponse.status} ${telemetryResponse.statusText}`);

      if (transparencyResponse.ok) {
        const transparency = await transparencyResponse.json();
        setTransparencyData(transparency);
      }

      const telemetry = await telemetryResponse.json().catch(error => {
        throw new Error(`Error parsing JSON: ${error.message}`);
      });

      if (!telemetry || !Array.isArray(telemetry) || telemetry.length === 0) {
        throw new Error('Invalid telemetry data format received');
      }

      // Data is already filtered for Windows in the API, no need to filter again
      const windowsData = telemetry;

      // Explicitly ensure Sysmon entries are sorted first
      const sortedData = sortDataWithSysmonFirst(windowsData);

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

                // Get transparency info for this vendor
                const vendorTransparency = transparencyData[edr] || {};

                return (
                  <th
                    key={edr}
                    className={`edr-column ${edr.toLowerCase().includes('sysmon') ? 'sysmon-header' : ''}`}
                  >
                    <span className="inline-flex items-center">
                      {displayName}
                      <TransparencyIndicator
                        indicators={vendorTransparency.indicators || []}
                        transparencyNote={vendorTransparency.transparency_note || ''}
                        vendorName={edr}
                        className="ml-1"
                      />
                    </span>
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
                      {item.optional && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                          New
                        </span>
                      )}
                    </td>

                    {displayedEdrs.map(edr => {
                      const status = item[edr];
                      const statusKey = `${rowKey}-${edr}`;
                      const explanationMap = item.__explanations || {};
                      const explanation = explanationMap[edr] || '';

                      return (
                        <td
                          key={statusKey}
                          className={`${edr.toLowerCase().includes('sysmon') ? 'sysmon-column' : ''}`}
                          data-status={status}
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
  }, [groupedData, isComparisonMode, selectedEDRs, edrOptions, hoverEnabled, getStatusIcon, transparencyData]);

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
    <TemplatePage title="Windows EDR Telemetry Analysis"
      description="Vendor-neutral analysis of Windows EDR telemetry coverage, categories, and depth.">
      <Head>
        <style>{customStyles}</style>
      </Head>

      {/* Hero Section - Modernized */}
      <section className="relative bg-slate-900 text-white pt-20 pb-24 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center justify-center min-h-[420px]">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-xl mb-8 backdrop-blur-sm ring-1 ring-blue-500/50">
            <Monitor className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white leading-tight">
            Windows EDR <span className="text-blue-400">Telemetry</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 leading-relaxed !text-center">
            Explore detailed telemetry capabilities and comparisons for Windows-based EDR solutions.
            Analyze coverage, gaps, and detection logic.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div className="flex items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
              <Database className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-slate-300 font-medium">{isLoading ? "Loading..." : `${telemetryData.length} Signals`}</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
              <Activity className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-slate-300 font-medium">{isLoading ? "Loading..." : `${edrOptions.length} Vendors`}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12 relative z-20">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Toolbar / Controls */}
          <div className="border-b border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

              {/* Left Side: Filters */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <div className="relative group min-w-[280px]">
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                    placeholder="Search or select EDRs..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    onClick={() => setEdrDropdownOpen(true)}
                  />

                  {edrDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-[100]" onClick={() => setEdrDropdownOpen(false)}></div>
                      <div className="absolute mt-1 w-full bg-white shadow-xl max-h-96 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm z-[110]">
                        {filteredEdrOptions.map(edr => (
                          <div
                            key={edr}
                            className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-blue-50 text-slate-700 flex items-center"
                            onClick={() => addToComparison(edr)}
                          >
                            <span className={`block truncate font-medium ${selectedEDRs.includes(edr) ? 'text-blue-600' : ''}`}>
                              {edr}
                            </span>
                            {selectedEDRs.includes(edr) && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                <CheckCircle className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2 bg-white px-3 py-2 border border-slate-300 rounded-lg shadow-sm">
                  <label htmlFor="hoverToggle" className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="hoverToggle"
                        className="sr-only"
                        checked={hoverEnabled}
                        onChange={toggleHover}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${hoverEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hoverEnabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-slate-700">Highlighting</span>
                  </label>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end">
                <Link href="/scores" className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  <BarChart3 className="w-4 h-4 mr-2 text-slate-500" /> Scores
                </Link>
                <Link href="/mitre-mappings" className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  <Globe className="w-4 h-4 mr-2 text-slate-500" /> MITRE
                </Link>
                <Link href="/telemetry-categories" className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                  <FileText className="w-4 h-4 mr-2 text-slate-500" /> Categories
                </Link>
              </div>
            </div>

            {/* Selected EDRs Tags */}
            {selectedEDRs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedEDRs.map(edr => (
                  <span key={edr} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {edr}
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-600 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      onClick={() => removeFromComparison(edr)}
                    >
                      <span className="sr-only">Remove {edr}</span>
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setSelectedEDRs([]);
                    setIsComparisonMode(false);
                  }}
                  className="text-sm text-slate-500 hover:text-red-600 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Telemetry Table Area */}
          <div className="p-0">
            {/* Legend Bar - Integrated above table */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 overflow-x-auto">
              <div className="flex flex-wrap gap-6 min-w-max">
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 text-xs">✅</span>
                  <span className="font-medium">Implemented</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-2 text-xs">❌</span>
                  <span className="font-medium">Not Implemented</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mr-2 text-xs">⚠️</span>
                  <span className="font-medium">Partially</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2 text-xs">❓</span>
                  <span className="font-medium">Pending</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-xs">🪵</span>
                  <span className="font-medium">Via EventLogs</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mr-2 text-xs">🎚️</span>
                  <span className="font-medium">Via Enabling</span>
                </div>
              </div>
            </div>

            {/* Optional Telemetry Notice */}
            <div className="bg-blue-50/50 border-b border-blue-100 px-6 py-3 flex items-start sm:items-center gap-3">
              <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm text-blue-800">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 mr-1.5">New</span>
                telemetry doesn&apos;t affect scoring until 75% vendor adoption.
                <Link href="/scores#optional-telemetry" className="ml-1 font-semibold underline hover:text-blue-600">Learn more</Link>
              </p>
            </div>

            {/* Table Content */}
            <div className="relative min-h-[400px]">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 backdrop-blur-sm">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-medium">Loading telemetry data...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Unable to load data</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">{error}</p>
                  <button
                    onClick={() => loadTelemetry()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                renderTelemetryTable()
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          Data is continually updated based on vendor changes and community contributions.
        </div>
      </div>
    </TemplatePage>
  )
} 

import React, { useState, useEffect, useMemo, useRef } from 'react';
import TemplatePage from '../components/TemplatePage';
import useHeadingLinks from '../hooks/useHeadingLinks';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import styles from '../styles/statistics.module.css';
import dynamic from 'next/dynamic';

// Dynamically import our new components to prevent SSR issues with Chart.js
const FeatureAdoptionTimeline = dynamic(
  () => import('../components/FeatureAdoptionTimeline'),
  { ssr: false }
);

const FeatureExplorer = dynamic(
  () => import('../components/FeatureExplorer'),
  { ssr: false }
);

ChartJS.register(...registerables);

// Importing the scoring values from the scores page
const FEATURES_DICT_VALUED = {
  "Yes": 1,
  "No": 0,
  "Via EnablingTelemetry": 1,
  "Partially": 0.5,
  "Via EventLogs": 0.5,
  "Pending Response": 0
};

export default function Statistics() {
  // State for data
  const [windowsTelemetryData, setWindowsTelemetryData] = useState(null);
  const [linuxTelemetryData, setLinuxTelemetryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorStats, setVendorStats] = useState({});
  const [topFeatures, setTopFeatures] = useState({
    windows: [],
    linux: []
  });
  const [leastSupportedFeatures, setLeastSupportedFeatures] = useState({
    windows: [],
    linux: []
  });
  const [platformComparison, setPlatformComparison] = useState([]);
  
  // Add state for accordion sections
  const [expandedSections, setExpandedSections] = useState({
    summary: true,    // Initially expanded
    vendors: false,
    features: false,
    explore: false
  });

  // Function to toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Add heading links
  useHeadingLinks();
  
  // Load data on component mount
  useEffect(() => {
    loadAllTelemetryData();
  }, []);
  
  // Add useEffect to handle mobile table scrolling indicators
  useEffect(() => {
    const handleMobileTableScroll = () => {
      const tableContainers = document.querySelectorAll(`.${styles["mobile-table-container"]}`);
      
      tableContainers.forEach(container => {
        if (container.scrollWidth > container.clientWidth) {
          container.classList.add(styles["scrollable"]);
        } else {
          container.classList.remove(styles["scrollable"]);
        }
      });
    };
    
    // Run once on component mount
    if (!isLoading && !error) {
      setTimeout(handleMobileTableScroll, 500);
      
      // Add event listener for window resize
      window.addEventListener('resize', handleMobileTableScroll);
      
      // Add event listeners for accordion expansion/collapse
      const accordionHeaders = document.querySelectorAll(`.${styles["accordion-header"]}`);
      accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
          setTimeout(handleMobileTableScroll, 500);
        });
      });
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleMobileTableScroll);
      };
    }
  }, [isLoading, error, expandedSections]);
  
  // Additional useEffect to re-apply heading links after content loads
  useEffect(() => {
    if (!isLoading && !error) {
      const timer = setTimeout(() => {
        const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
        headings.forEach(heading => {
          const existingLink = heading.parentNode.querySelector('.heading-link');
          if (existingLink) {
            existingLink.remove();
          }
          heading.classList.remove('heading-processed');
        });
        
        // Trigger re-render
        setIsLoading(prev => prev);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error]);

  // Accordion Component for organizing content
  const Accordion = ({ id, title, description, isExpanded, onToggle, children }) => {
    return (
      <div className={styles["accordion-section"]}>
        <div 
          className={`${styles["accordion-header"]} ${isExpanded ? styles["expanded"] : ""}`}
          onClick={() => onToggle(id)}
        >
          <h2 id={id}>{title}</h2>
          <div className={styles["accordion-toggle"]}>
            <span>{isExpanded ? "−" : "+"}</span>
          </div>
        </div>
        
        {description && (
          <p className={styles["accordion-description"]}>{description}</p>
        )}
        
        <div className={`${styles["accordion-content"]} ${isExpanded ? styles["expanded"] : ""}`}>
          {isExpanded && children}
        </div>
      </div>
    );
  };

  // Load telemetry data from both platforms
  const loadAllTelemetryData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Windows data
      const windowsResponse = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json');
      if (!windowsResponse.ok) {
        throw new Error('Failed to fetch Windows telemetry data');
      }
      const windowsData = await windowsResponse.json();
      console.log('Windows Data Sample:', windowsData.slice(0, 2));

      // Check if data is valid
      if (!Array.isArray(windowsData) || windowsData.length === 0) {
        throw new Error('Invalid Windows telemetry data format');
      }
      
      setWindowsTelemetryData(windowsData);
      
      // Fetch Linux data
      const linuxResponse = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json');
      if (!linuxResponse.ok) {
        throw new Error('Failed to fetch Linux telemetry data');
      }
      const linuxData = await linuxResponse.json();
      console.log('Linux Data Sample:', linuxData.slice(0, 2));

      // Check if data is valid
      if (!Array.isArray(linuxData) || linuxData.length === 0) {
        throw new Error('Invalid Linux telemetry data format');
      }
      
      setLinuxTelemetryData(linuxData);
      
      // Process the data for statistics
      if (windowsData && linuxData) {
        processStatistics(windowsData, linuxData);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      console.error('Error loading telemetry data:', err);
    }
  };

  // Process the telemetry data to generate statistics
  const processStatistics = (windowsData, linuxData) => {
    // Clean up empty category rows
    const cleanWindowsData = windowsData.map(row => {
      if (row['Telemetry Feature Category'] === null) {
        row['Telemetry Feature Category'] = ''; // Convert null to empty string for consistency
      }
      return row;
    });
    
    const cleanLinuxData = linuxData.map(row => {
      if (row['Telemetry Feature Category'] === null) {
        row['Telemetry Feature Category'] = ''; // Convert null to empty string for consistency
      }
      return row;
    });
    
    // Get unique vendors from both platforms
    const windowsVendors = Object.keys(cleanWindowsData[0]).filter(key => 
      key !== 'Telemetry Feature Category' && 
      key !== 'Sub-Category' && 
      key !== 'Notes' &&
      key !== 'Feature' &&
      key !== 'Subcategory' &&
      key !== 'Sysmon' &&
      key !== 'Auditd');
    
    const linuxVendors = Object.keys(cleanLinuxData[0]).filter(key => 
      key !== 'Telemetry Feature Category' && 
      key !== 'Sub-Category' && 
      key !== 'Notes' &&
      key !== 'Feature' &&
      key !== 'Subcategory' &&
      key !== 'Sysmon' &&
      key !== 'Auditd');

    console.log('Windows Vendors:', windowsVendors);
    console.log('Linux Vendors:', linuxVendors);
    
    // Get all unique vendors
    const allVendors = [...new Set([...windowsVendors, ...linuxVendors])];
    console.log('All Vendors:', allVendors);
    
    // Initialize vendor statistics
    const vendorStatsObj = {};
    
    allVendors.forEach(vendor => {
      vendorStatsObj[vendor] = {
        windows: {
          supportedFeatures: 0,
          partiallySupported: 0,
          totalFeatures: 0,
          supportPercentage: 0,
          topFeatures: [],
          weakFeatures: []
        },
        linux: {
          supportedFeatures: 0,
          partiallySupported: 0,
          totalFeatures: 0,
          supportPercentage: 0,
          topFeatures: [],
          weakFeatures: []
        },
        overall: {
          supportedFeatures: 0,
          partiallySupported: 0,
          totalFeatures: 0,
          supportPercentage: 0
        }
      };
    });

    // Process Windows data
    processVendorStats(cleanWindowsData, vendorStatsObj, 'windows');
    
    // Process Linux data
    processVendorStats(cleanLinuxData, vendorStatsObj, 'linux');
    
    // Calculate overall stats for each vendor
    allVendors.forEach(vendor => {
      const windowsStats = vendorStatsObj[vendor].windows;
      const linuxStats = vendorStatsObj[vendor].linux;
      
      // Get the percentages
      const windowsSupport = parseFloat(windowsStats.supportPercentage) || 0;
      const linuxSupport = parseFloat(linuxStats.supportPercentage) || 0;
      
      // Calculate average of Windows and Linux support (equally weighted)
      const supportPercentage = ((windowsSupport + linuxSupport) / 2).toFixed(2);
      
      // Keep track of the total features and supported features for reference
      const totalFeatures = windowsStats.totalFeatures + linuxStats.totalFeatures;
      const supportedFeatures = windowsStats.supportedFeatures + linuxStats.supportedFeatures;
      const partiallySupported = windowsStats.partiallySupported + linuxStats.partiallySupported;
      
      vendorStatsObj[vendor].overall = {
        supportedFeatures: supportedFeatures,
        partiallySupported: partiallySupported,
        totalFeatures: totalFeatures,
        supportPercentage: supportPercentage
      };
    });
    
    console.log('Vendor Statistics:', vendorStatsObj);
    
    // Analyze feature support across vendors
    analyzeFeatureSupport(cleanWindowsData, cleanLinuxData);
    
    // Compare platforms for each vendor
    comparePlatforms(vendorStatsObj);

    // Set the state with the calculated stats
    setVendorStats(vendorStatsObj);
  };

  // Process vendor stats for a specific platform
  const processVendorStats = (data, statsObj, platform) => {
    // Get list of vendors
    const vendors = Object.keys(data[0]).filter(key => 
      key !== 'Telemetry Feature Category' && 
      key !== 'Sub-Category' && 
      key !== 'Notes' &&
      key !== 'Feature' &&
      key !== 'Subcategory' &&
      key !== 'Sysmon' &&
      key !== 'Auditd');
    
    console.log(`${platform} vendors:`, vendors);
    
    // Group features by category
    let currentCategory = "";
    const processedFeatures = new Set();
    
    // Initialize feature support counters for each feature
    const featureSupportCount = {};
    
    // Process each row of data
    data.forEach((row, index) => {
      // If Telemetry Feature Category is non-empty, update current category
      if (row['Telemetry Feature Category'] && row['Telemetry Feature Category'] !== "") {
        currentCategory = row['Telemetry Feature Category'];
      }
      
      // Get subcategory
      const subCategory = row['Sub-Category'];
      if (!subCategory || subCategory === "") {
        console.log(`Row ${index} has no valid subcategory`, row);
        return;
      }
      
      // Create a feature identifier
      const featureId = `${currentCategory} - ${subCategory}`;
      
      // If we've already processed this feature, skip
      if (processedFeatures.has(featureId)) {
        return;
      }
      
      processedFeatures.add(featureId);
      
      // Initialize counters for this feature
      if (!featureSupportCount[featureId]) {
        featureSupportCount[featureId] = {
          supportCount: 0,
          partialCount: 0,
          totalVendors: vendors.length
        };
      }
      
      // Count vendor support for this feature
      vendors.forEach(vendor => {
        // Skip if vendor doesn't exist in statsObj
        if (!statsObj[vendor]) return;
        
        const value = String(row[vendor] || "").trim();
        
        // Only count if we have a valid value
        if (value === "") return;
        
        // Always increment total features for the vendor if we have any value
        // We're processing each feature once, so this makes sense
        statsObj[vendor][platform].totalFeatures++;
        
        // Check support status
        if (value === 'Yes' || value === 'Via EnablingTelemetry') {
          statsObj[vendor][platform].supportedFeatures++;
          featureSupportCount[featureId].supportCount++;
        } else if (value === 'Partially' || value === 'Via EventLogs') {
          statsObj[vendor][platform].partiallySupported++;
          featureSupportCount[featureId].partialCount++;
        } 
        // We don't need to do anything special for "No" since it's not counted
      });
    });
    
    // Calculate support percentage for each vendor
    vendors.forEach(vendor => {
      if (!statsObj[vendor]) return;
      
      const vendorStats = statsObj[vendor][platform];
      
      // Only calculate percentage if we have features
      if (vendorStats.totalFeatures === 0) {
        vendorStats.supportPercentage = "0.00";
      } else {
        vendorStats.supportPercentage = (
          (vendorStats.supportedFeatures + vendorStats.partiallySupported * 0.5) / 
          vendorStats.totalFeatures * 100
        ).toFixed(2);
      }
    });
    
    console.log(`${platform} feature support counts:`, featureSupportCount);
    
    // Set feature support analysis
    const featureArray = Object.entries(featureSupportCount).map(([feature, stats]) => ({
      feature,
      supportPercentage: (
        (stats.supportCount + stats.partialCount * 0.5) / stats.totalVendors * 100
      ).toFixed(2),
      supportCount: stats.supportCount,
      partialCount: stats.partialCount,
      totalVendors: stats.totalVendors
    }));
    
    // Sort by support percentage
    featureArray.sort((a, b) => b.supportPercentage - a.supportPercentage);
    
    console.log(`${platform} feature array:`, featureArray);
    
    // Update state with top and least supported features
    setTopFeatures(prev => ({
      ...prev,
      [platform]: featureArray.slice(0, 10)
    }));
    
    setLeastSupportedFeatures(prev => ({
      ...prev,
      [platform]: featureArray.slice(-10).reverse()
    }));
  };

  // Analyze feature support across all vendors
  const analyzeFeatureSupport = (windowsData, linuxData) => {
    // This is just a placeholder function, we're actually performing the analysis in processVendorStats
    // We could add more complex feature comparisons here if needed
  };

  // Compare Windows vs Linux support for each vendor
  function comparePlatforms(statsObj) {
    const comparisonData = Object.keys(statsObj).map(vendor => {
      const stats = statsObj[vendor];
      const windowsSupport = parseFloat(stats.windows.supportPercentage) || 0;
      const linuxSupport = parseFloat(stats.linux.supportPercentage) || 0;
      const overallSupport = parseFloat(stats.overall.supportPercentage) || 0;
      const diff = windowsSupport - linuxSupport;
      
      let favors = 'equal';
      if (diff > 5) favors = 'windows';
      else if (diff < -5) favors = 'linux';
      
      return {
        vendor,
        windows: windowsSupport,
        linux: linuxSupport,
        overall: overallSupport,
        diff: Math.abs(diff),
        favors
      };
    }).sort((a, b) => {
      // Sort by overall support first, then by the platform with higher support
      if (Math.abs(b.overall - a.overall) > 1) {
        return b.overall - a.overall;
      }
      return b.diff - a.diff; // If overall is similar, sort by bigger platform difference
    });
    
    setPlatformComparison(comparisonData);
    return comparisonData;
  };

  // Helper function to determine color class based on percentage
  const getColorClass = (percentage) => {
    percentage = parseFloat(percentage);
    if (percentage >= 75) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    if (!vendorStats || Object.keys(vendorStats).length === 0) return null;
    
    const vendors = Object.values(vendorStats);
    
    // Calculate averages
    let totalWindowsSupport = 0;
    let totalLinuxSupport = 0;
    let totalOverallSupport = 0;
    let highestOverallSupport = 0;
    let lowestOverallSupport = 100;
    let bestVendor = '';
    let worstVendor = '';
    
    Object.entries(vendorStats).forEach(([vendor, stats]) => {
      const overallSupport = parseFloat(stats.overall.supportPercentage);
      totalWindowsSupport += parseFloat(stats.windows.supportPercentage);
      totalLinuxSupport += parseFloat(stats.linux.supportPercentage);
      totalOverallSupport += overallSupport;
      
      if (overallSupport > highestOverallSupport) {
        highestOverallSupport = overallSupport;
        bestVendor = vendor;
      }
      
      if (overallSupport < lowestOverallSupport) {
        lowestOverallSupport = overallSupport;
        worstVendor = vendor;
      }
    });
    
    const vendorCount = vendors.length;
    
    return {
      averageWindowsSupport: (totalWindowsSupport / vendorCount).toFixed(2),
      averageLinuxSupport: (totalLinuxSupport / vendorCount).toFixed(2),
      averageOverallSupport: (totalOverallSupport / vendorCount).toFixed(2),
      highestOverallSupport: highestOverallSupport.toFixed(2),
      lowestOverallSupport: lowestOverallSupport.toFixed(2),
      bestVendor,
      worstVendor,
      totalVendors: vendorCount
    };
  };

  const summaryStats = useMemo(() => calculateSummaryStats(), [vendorStats]);

  // Check if we have empty vendor stats
  const hasData = Object.keys(vendorStats).length > 0;

  // Platform Comparison Charts component
  const PlatformComparisonCharts = ({ platformComparisonData }) => {
    // Data for the radar chart
    const radarData = {
      labels: platformComparisonData.slice(0, 8).map(item => item.vendor),
      datasets: [
        {
          label: 'Windows Telemetry',
          data: platformComparisonData.slice(0, 8).map(item => item.windows),
          backgroundColor: 'rgba(66, 133, 244, 0.2)',
          borderColor: 'rgba(66, 133, 244, 1)',
          pointBackgroundColor: 'rgba(66, 133, 244, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(66, 133, 244, 1)',
        },
        {
          label: 'Linux Telemetry',
          data: platformComparisonData.slice(0, 8).map(item => item.linux),
          backgroundColor: 'rgba(219, 68, 55, 0.2)',
          borderColor: 'rgba(219, 68, 55, 1)',
          pointBackgroundColor: 'rgba(219, 68, 55, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(219, 68, 55, 1)',
        },
      ],
    };
    
    // Data for the bar chart comparing platforms
    const barData = {
      labels: platformComparisonData.slice(0, 8).map(item => item.vendor),
      datasets: [
        {
          label: 'Windows Telemetry',
          data: platformComparisonData.slice(0, 8).map(item => item.windows),
          backgroundColor: 'rgba(66, 133, 244, 0.7)',
          borderColor: 'rgba(66, 133, 244, 1)',
          borderWidth: 1,
        },
        {
          label: 'Linux Telemetry',
          data: platformComparisonData.slice(0, 8).map(item => item.linux),
          backgroundColor: 'rgba(219, 68, 55, 0.7)',
          borderColor: 'rgba(219, 68, 55, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    const barOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Platform Support Comparison (Top 8 Vendors)',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Support Percentage (%)'
          }
        }
      }
    };
    
    const radarOptions = {
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Platform Support Distribution (Top 8 Vendors)',
        },
      }
    };

    // Calculate platform bias distribution
    const platformBiasCount = platformComparisonData.reduce((acc, item) => {
      acc[item.favors] = (acc[item.favors] || 0) + 1;
      return acc;
    }, {});

    const pieData = {
      labels: ['Windows Bias', 'Linux Bias', 'Equal Support'],
      datasets: [
        {
          data: [
            platformBiasCount.windows || 0,
            platformBiasCount.linux || 0,
            platformBiasCount.equal || 0,
          ],
          backgroundColor: [
            'rgba(66, 133, 244, 0.7)',
            'rgba(219, 68, 55, 0.7)',
            'rgba(95, 99, 104, 0.7)',
          ],
          borderColor: [
            'rgba(66, 133, 244, 1)',
            'rgba(219, 68, 55, 1)',
            'rgba(95, 99, 104, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className={styles["charts-container"]}>
        <div className={styles["chart-row"]}>
          <div className={styles["chart-col"]}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className={styles["chart-row"]}>
          <div className={styles["chart-col"]}>
            <Radar data={radarData} options={radarOptions} />
          </div>
          <div className={styles["chart-col"]}>
            <div className={styles["chart-card"]}>
              <h4>Platform Bias Distribution</h4>
              <Pie data={pieData} />
              <div className={styles["chart-legend"]}>
                <div className={styles["legend-item"]}>
                  <span className={styles["legend-color"]} style={{ backgroundColor: 'rgba(66, 133, 244, 0.7)' }}></span>
                  <span>Windows Bias: {platformBiasCount.windows || 0} vendors</span>
                </div>
                <div className={styles["legend-item"]}>
                  <span className={styles["legend-color"]} style={{ backgroundColor: 'rgba(219, 68, 55, 0.7)' }}></span>
                  <span>Linux Bias: {platformBiasCount.linux || 0} vendors</span>
                </div>
                <div className={styles["legend-item"]}>
                  <span className={styles["legend-color"]} style={{ backgroundColor: 'rgba(95, 99, 104, 0.7)' }}></span>
                  <span>Equal Support: {platformBiasCount.equal || 0} vendors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tabs Component for platform selection
  const TabsComponent = ({ children, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || 'windows');
    
    return (
      <div className={styles["tabs-container"]}>
        <div className={styles["tabs-header"]}>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'windows' ? styles.active : ''}`} 
            onClick={() => setActiveTab('windows')}
          >
            Windows
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'linux' ? styles.active : ''}`} 
            onClick={() => setActiveTab('linux')}
          >
            Linux
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'comparison' ? styles.active : ''}`} 
            onClick={() => setActiveTab('comparison')}
          >
            Platform Comparison
          </button>
        </div>
        <div className={styles["tab-content"]}>
          {children.find(child => child.props.tabId === activeTab)}
        </div>
      </div>
    );
  };

  const TabPanel = ({ children, tabId }) => {
    return (
      <div className={styles["tab-panel"]} role="tabpanel" id={`tab-${tabId}`}>
        {children}
      </div>
    );
  };

  // Feature Support Chart component
  const FeatureSupportChart = ({ features, title, chartType = 'bar' }) => {
    // Prepare data for chart
    const labels = features.map(f => f.feature.split(' - ')[1] || f.feature); // Use subcategory for readability
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Full Support',
          data: features.map(f => (f.supportCount / f.totalVendors * 100).toFixed(2)),
          backgroundColor: 'rgba(52, 168, 83, 0.7)',
          borderColor: 'rgba(52, 168, 83, 1)',
          borderWidth: 1,
        },
        {
          label: 'Partial Support',
          data: features.map(f => (f.partialCount / f.totalVendors * 100).toFixed(2)),
          backgroundColor: 'rgba(251, 188, 5, 0.7)',
          borderColor: 'rgba(251, 188, 5, 1)',
          borderWidth: 1,
        }
      ]
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Support Percentage (%)'
          }
        }
      }
    };
    
    const pieData = {
      labels: features.map(f => f.feature.split(' - ')[1] || f.feature),
      datasets: [
        {
          data: features.map(f => parseFloat(f.supportPercentage)),
          backgroundColor: [
            'rgba(66, 133, 244, 0.7)',
            'rgba(52, 168, 83, 0.7)',
            'rgba(251, 188, 5, 0.7)',
            'rgba(219, 68, 55, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(201, 203, 207, 0.7)',
            'rgba(0, 162, 232, 0.7)',
            'rgba(162, 0, 232, 0.7)',
            'rgba(232, 162, 0, 0.7)',
          ],
          borderColor: [
            'rgba(66, 133, 244, 1)',
            'rgba(52, 168, 83, 1)',
            'rgba(251, 188, 5, 1)',
            'rgba(219, 68, 55, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 232, 1)',
            'rgba(162, 0, 232, 1)',
            'rgba(232, 162, 0, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        title: {
          display: true,
          text: title,
        },
      }
    };
    
    return (
      <div className={styles["feature-chart-container"]}>
        {chartType === 'bar' ? (
          <div style={{ height: '400px' }}>
            <Bar data={data} options={options} />
          </div>
        ) : (
          <div style={{ height: '350px' }}>
            <Doughnut data={pieData} options={doughnutOptions} />
          </div>
        )}
      </div>
    );
  };

  // Summary Dashboard component
  const SummaryDashboard = ({ vendorStats, summaryStats }) => {
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    
    // Convert vendor stats to arrays for charts
    const vendors = Object.keys(vendorStats);
    const overallSupport = vendors.map(v => parseFloat(vendorStats[v].overall.supportPercentage));
    const windowsSupport = vendors.map(v => parseFloat(vendorStats[v].windows.supportPercentage));
    const linuxSupport = vendors.map(v => parseFloat(vendorStats[v].linux.supportPercentage));
    
    // Find best vendor for each platform
    const bestWindowsVendor = vendors.reduce((best, vendor) => 
      parseFloat(vendorStats[vendor].windows.supportPercentage) > parseFloat(vendorStats[best].windows.supportPercentage) 
        ? vendor : best, vendors[0]);
        
    const bestLinuxVendor = vendors.reduce((best, vendor) => 
      parseFloat(vendorStats[vendor].linux.supportPercentage) > parseFloat(vendorStats[best].linux.supportPercentage) 
        ? vendor : best, vendors[0]);
    
    return (
      <div className={styles["summary-stats-display"]}>
        <div className={styles["platform-selector"]}>
          <button 
            className={`${styles["platform-button"]} ${selectedPlatform === 'all' ? styles['platform-active'] : ''}`}
            onClick={() => setSelectedPlatform('all')}
          >
            All Platforms
          </button>
          <button 
            className={`${styles["platform-button"]} ${selectedPlatform === 'windows' ? styles['platform-active'] : ''}`}
            onClick={() => setSelectedPlatform('windows')}
          >
            Windows
          </button>
          <button 
            className={`${styles["platform-button"]} ${selectedPlatform === 'linux' ? styles['platform-active'] : ''}`}
            onClick={() => setSelectedPlatform('linux')}
          >
            Linux
          </button>
        </div>

        <div className={styles["summary-stat-boxes"]}>
          {selectedPlatform === 'all' ? (
            <>
              <div className={`${styles["summary-stat-box"]} ${styles["overall"]}`}>
                <span className={styles["stat-title"]}>Average Telemetry Support</span>
                <span className={styles["stat-value"]}>{summaryStats.averageOverallSupport}%</span>
                <p className={styles["stat-description"]}>Average telemetry support across all vendors and platforms</p>
              </div>
              
              <div className={`${styles["summary-stat-box"]} ${styles["leading"]}`}>
                <span className={styles["stat-title"]}>Leading Vendor</span>
                <span className={styles["stat-value"]}>{summaryStats.bestVendor}</span>
                <p className={styles["stat-description"]}>{summaryStats.highestOverallSupport}% overall support across platforms</p>
              </div>
            </>
          ) : selectedPlatform === 'windows' ? (
            <>
              <div className={`${styles["summary-stat-box"]} ${styles["overall"]}`}>
                <span className={styles["stat-title"]}>Average Windows Telemetry Support</span>
                <span className={styles["stat-value"]}>{summaryStats.averageWindowsSupport}%</span>
                <p className={styles["stat-description"]}>Average Windows telemetry support across all vendors</p>
              </div>
              
              <div className={`${styles["summary-stat-box"]} ${styles["leading"]}`}>
                <span className={styles["stat-title"]}>Leading Windows Vendor</span>
                <span className={styles["stat-value"]}>{bestWindowsVendor}</span>
                <p className={styles["stat-description"]}>{vendorStats[bestWindowsVendor].windows.supportPercentage}% Windows support</p>
              </div>
            </>
          ) : (
            <>
              <div className={`${styles["summary-stat-box"]} ${styles["overall"]}`}>
                <span className={styles["stat-title"]}>Average Linux Telemetry Support</span>
                <span className={styles["stat-value"]}>{summaryStats.averageLinuxSupport}%</span>
                <p className={styles["stat-description"]}>Average Linux telemetry support across all vendors</p>
              </div>
              
              <div className={`${styles["summary-stat-box"]} ${styles["leading"]}`}>
                <span className={styles["stat-title"]}>Leading Linux Vendor</span>
                <span className={styles["stat-value"]}>{bestLinuxVendor}</span>
                <p className={styles["stat-description"]}>{vendorStats[bestLinuxVendor].linux.supportPercentage}% Linux support</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Feature Table component with pagination and filtering
  const FeatureTable = ({ features, title, itemsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'supportPercentage', direction: 'desc' });
    
    // Filter features based on search term
    const filteredFeatures = features.filter(feature => 
      feature.feature.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort features based on sort configuration
    const sortedFeatures = useMemo(() => {
      const sortableFeatures = [...filteredFeatures];
      if (sortConfig.key) {
        sortableFeatures.sort((a, b) => {
          if (sortConfig.key === 'supportPercentage' || sortConfig.key === 'supportCount' || sortConfig.key === 'partialCount') {
            return sortConfig.direction === 'asc' 
              ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
              : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
          } else {
            // For string comparisons (feature name)
            return sortConfig.direction === 'asc'
              ? a[sortConfig.key].localeCompare(b[sortConfig.key])
              : b[sortConfig.key].localeCompare(a[sortConfig.key]);
          }
        });
      }
      return sortableFeatures;
    }, [filteredFeatures, sortConfig]);
    
    // Pagination
    const totalPages = Math.ceil(sortedFeatures.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedFeatures.slice(indexOfFirstItem, indexOfLastItem);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Request sort
    const requestSort = (key) => {
      let direction = 'desc';
      if (sortConfig.key === key && sortConfig.direction === 'desc') {
        direction = 'asc';
      }
      setSortConfig({ key, direction });
    };
    
    // Get sort direction indicator
    const getSortDirectionIndicator = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    };
    
    return (
      <div className={styles["feature-table-container"]}>
        <div className={styles["feature-table-header"]}>
          <h4>{title}</h4>
          <div className={styles["feature-table-controls"]}>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className={styles["search-input"]}
              />
            </div>
            <div className={styles["items-per-page"]}>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setCurrentPage(1);
                  // This would typically update itemsPerPage, but we're keeping it simple
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className={styles["mobile-table-container"]}>
          <table className={styles["feature-table"]}>
            <thead>
              <tr>
                <th onClick={() => requestSort('feature')} className={styles.sortable}>
                  Telemetry Feature {getSortDirectionIndicator('feature')}
                </th>
                <th onClick={() => requestSort('supportPercentage')} className={styles.sortable}>
                  Support % {getSortDirectionIndicator('supportPercentage')}
                </th>
                <th onClick={() => requestSort('supportCount')} className={styles.sortable}>
                  Full Support {getSortDirectionIndicator('supportCount')}
                </th>
                <th onClick={() => requestSort('partialCount')} className={styles.sortable}>
                  Partial Support {getSortDirectionIndicator('partialCount')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((feature, index) => (
                  <tr key={index}>
                    <td>{feature.feature}</td>
                    <td className={styles[getColorClass(feature.supportPercentage)]}>
                      {feature.supportPercentage}%
                    </td>
                    <td>{feature.supportCount}/{feature.totalVendors}</td>
                    <td>{feature.partialCount}/{feature.totalVendors}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles["no-results"]}>No matching features found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={() => paginate(1)} 
              disabled={currentPage === 1}
              className={styles["pagination-button"]}
            >
              &laquo;
            </button>
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className={styles["pagination-button"]}
            >
              &lsaquo;
            </button>
            
            <div className={styles["pagination-info"]}>
              Page {currentPage} of {totalPages}
            </div>
            
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className={styles["pagination-button"]}
            >
              &rsaquo;
            </button>
            <button 
              onClick={() => paginate(totalPages)} 
              disabled={currentPage === totalPages}
              className={styles["pagination-button"]}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    );
  };

  // Vendor Comparison Table with filtering
  const VendorComparisonTable = ({ vendorStats }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'overall.supportPercentage', direction: 'desc' });
    
    // Filter vendors based on search term
    const filteredVendors = Object.entries(vendorStats).filter(([vendor, stats]) => 
      vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort vendors based on sort configuration
    const sortedVendors = useMemo(() => {
      return [...filteredVendors].sort((a, b) => {
        const getSortValue = (vendor, key) => {
          const [mainKey, subKey] = key.split('.');
          if (subKey) {
            return parseFloat(vendor[1][mainKey][subKey]);
          }
          return vendor[0]; // For vendor name sorting
        };
        
        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);
        
        if (sortConfig.key === 'vendor') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }, [filteredVendors, sortConfig]);
    
    // Request sort
    const requestSort = (key) => {
      let direction = 'desc';
      if (sortConfig.key === key && sortConfig.direction === 'desc') {
        direction = 'asc';
      }
      setSortConfig({ key, direction });
    };
    
    // Get sort direction indicator
    const getSortDirectionIndicator = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    };
    
    return (
      <div className={styles["feature-table-container"]}>
        <div className={styles["feature-table-header"]}>
          <h4>Vendor Comparison</h4>
          <div className={styles["feature-table-controls"]}>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles["search-input"]}
              />
            </div>
          </div>
        </div>
        
        <div className={styles["mobile-table-container"]}>
          <table className={styles["feature-table"]}>
            <thead>
              <tr>
                <th onClick={() => requestSort('vendor')} className={styles.sortable}>
                  Vendor {getSortDirectionIndicator('vendor')}
                </th>
                <th onClick={() => requestSort('overall.supportPercentage')} className={styles.sortable}>
                  Overall Telemetry Support {getSortDirectionIndicator('overall.supportPercentage')}
                </th>
                <th onClick={() => requestSort('windows.supportPercentage')} className={styles.sortable}>
                  Windows Telemetry Support {getSortDirectionIndicator('windows.supportPercentage')}
                </th>
                <th onClick={() => requestSort('linux.supportPercentage')} className={styles.sortable}>
                  Linux Telemetry Support {getSortDirectionIndicator('linux.supportPercentage')}
                </th>
                <th onClick={() => requestSort('overall.totalFeatures')} className={styles.sortable}>
                  Total Telemetry Features {getSortDirectionIndicator('overall.totalFeatures')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVendors.length > 0 ? (
                sortedVendors.map(([vendor, stats]) => (
                  <tr key={vendor}>
                    <td><strong>{vendor}</strong></td>
                    <td className={styles[getColorClass(stats.overall.supportPercentage)]}>
                      {stats.overall.supportPercentage}%
                    </td>
                    <td className={styles[getColorClass(stats.windows.supportPercentage)]}>
                      {stats.windows.supportPercentage}%
                    </td>
                    <td className={styles[getColorClass(stats.linux.supportPercentage)]}>
                      {stats.linux.supportPercentage}%
                    </td>
                    <td>{stats.overall.totalFeatures} telemetry features</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles["no-results"]}>No matching vendors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Platform-specific feature list component
  const PlatformFeatures = ({ platform, topFeatures, leastSupportedFeatures }) => {
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [selectedViews, setSelectedViews] = useState({
      charts: true,
      tables: true
    });
    
    // Handle view selection
    const toggleView = (view) => {
      setSelectedViews(prev => ({
        ...prev,
        [view]: !prev[view]
      }));
    };
    
    // Get all features for the platform
    const allFeatures = useMemo(() => {
      // This would be all features for the platform, not just top/least supported
      // For this example, we'll combine top and least
      const combined = [...topFeatures[platform], ...leastSupportedFeatures[platform]];
      // Remove duplicates
      const uniqueFeatures = combined.filter((feature, index, self) => 
        index === self.findIndex(f => f.feature === feature.feature)
      );
      return uniqueFeatures;
    }, [platform, topFeatures, leastSupportedFeatures]);
    
    return (
      <div className={styles["platform-features"]}>
        <div className={styles["platform-header"]}>
          <h3>{platform === 'windows' ? 'Windows' : 'Linux'} Telemetry Features</h3>
          <p>Explore telemetry feature support data for {platform === 'windows' ? 'Windows' : 'Linux'} platforms.</p>
        </div>
        
        <div className={styles["content-controls"]}>
          <div className={styles["section-controls"]}>
            <button 
              className={`${styles["section-button"]} ${!showAllFeatures ? styles.active : ''}`}
              onClick={() => setShowAllFeatures(false)}
            >
              Top & Least Supported
            </button>
            <button 
              className={`${styles["section-button"]} ${showAllFeatures ? styles.active : ''}`}
              onClick={() => setShowAllFeatures(true)}
            >
              All Features
            </button>
          </div>
          
          <div className={styles["view-controls"]}>
            <div className={styles["view-control-title"]}>Show:</div>
            <div className={styles["view-options"]}>
              <label className={styles["view-option"]}>
                <input 
                  type="checkbox" 
                  checked={selectedViews.charts} 
                  onChange={() => toggleView('charts')}
                />
                <span>Charts</span>
              </label>
              <label className={styles["view-option"]}>
                <input 
                  type="checkbox" 
                  checked={selectedViews.tables} 
                  onChange={() => toggleView('tables')}
                />
                <span>Tables</span>
              </label>
            </div>
          </div>
        </div>
        
        {!showAllFeatures ? (
          <>
            <div className={styles["section-header"]}>
              <h3>Most Supported Telemetry Features</h3>
              <p>Telemetry features with the highest support across all EDR vendors.</p>
            </div>
            
            {selectedViews.charts && (
              <div className={styles["chart-container"]}>
                <div className={styles["chart-row"]}>
                  <div className={styles["chart-col"]}>
                    <FeatureSupportChart 
                      features={topFeatures[platform]} 
                      title={`${platform === 'windows' ? 'Windows' : 'Linux'} - Top Supported Telemetry Features`} 
                    />
                  </div>
                  <div className={styles["chart-col"]}>
                    <FeatureSupportChart 
                      features={topFeatures[platform].slice(0, 5)} 
                      title={`Top 5 ${platform === 'windows' ? 'Windows' : 'Linux'} Telemetry Features`} 
                      chartType="doughnut" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {selectedViews.tables && (
              <FeatureTable 
                features={topFeatures[platform]} 
                title={`${platform === 'windows' ? 'Windows' : 'Linux'} - Top Supported Telemetry Features`} 
              />
            )}
            
            <div className={styles["section-divider"]}></div>
            
            <div className={styles["section-header"]}>
              <h3>Least Supported Telemetry Features</h3>
              <p>Telemetry features with the lowest support across all EDR vendors.</p>
            </div>
            
            {selectedViews.charts && (
              <div className={styles["chart-container"]}>
                <div className={styles["chart-row"]}>
                  <div className={styles["chart-col"]}>
                    <FeatureSupportChart 
                      features={leastSupportedFeatures[platform]} 
                      title={`${platform === 'windows' ? 'Windows' : 'Linux'} - Least Supported Telemetry Features`} 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {selectedViews.tables && (
              <FeatureTable 
                features={leastSupportedFeatures[platform]} 
                title={`${platform === 'windows' ? 'Windows' : 'Linux'} - Least Supported Telemetry Features`} 
              />
            )}
          </>
        ) : (
          <>
            <div className={styles["section-header"]}>
              <h3>All Telemetry Features</h3>
              <p>Complete list of all telemetry features for {platform === 'windows' ? 'Windows' : 'Linux'} platforms.</p>
            </div>
            
            {selectedViews.tables && (
              <FeatureTable 
                features={allFeatures} 
                title={`All ${platform === 'windows' ? 'Windows' : 'Linux'} Telemetry Features`} 
                itemsPerPage={25}
              />
            )}
          </>
        )}
      </div>
    );
  };

  // Vendor Overview component
  const VendorOverview = ({ vendorStats }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCount, setDisplayCount] = useState(5);
    const [sortBy, setSortBy] = useState('overall');
    const [sortOrder, setSortOrder] = useState('desc');

    // Filter and sort vendors
    const filteredAndSortedVendors = useMemo(() => {
      return Object.entries(vendorStats)
        .filter(([vendor]) => 
          vendor.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const aValue = parseFloat(a[1][sortBy].supportPercentage);
          const bValue = parseFloat(b[1][sortBy].supportPercentage);
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        })
        .slice(0, displayCount);
    }, [vendorStats, searchTerm, displayCount, sortBy, sortOrder]);

    // Handle sort change
    const handleSortChange = (newSortBy) => {
      if (sortBy === newSortBy) {
        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
      } else {
        setSortBy(newSortBy);
        setSortOrder('desc');
      }
    };

    return (
      <>
        <div className={styles["vendor-controls"]}>
          <div className={styles["vendor-filters"]}>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles["search-input"]}
              />
            </div>
            
            <div className={styles["display-count"]}>
              <label>Show: </label>
              <select 
                value={displayCount} 
                onChange={(e) => setDisplayCount(Number(e.target.value))}
              >
                <option value={5}>5 vendors</option>
                <option value={10}>10 vendors</option>
                <option value={15}>15 vendors</option>
                <option value={1000}>All vendors</option>
              </select>
            </div>
          </div>
          
          <div className={styles["sort-controls"]}>
            <label>Sort by: </label>
            <div className={styles["sort-buttons"]}>
              <button 
                className={`${styles["sort-button"]} ${sortBy === 'overall' ? styles.active : ''}`}
                onClick={() => handleSortChange('overall')}
              >
                Overall {sortBy === 'overall' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                className={`${styles["sort-button"]} ${sortBy === 'windows' ? styles.active : ''}`}
                onClick={() => handleSortChange('windows')}
              >
                Windows {sortBy === 'windows' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                className={`${styles["sort-button"]} ${sortBy === 'linux' ? styles.active : ''}`}
                onClick={() => handleSortChange('linux')}
              >
                Linux {sortBy === 'linux' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles["platform-legend"]}>
          <div className={styles["legend-item"]}>
            <div className={`${styles["legend-color"]} ${styles.windows}`}></div>
            <span>Windows</span>
          </div>
          <div className={styles["legend-item"]}>
            <div className={`${styles["legend-color"]} ${styles.linux}`}></div>
            <span>Linux</span>
          </div>
        </div>
        
        <div className={styles["stats-grid"]}>
          {filteredAndSortedVendors.map(([vendor, stats]) => (
            <div key={vendor} className={styles["vendor-stat-card"]}>
              <h4>{vendor}</h4>
              <div className={styles["stat-item"]}>
                <span className={styles["stat-label"]}>Overall Telemetry Support</span>
                <span className={`${styles["stat-value"]} ${styles[getColorClass(stats.overall.supportPercentage)]}`}>
                  {stats.overall.supportPercentage}%
                </span>
              </div>
              <div className={styles["stat-item"]}>
                <span className={styles["stat-label"]}>Windows Telemetry Support:</span>
                <span className={`${styles["stat-value"]} ${styles[getColorClass(stats.windows.supportPercentage)]}`}>
                  {stats.windows.supportPercentage}%
                </span>
              </div>
              <div className={styles["stat-item"]}>
                <span className={styles["stat-label"]}>Linux Telemetry Support:</span>
                <span className={`${styles["stat-value"]} ${styles[getColorClass(stats.linux.supportPercentage)]}`}>
                  {stats.linux.supportPercentage}%
                </span>
              </div>
              <div className={styles["stat-item"]}>
                <span className={styles["stat-label"]}>Total Telemetry Features:</span>
                <span className={styles["stat-value"]}>
                  {stats.overall.totalFeatures}
                </span>
              </div>
              <div className={styles["platform-comparison-bar"]}>
                <div 
                  className={styles["windows-bar"]} 
                  style={{ width: `${stats.windows.supportPercentage}%` }} 
                  title={`Windows support: ${stats.windows.supportPercentage}%`}
                ></div>
                <div 
                  className={styles["linux-bar"]} 
                  style={{ width: `${stats.linux.supportPercentage}%` }} 
                  title={`Linux support: ${stats.linux.supportPercentage}%`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Add state for the active explore tab
  const [activeExploreTab, setActiveExploreTab] = useState('timeline');
  
  // Add platform state if it doesn't exist
  const [platform, setPlatform] = useState('windows');
  
  // Add a function to handle tab switching
  const handleExploreTabChange = (tab) => {
    setActiveExploreTab(tab);
  };

  if (isLoading) {
    return (
      <TemplatePage title="EDR Statistics | EDR Telemetry Project" description="Statistics and analysis of EDR telemetry capabilities across different platforms">
        <div className={styles.loading}>
          <div className={styles["loading-spinner"]}></div>
          <span>Loading statistics data...</span>
        </div>
      </TemplatePage>
    );
  }

  if (error) {
    return (
      <TemplatePage title="EDR Statistics | EDR Telemetry Project" description="Statistics and analysis of EDR telemetry capabilities across different platforms">
        <div className={styles.error}>
          <div>
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <p>Please try again later or contact the administrator if the problem persists.</p>
          </div>
        </div>
      </TemplatePage>
    );
  }

  return (
    <TemplatePage title="EDR Statistics | EDR Telemetry Project" description="Statistics and analysis of EDR telemetry capabilities across different platforms">
      
      <div className="hero-section">
        <div className="hero-content">
          <h1>EDR Telemetry Statistics</h1>
          <p>Comprehensive analysis of EDR vendor telemetry capabilities across Windows and Linux platforms.</p>
        </div>
      </div>
      
      {!hasData ? (
        <div className={styles["empty-state"]}>
          <div className={styles["empty-state-icon"]}>📊</div>
          <div className={styles["empty-state-message"]}>No statistics data available</div>
          <div className={styles["empty-state-description"]}>
            We couldn&apos;t retrieve any EDR telemetry data. Please check your connection or try again later.
          </div>
        </div>
      ) : (
        <div className={styles["stats-container"]}>
          {/* Navigation quick links */}
          <div className={styles["nav-links"]}>
            <button onClick={() => toggleSection('summary')} className={expandedSections.summary ? styles["active"] : ""}>
              Summary
            </button>
            <button onClick={() => toggleSection('vendors')} className={expandedSections.vendors ? styles["active"] : ""}>
              Vendors
            </button>
            <button onClick={() => toggleSection('features')} className={expandedSections.features ? styles["active"] : ""}>
              Features
            </button>
            <button onClick={() => toggleSection('explore')} className={expandedSections.explore ? styles["active"] : ""}>
              Explore
            </button>
          </div>
          
          {/* Summary Statistics Section */}
          <Accordion 
            id="summary" 
            title="Summary Statistics" 
            description="Overview of telemetry support across all EDR vendors"
            isExpanded={expandedSections.summary}
            onToggle={toggleSection}
          >
            {summaryStats && (
              <div className={styles["accordion-inner-content"]}>
                <p className={styles["summary-description"]}>
                  These cards summarize telemetry support across EDR vendors and platforms.
                  Overall support percentages are calculated as the simple average of Windows and Linux support percentages,
                  giving equal weight to both platforms. Use the platform selector to view statistics for specific platforms.
                </p>
                
                <SummaryDashboard vendorStats={vendorStats} summaryStats={summaryStats} />
              </div>
            )}
          </Accordion>
          
          {/* Vendor Overview Section */}
          <Accordion 
            id="vendors" 
            title="Vendor Overview" 
            description="Comprehensive analysis of each EDR vendor's telemetry capabilities"
            isExpanded={expandedSections.vendors}
            onToggle={toggleSection}
          >
            <div className={styles["accordion-inner-content"]}>
              <VendorOverview vendorStats={vendorStats} />
              
              <h3 id="vendor-table-view">Vendor Table View</h3>
              <VendorComparisonTable vendorStats={vendorStats} />
            </div>
          </Accordion>
          
          {/* Platform Features Section */}
          <Accordion 
            id="features" 
            title="Platform Telemetry Features" 
            description="Explore telemetry features by platform and their support among vendors"
            isExpanded={expandedSections.features}
            onToggle={toggleSection}
          >
            <div className={styles["accordion-inner-content"]}>
              <TabsComponent defaultTab="windows">
                <TabPanel tabId="windows">
                  <PlatformFeatures 
                    platform="windows" 
                    topFeatures={topFeatures} 
                    leastSupportedFeatures={leastSupportedFeatures}
                  />
                </TabPanel>
                
                <TabPanel tabId="linux">
                  <PlatformFeatures 
                    platform="linux" 
                    topFeatures={topFeatures} 
                    leastSupportedFeatures={leastSupportedFeatures}
                  />
                </TabPanel>
                
                <TabPanel tabId="comparison">
                  <div className={styles["platform-comparison"]}>
                    <div className={styles["platform-header"]}>
                      <h3>Platform Telemetry Comparison</h3>
                      <p>Compare telemetry support across Windows and Linux platforms.</p>
                    </div>
                    
                    <div className={styles["section-divider"]}></div>
                    
                    <div className={styles["section-header"]}>
                      <h3>Platform Telemetry Comparison Charts</h3>
                      <p>Visualizations of vendor telemetry feature support across Windows and Linux platforms.</p>
                    </div>
                    
                    {platformComparison.length > 0 && 
                      <PlatformComparisonCharts platformComparisonData={platformComparison} />
                    }
                    
                    <div className={styles["section-divider"]}></div>
                    
                    <div className={styles["section-header"]}>
                      <h3>Platform Telemetry Comparison Table</h3>
                      <p>This table compares telemetry feature support across Windows and Linux platforms for each vendor.</p>
                    </div>
                    
                    <p className={`${styles.mb4} ${styles.description}`} style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                      The <strong>Overall</strong> percentage is calculated as the simple average of Windows and Linux support percentages,
                      giving equal weight to both platforms: (Windows% + Linux%) ÷ 2. Each percentage represents the level of 
                      telemetry feature support on that platform.
                    </p>
                    
                    <div className={styles["feature-table-container"]}>
                      <div className={styles["mobile-table-container"]}>
                        <table className={styles["vendor-comparison"]}>
                          <thead>
                            <tr>
                              <th>Vendor</th>
                              <th>Windows Telemetry</th>
                              <th>Linux Telemetry</th>
                              <th>Overall Telemetry</th>
                              <th>Platform Bias</th>
                            </tr>
                          </thead>
                          <tbody>
                            {platformComparison.map((vendor, index) => (
                              <tr key={index}>
                                <td>{vendor.vendor}</td>
                                <td>{vendor.windows.toFixed(2)}%</td>
                                <td>{vendor.linux.toFixed(2)}%</td>
                                <td>{vendor.overall.toFixed(2)}%</td>
                                <td>
                                  <span className={`${styles.favors} ${styles[vendor.favors]}`}>
                                    {vendor.favors === 'equal' ? 'Equal' : 
                                    vendor.favors === 'windows' ? 'Windows' : 'Linux'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabsComponent>
            </div>
          </Accordion>
          
          {/* Explore Telemetry Data Section */}
          <Accordion 
            id="explore" 
            title="Explore Telemetry Data Adoption" 
            description="Interactive visualizations and data exploration tools"
            isExpanded={expandedSections.explore}
            onToggle={toggleSection}
          >
            <div className={styles["accordion-inner-content"]}>
              <div className={styles['tab-navigation']}>
                <button 
                  className={`${styles['tab-button']} ${activeExploreTab === 'timeline' ? styles['tab-active'] : ''}`}
                  onClick={() => handleExploreTabChange('timeline')}
                >
                  Feature Adoption Timeline
                </button>
                <button 
                  className={`${styles['tab-button']} ${activeExploreTab === 'explorer' ? styles['tab-active'] : ''}`}
                  onClick={() => handleExploreTabChange('explorer')}
                >
                  Interactive Feature Explorer
                </button>
              </div>
              
              <div className={styles['tab-content']}>
                {activeExploreTab === 'timeline' && (
                  <div>
                    <div className={styles['tab-description']}>
                      <p>Track how telemetry feature adoption has evolved over time across different platforms. This timeline shows the percentage of vendors supporting key telemetry features by quarter.</p>
                    </div>
                    <FeatureAdoptionTimeline 
                      platform={platform} 
                      onPlatformChange={(newPlatform) => setPlatform(newPlatform)}
                    />
                  </div>
                )}
                
                {activeExploreTab === 'explorer' && (
                  <div>
                    <div className={styles['tab-description']}>
                      <p>Explore telemetry features in depth with interactive filtering and visualization tools. Select vendors, categories, and chart types to analyze feature support across the industry.</p>
                    </div>
                    <FeatureExplorer initialPlatform={platform} />
                  </div>
                )}
              </div>
            </div>
          </Accordion>
        </div>
      )}
    </TemplatePage>
  );
} 

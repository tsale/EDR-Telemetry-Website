import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from '../styles/explorer.module.css';

const FeatureAdoptionTimeline = ({ platform: initialPlatform = 'all', onPlatformChange }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [compareMode, setCompareMode] = useState('current'); // 'current', 'historical', or 'both'
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState(initialPlatform);
  const dropdownRef = useRef(null);

  // Define color palette for chart bars
  const colorPalette = [
    'rgba(66, 133, 244, 0.7)',   // Google Blue
    'rgba(219, 68, 55, 0.7)',    // Google Red
    'rgba(244, 180, 0, 0.7)',    // Google Yellow
    'rgba(15, 157, 88, 0.7)',    // Google Green
    'rgba(171, 71, 188, 0.7)',   // Purple
    'rgba(0, 172, 193, 0.7)',    // Teal
    'rgba(255, 112, 67, 0.7)',   // Deep Orange
    'rgba(141, 110, 99, 0.7)',   // Brown
    'rgba(120, 144, 156, 0.7)',  // Blue Grey
    'rgba(38, 198, 218, 0.7)'    // Cyan
  ];

  // Historical data URLs (Dec 16, 2024)
  const HISTORICAL_WINDOWS_URL = 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/9e0c2a79127be15ea30548884b03db52c770eed9/EDR_telem_windows.json';
  const HISTORICAL_LINUX_URL = 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/9e0c2a79127be15ea30548884b03db52c770eed9/EDR_telem_linux.json';
  
  // Current data URLs
  const CURRENT_WINDOWS_URL = 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json';
  const CURRENT_LINUX_URL = 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json';

  // Add click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVendorDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Monitor changes to the initialPlatform prop
  useEffect(() => {
    if (initialPlatform !== platform) {
      setPlatform(initialPlatform);
      // Don't call onPlatformChange here to avoid infinite loops
    }
  }, [initialPlatform]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load data for selected platform or both
        let currentWindowsData = null;
        let currentLinuxData = null;
        let historicalWindowsData = null;
        let historicalLinuxData = null;
        
        // Load current data
        if (platform === 'all' || platform === 'windows') {
          const windowsResponse = await fetch(CURRENT_WINDOWS_URL);
          if (!windowsResponse.ok) {
            throw new Error('Failed to fetch current Windows telemetry data');
          }
          currentWindowsData = await windowsResponse.json();
        }
        
        if (platform === 'all' || platform === 'linux') {
          const linuxResponse = await fetch(CURRENT_LINUX_URL);
          if (!linuxResponse.ok) {
            throw new Error('Failed to fetch current Linux telemetry data');
          }
          currentLinuxData = await linuxResponse.json();
        }
        
        // Load historical data (Dec 16, 2024)
        if (platform === 'all' || platform === 'windows') {
          const histWindowsResponse = await fetch(HISTORICAL_WINDOWS_URL);
          if (!histWindowsResponse.ok) {
            throw new Error('Failed to fetch historical Windows telemetry data');
          }
          historicalWindowsData = await histWindowsResponse.json();
        }
        
        if (platform === 'all' || platform === 'linux') {
          const histLinuxResponse = await fetch(HISTORICAL_LINUX_URL);
          if (!histLinuxResponse.ok) {
            throw new Error('Failed to fetch historical Linux telemetry data');
          }
          historicalLinuxData = await histLinuxResponse.json();
        }
        
        // Process the data
        processData(currentWindowsData, currentLinuxData, historicalWindowsData, historicalLinuxData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error('Error loading telemetry data:', err);
      }
    };
    
    loadData();
  }, [platform]);

  // When selectedCategory, selectedVendors, or compareMode change, update the chart
  useEffect(() => {
    if (allVendors.length > 0 && allCategories.length > 0) {
      updateChart();
    }
  }, [selectedCategory, selectedVendors, compareMode, platform]);

  // Process the raw data into usable format
  const processData = (currentWindowsData, currentLinuxData, historicalWindowsData, historicalLinuxData) => {
    // Process current data
    const currentWindowsPlatformData = processRawData(currentWindowsData);
    const currentLinuxPlatformData = processRawData(currentLinuxData);
    
    // Process historical data
    const historicalWindowsPlatformData = processRawData(historicalWindowsData);
    const historicalLinuxPlatformData = processRawData(historicalLinuxData);
    
    // Combine all unique categories and vendors from both current and historical data
    const categories = [...new Set([
      ...Object.keys(currentWindowsPlatformData?.categories || {}),
      ...Object.keys(currentLinuxPlatformData?.categories || {}),
      ...Object.keys(historicalWindowsPlatformData?.categories || {}),
      ...Object.keys(historicalLinuxPlatformData?.categories || {})
    ])].sort();
    
    const vendors = [...new Set([
      ...(currentWindowsPlatformData?.vendors || []),
      ...(currentLinuxPlatformData?.vendors || []),
      ...(historicalWindowsPlatformData?.vendors || []),
      ...(historicalLinuxPlatformData?.vendors || [])
    ])].sort();
    
    // Store the processed data
    window.telemetryData = {
      current: {
        windows: currentWindowsPlatformData,
        linux: currentLinuxPlatformData
      },
      historical: {
        windows: historicalWindowsPlatformData,
        linux: historicalLinuxPlatformData
      },
      categories,
      vendors
    };
    
    // Update state with categories and vendors
    setAllCategories(['all', ...categories]);
    setAllVendors(vendors);
    
    // Set default selected vendors (top 5 or all if less than 5)
    const topVendors = ['CrowdStrike', 'Carbon Black', 'MDE', 'SentinelOne', 'Elastic']
      .filter(v => vendors.includes(v));
      
    const defaultVendors = topVendors.length > 0 ? 
      topVendors.slice(0, 5) : 
      vendors.slice(0, Math.min(5, vendors.length));
      
    setSelectedVendors(defaultVendors);
    
    // Update the chart
    updateChart();
  };

  // Process raw data from API into structured format
  const processRawData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    // Extract vendors (excluding metadata columns)
    const vendors = Object.keys(data[0]).filter(key => 
      key !== "Telemetry Feature Category" && 
      key !== "Sub-Category" && 
      key !== "Telemetry Feature" &&
      key !== "Details"
    );
    
    // Group by category
    const categories = {};
    
    data.forEach(item => {
      // Get the category - if null, use the last non-null category
      let category = item["Telemetry Feature Category"];
      if (!category && Object.keys(categories).length > 0) {
        // Use the last category if this row's category is null
        category = Object.keys(categories)[Object.keys(categories).length - 1];
      } else if (!category) {
        return; // Skip if no category can be determined
      }
      
      // Initialize category if not exists
      if (!categories[category]) {
        categories[category] = {
          features: [],
          vendorSupport: {}
        };
        
        // Initialize vendor support counters
        vendors.forEach(vendor => {
          categories[category].vendorSupport[vendor] = {
            supported: 0,
            total: 0
          };
        });
      }
      
      // Add feature to category
      categories[category].features.push(item);
      
      // Count vendor support
      vendors.forEach(vendor => {
        const supportValue = item[vendor];
        categories[category].vendorSupport[vendor].total++;
        
        // Count as supported if any of these values
        if (
          supportValue === "Yes" || 
          supportValue === "Partially" || 
          supportValue === "Via EventLogs" ||
          supportValue === "Via EnablingTelemetry"
        ) {
          categories[category].vendorSupport[vendor].supported++;
        }
      });
    });
    
    return { categories, vendors };
  };

  // Update the chart based on selected options
  const updateChart = () => {
    const data = window.telemetryData;
    if (!data) return;
    
    // Get vendors to display
    const displayVendors = selectedVendors.length > 0 ? selectedVendors : allVendors.slice(0, 5);
    
    // Create datasets
    const datasets = [];
    
    // Create labels based on selectedCategory and compareMode
    let labels = [];
    
    // Set up data based on compare mode
    if (compareMode === 'both') {
      // When showing both current and historical data, each vendor gets two bars
      labels = displayVendors;
      
      if (selectedCategory === 'all') {
        // Show overall adoption for all categories
        
        // For Windows
        if (platform === 'all' || platform === 'windows') {
          // Current data
          const currentWindowsData = calculateOverallAdoption(data.current.windows, displayVendors);
          
          datasets.push({
            label: 'Current - Windows',
            data: currentWindowsData,
            backgroundColor: colorPalette[0],
            borderColor: colorPalette[0].replace('0.7', '1'),
            borderWidth: 1
          });
          
          // Historical data
          const historicalWindowsData = calculateOverallAdoption(data.historical.windows, displayVendors);
          
          datasets.push({
            label: 'Dec 2024 - Windows',
            data: historicalWindowsData,
            backgroundColor: colorPalette[2],
            borderColor: colorPalette[2].replace('0.7', '1'),
            borderWidth: 1
          });
        }
        
        // For Linux
        if (platform === 'all' || platform === 'linux') {
          // Current data
          const currentLinuxData = calculateOverallAdoption(data.current.linux, displayVendors);
          
          datasets.push({
            label: 'Current - Linux',
            data: currentLinuxData,
            backgroundColor: colorPalette[1],
            borderColor: colorPalette[1].replace('0.7', '1'),
            borderWidth: 1
          });
          
          // Historical data
          const historicalLinuxData = calculateOverallAdoption(data.historical.linux, displayVendors);
          
          datasets.push({
            label: 'Dec 2024 - Linux',
            data: historicalLinuxData,
            backgroundColor: colorPalette[3],
            borderColor: colorPalette[3].replace('0.7', '1'),
            borderWidth: 1
          });
        }
      } else {
        // Show adoption for specific category
        
        // For Windows
        if (platform === 'all' || platform === 'windows') {
          // Current data
          const currentWindowsData = calculateCategoryAdoption(data.current.windows, selectedCategory, displayVendors);
          
          datasets.push({
            label: `Current - Windows (${selectedCategory})`,
            data: currentWindowsData,
            backgroundColor: colorPalette[0],
            borderColor: colorPalette[0].replace('0.7', '1'),
            borderWidth: 1
          });
          
          // Historical data
          const historicalWindowsData = calculateCategoryAdoption(data.historical.windows, selectedCategory, displayVendors);
          
          datasets.push({
            label: `Dec 2024 - Windows (${selectedCategory})`,
            data: historicalWindowsData,
            backgroundColor: colorPalette[2],
            borderColor: colorPalette[2].replace('0.7', '1'),
            borderWidth: 1
          });
        }
        
        // For Linux
        if (platform === 'all' || platform === 'linux') {
          // Current data
          const currentLinuxData = calculateCategoryAdoption(data.current.linux, selectedCategory, displayVendors);
          
          datasets.push({
            label: `Current - Linux (${selectedCategory})`,
            data: currentLinuxData,
            backgroundColor: colorPalette[1],
            borderColor: colorPalette[1].replace('0.7', '1'),
            borderWidth: 1
          });
          
          // Historical data
          const historicalLinuxData = calculateCategoryAdoption(data.historical.linux, selectedCategory, displayVendors);
          
          datasets.push({
            label: `Dec 2024 - Linux (${selectedCategory})`,
            data: historicalLinuxData,
            backgroundColor: colorPalette[3],
            borderColor: colorPalette[3].replace('0.7', '1'),
            borderWidth: 1
          });
        }
      }
    } else {
      // When showing only current or historical data
      labels = displayVendors;
      
      const dataSource = compareMode === 'current' ? data.current : data.historical;
      const timeLabel = compareMode === 'current' ? 'Current' : 'Dec 2024';
      
      if (selectedCategory === 'all') {
        // Show overall adoption for all categories
        
        // For Windows
        if (platform === 'all' || platform === 'windows') {
          const windowsData = calculateOverallAdoption(dataSource.windows, displayVendors);
          
          datasets.push({
            label: `${timeLabel} - Windows`,
            data: windowsData,
            backgroundColor: colorPalette[0],
            borderColor: colorPalette[0].replace('0.7', '1'),
            borderWidth: 1
          });
        }
        
        // For Linux
        if (platform === 'all' || platform === 'linux') {
          const linuxData = calculateOverallAdoption(dataSource.linux, displayVendors);
          
          datasets.push({
            label: `${timeLabel} - Linux`,
            data: linuxData,
            backgroundColor: colorPalette[1],
            borderColor: colorPalette[1].replace('0.7', '1'),
            borderWidth: 1
          });
        }
      } else {
        // Show adoption for specific category
        
        // For Windows
        if (platform === 'all' || platform === 'windows') {
          const windowsData = calculateCategoryAdoption(dataSource.windows, selectedCategory, displayVendors);
          
          datasets.push({
            label: `${timeLabel} - Windows (${selectedCategory})`,
            data: windowsData,
            backgroundColor: colorPalette[0],
            borderColor: colorPalette[0].replace('0.7', '1'),
            borderWidth: 1
          });
        }
        
        // For Linux
        if (platform === 'all' || platform === 'linux') {
          const linuxData = calculateCategoryAdoption(dataSource.linux, selectedCategory, displayVendors);
          
          datasets.push({
            label: `${timeLabel} - Linux (${selectedCategory})`,
            data: linuxData,
            backgroundColor: colorPalette[1],
            borderColor: colorPalette[1].replace('0.7', '1'),
            borderWidth: 1
          });
        }
      }
    }
    
    // Update chart data
    setChartData({
      labels,
      datasets
    });
  };

  // Calculate overall adoption percentage across all categories for each vendor
  const calculateOverallAdoption = (platformData, vendors) => {
    if (!platformData) return vendors.map(() => 0);
    
    return vendors.map(vendor => {
      let totalFeatures = 0;
      let supportedFeatures = 0;
      
      Object.values(platformData.categories).forEach(category => {
        const vendorData = category.vendorSupport[vendor];
        if (vendorData) {
          totalFeatures += vendorData.total;
          supportedFeatures += vendorData.supported;
        }
      });
      
      return totalFeatures > 0 ? (supportedFeatures / totalFeatures) * 100 : 0;
    });
  };

  // Calculate adoption percentage for a specific category across vendors
  const calculateCategoryAdoption = (platformData, category, vendors) => {
    if (!platformData || !platformData.categories[category]) {
      return vendors.map(() => 0);
    }
    
    return vendors.map(vendor => {
      const vendorData = platformData.categories[category].vendorSupport[vendor];
      if (!vendorData || vendorData.total === 0) return 0;
      
      return (vendorData.supported / vendorData.total) * 100;
    });
  };

  // Calculate the change in adoption percentage between historical and current data
  const calculateAdoptionChange = (historicalData, currentData) => {
    if (!historicalData || !currentData || historicalData.length !== currentData.length) {
      return historicalData.map(() => 0);
    }
    
    return historicalData.map((val, i) => currentData[i] - val);
  };

  // Handle vendor toggle in dropdown
  const handleVendorToggle = (vendor) => {
    if (selectedVendors.includes(vendor)) {
      setSelectedVendors(selectedVendors.filter(v => v !== vendor));
    } else {
      setSelectedVendors([...selectedVendors, vendor]);
    }
  };

  // Toggle select all vendors
  const toggleSelectAllVendors = () => {
    const filteredVendors = searchQuery 
      ? allVendors.filter(vendor => vendor.toLowerCase().includes(searchQuery.toLowerCase()))
      : allVendors;
      
    // If all filtered vendors are selected, deselect all; otherwise, select all
    const allSelected = filteredVendors.every(vendor => selectedVendors.includes(vendor));
    
    if (allSelected) {
      const vendorsToKeep = selectedVendors.filter(vendor => 
        !filteredVendors.includes(vendor)
      );
      setSelectedVendors(vendorsToKeep);
    } else {
      const newSelectedVendors = [...new Set([
        ...selectedVendors, 
        ...filteredVendors
      ])];
      setSelectedVendors(newSelectedVendors);
    }
  };

  // Function to handle platform changes
  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    // Notify parent component if callback is provided
    if (onPlatformChange) {
      onPlatformChange(newPlatform);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles['loading']}>
        <div className={styles['loading-spinner']}></div>
        <span>Loading telemetry data...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles['error']}>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Show empty state
  if (!chartData) {
    return (
      <div className={styles['empty-state']}>
        <p>No data available</p>
      </div>
    );
  }

  // Filter vendors based on search query
  const filteredVendors = searchQuery 
    ? allVendors.filter(vendor => vendor.toLowerCase().includes(searchQuery.toLowerCase()))
    : allVendors;

  // Check if all filtered vendors are selected
  const allFiltered = filteredVendors.length > 0 && 
    filteredVendors.every(vendor => selectedVendors.includes(vendor));

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Adoption Percentage (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Vendors'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      title: {
        display: true,
        text: `EDR Telemetry Feature Adoption (${platform === 'all' ? 'All Platforms' : platform === 'windows' ? 'Windows' : 'Linux'})`,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    }
  };

  return (
    <div className={styles['timeline-container']}>
      <div className={styles['timeline-controls']}>
        <div className={styles['filter-container']}>
          <div className={styles['platform-selector']}>
            <label>Platform:</label>
            <div className={styles['button-group']}>
              <button 
                className={`${styles['compare-button']} ${platform === 'all' ? styles['selected'] : ''}`}
                onClick={() => handlePlatformChange('all')}
              >
                All Platforms
              </button>
              <button 
                className={`${styles['compare-button']} ${platform === 'windows' ? styles['selected'] : ''}`}
                onClick={() => handlePlatformChange('windows')}
              >
                Windows
              </button>
              <button 
                className={`${styles['compare-button']} ${platform === 'linux' ? styles['selected'] : ''}`}
                onClick={() => handlePlatformChange('linux')}
              >
                Linux
              </button>
            </div>
          </div>
        
          <div className={styles['data-comparison-control']}>
            <label>Compare Data:</label>
            <div className={styles['button-group']}>
              <button 
                className={`${styles['compare-button']} ${compareMode === 'current' ? styles['selected'] : ''}`}
                onClick={() => setCompareMode('current')}
              >
                Current
              </button>
              <button 
                className={`${styles['compare-button']} ${compareMode === 'historical' ? styles['selected'] : ''}`}
                onClick={() => setCompareMode('historical')}
              >
                Dec 2024
              </button>
              <button 
                className={`${styles['compare-button']} ${compareMode === 'both' ? styles['selected'] : ''}`}
                onClick={() => setCompareMode('both')}
              >
                Compare Both
              </button>
            </div>
          </div>
          
          <div className={styles['category-filter']}>
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles['select-control']}
            >
              <option value="all">All Categories</option>
              {allCategories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className={styles['vendor-multiselect']} ref={dropdownRef}>
            <label>Vendors:</label>
            <div className={styles['multiselect-wrapper']}>
              <div 
                className={styles['multiselect-selector']} 
                onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
              >
                <span>
                  {selectedVendors.length === 0 
                    ? 'Select vendors' 
                    : `Selected ${selectedVendors.length} vendor${selectedVendors.length !== 1 ? 's' : ''}`}
                </span>
                <span className={styles['dropdown-arrow']}>▼</span>
              </div>
              
              {vendorDropdownOpen && (
                <div className={styles['multiselect-dropdown']}>
                  <div className={styles['dropdown-search']}>
                    <input
                      type="text"
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className={styles['select-all-option']}>
                    <label>
                      <input
                        type="checkbox"
                        checked={allFiltered}
                        onChange={toggleSelectAllVendors}
                      />
                      <span>{allFiltered ? 'Deselect All' : 'Select All'}</span>
                    </label>
                  </div>
                  
                  <div className={styles['dropdown-options']}>
                    {filteredVendors.map(vendor => (
                      <div key={vendor} className={styles['dropdown-option']}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedVendors.includes(vendor)}
                            onChange={() => handleVendorToggle(vendor)}
                          />
                          <span>{vendor}</span>
                        </label>
                      </div>
                    ))}
                    
                    {filteredVendors.length === 0 && (
                      <div className={styles['no-results']}>No matching vendors</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {selectedVendors.length > 0 && (
              <div className={styles['selected-vendors']}>
                {selectedVendors.map(vendor => (
                  <span key={vendor} className={styles['selected-vendor-tag']}>
                    {vendor}
                    <button 
                      className={styles['remove-vendor']} 
                      onClick={() => handleVendorToggle(vendor)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles['chart-container']} style={{ height: '500px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className={styles['adoption-explanation']}>
        <h4>How Adoption Rates Are Calculated</h4>
        <p>
          The adoption rate shown in the chart represents the percentage of telemetry features that 
          a vendor has implemented. Features are counted as supported if they have any of the following values:
        </p>
        <ul>
          <li><strong>&quot;Yes&quot;</strong> - Fully implemented feature</li>
          <li><strong>&quot;Partially&quot;</strong> - Partially implemented feature</li>
          <li><strong>&quot;Via EventLogs&quot;</strong> - Feature available through Windows Event Logs</li>
          <li><strong>&quot;Via EnablingTelemetry&quot;</strong> - Feature that can be enabled as part of the EDR product</li>
        </ul>
        <p>
          Features marked as <strong>&quot;No&quot;</strong> or <strong>&quot;Pending&quot;</strong> are counted as not supported.
        </p>
        <p>
          For each vendor and category, we calculate: <code>(Number of Supported Features / Total Features) × 100%</code>
        </p>
      </div>
      
      <div className={styles['timeline-info']}>
        <h4>About This Comparison</h4>
        <p>
          This chart compares EDR telemetry feature adoption between the current data and historical data from December 16, 2024.
          You can choose to view current data only, historical data only, or compare both side-by-side.
        </p>
        <ul>
          <li>Select a category to focus on specific types of telemetry features</li>
          <li>Choose which vendors to compare using the dropdown menu</li>
          <li>Search for specific vendors by typing in the search box</li>
          <li>Compare Windows and Linux support for the same vendors</li>
          <li>See how vendors have improved their telemetry support over time</li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureAdoptionTimeline; 

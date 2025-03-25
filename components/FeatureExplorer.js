import React, { useState, useEffect, useMemo } from 'react';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import styles from '../styles/explorer.module.css';

const FeatureExplorer = () => {
  // State for features data
  const [windowsTelemetryData, setWindowsTelemetryData] = useState(null);
  const [linuxTelemetryData, setLinuxTelemetryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [chartType, setChartType] = useState('bar');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load data on component mount
  useEffect(() => {
    loadTelemetryData();
  }, []);
  
  // Load telemetry data
  const loadTelemetryData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Windows data
      const windowsResponse = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json');
      if (!windowsResponse.ok) {
        throw new Error('Failed to fetch Windows telemetry data');
      }
      const windowsData = await windowsResponse.json();
      setWindowsTelemetryData(windowsData);
      
      // Fetch Linux data
      const linuxResponse = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json');
      if (!linuxResponse.ok) {
        throw new Error('Failed to fetch Linux telemetry data');
      }
      const linuxData = await linuxResponse.json();
      setLinuxTelemetryData(linuxData);
      
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      console.error('Error loading telemetry data:', err);
    }
  };
  
  // Extract unique feature categories
  const featureCategories = useMemo(() => {
    const categories = new Set();
    
    if (windowsTelemetryData) {
      windowsTelemetryData.forEach(row => {
        if (row['Telemetry Feature Category']) {
          categories.add(row['Telemetry Feature Category']);
        }
      });
    }
    
    if (linuxTelemetryData) {
      linuxTelemetryData.forEach(row => {
        if (row['Telemetry Feature Category']) {
          categories.add(row['Telemetry Feature Category']);
        }
      });
    }
    
    return Array.from(categories).sort();
  }, [windowsTelemetryData, linuxTelemetryData]);
  
  // Extract unique vendors
  const vendors = useMemo(() => {
    const vendorSet = new Set();
    
    if (windowsTelemetryData) {
      // Get Windows vendors (column names except for metadata columns)
      Object.keys(windowsTelemetryData[0] || {}).forEach(key => {
        if (
          key !== 'Telemetry Feature Category' && 
          key !== 'Sub-Category' && 
          key !== 'Notes' &&
          key !== 'Feature' &&
          key !== 'Subcategory' &&
          key !== 'Sysmon' &&
          key !== 'Auditd'
        ) {
          vendorSet.add(key);
        }
      });
    }
    
    if (linuxTelemetryData) {
      // Get Linux vendors (column names except for metadata columns)
      Object.keys(linuxTelemetryData[0] || {}).forEach(key => {
        if (
          key !== 'Telemetry Feature Category' && 
          key !== 'Sub-Category' && 
          key !== 'Notes' &&
          key !== 'Feature' &&
          key !== 'Subcategory' &&
          key !== 'Sysmon' &&
          key !== 'Auditd'
        ) {
          vendorSet.add(key);
        }
      });
    }
    
    return Array.from(vendorSet).sort();
  }, [windowsTelemetryData, linuxTelemetryData]);
  
  // Filter features based on search, platform, categories
  const filteredFeatures = useMemo(() => {
    if (!windowsTelemetryData && !linuxTelemetryData) return [];
    
    let features = [];
    
    // Add Windows features if selected
    if ((selectedPlatform === 'all' || selectedPlatform === 'windows') && windowsTelemetryData) {
      windowsTelemetryData.forEach(row => {
        const category = row['Telemetry Feature Category'] || '';
        const feature = row['Feature'] || '';
        
        // Skip if category filter is active and this category is not selected
        if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
          return;
        }
        
        // Skip if this doesn't match search term
        if (searchTerm && !feature.toLowerCase().includes(searchTerm.toLowerCase())) {
          return;
        }
        
        // Create feature object with vendor support
        const featureObj = {
          feature,
          category,
          platform: 'windows',
          vendors: {}
        };
        
        // Track vendor support for this feature
        vendors.forEach(vendor => {
          const supportValue = row[vendor];
          if (supportValue === 'Yes' || supportValue === 'Via EnablingTelemetry') {
            featureObj.vendors[vendor] = 'full';
          } else if (supportValue === 'Partially' || supportValue === 'Via EventLogs') {
            featureObj.vendors[vendor] = 'partial';
          } else {
            featureObj.vendors[vendor] = 'none';
          }
        });
        
        features.push(featureObj);
      });
    }
    
    // Add Linux features if selected
    if ((selectedPlatform === 'all' || selectedPlatform === 'linux') && linuxTelemetryData) {
      linuxTelemetryData.forEach(row => {
        const category = row['Telemetry Feature Category'] || '';
        const feature = row['Feature'] || '';
        
        // Skip if category filter is active and this category is not selected
        if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
          return;
        }
        
        // Skip if this doesn't match search term
        if (searchTerm && !feature.toLowerCase().includes(searchTerm.toLowerCase())) {
          return;
        }
        
        // Create feature object with vendor support
        const featureObj = {
          feature,
          category,
          platform: 'linux',
          vendors: {}
        };
        
        // Track vendor support for this feature
        vendors.forEach(vendor => {
          const supportValue = row[vendor];
          if (supportValue === 'Yes' || supportValue === 'Via EnablingTelemetry') {
            featureObj.vendors[vendor] = 'full';
          } else if (supportValue === 'Partially' || supportValue === 'Via EventLogs') {
            featureObj.vendors[vendor] = 'partial';
          } else {
            featureObj.vendors[vendor] = 'none';
          }
        });
        
        features.push(featureObj);
      });
    }
    
    return features;
  }, [windowsTelemetryData, linuxTelemetryData, selectedPlatform, selectedCategories, searchTerm, vendors]);
  
  // Calculate feature support for selected vendors
  const vendorFeatureSupport = useMemo(() => {
    if (selectedVendors.length === 0) return null;
    
    const support = {};
    
    // Initialize support counters for each vendor
    selectedVendors.forEach(vendor => {
      support[vendor] = {
        fullSupport: 0,
        partialSupport: 0,
        noSupport: 0,
        total: 0,
        byCategory: {}
      };
      
      // Initialize categories
      featureCategories.forEach(category => {
        support[vendor].byCategory[category] = {
          fullSupport: 0,
          partialSupport: 0,
          noSupport: 0,
          total: 0
        };
      });
    });
    
    // Count feature support for each vendor
    filteredFeatures.forEach(feature => {
      selectedVendors.forEach(vendor => {
        support[vendor].total++;
        
        // Update category counters
        if (!support[vendor].byCategory[feature.category]) {
          support[vendor].byCategory[feature.category] = {
            fullSupport: 0,
            partialSupport: 0,
            noSupport: 0,
            total: 0
          };
        }
        support[vendor].byCategory[feature.category].total++;
        
        // Update support counters
        if (feature.vendors[vendor] === 'full') {
          support[vendor].fullSupport++;
          support[vendor].byCategory[feature.category].fullSupport++;
        } else if (feature.vendors[vendor] === 'partial') {
          support[vendor].partialSupport++;
          support[vendor].byCategory[feature.category].partialSupport++;
        } else {
          support[vendor].noSupport++;
          support[vendor].byCategory[feature.category].noSupport++;
        }
      });
    });
    
    return support;
  }, [filteredFeatures, selectedVendors, featureCategories]);
  
  // Toggle vendor selection
  const toggleVendor = (vendor) => {
    setSelectedVendors(prev => {
      if (prev.includes(vendor)) {
        return prev.filter(v => v !== vendor);
      } else {
        return [...prev, vendor];
      }
    });
  };
  
  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Generate chart data based on selected vendors and categories
  const chartData = useMemo(() => {
    if (!vendorFeatureSupport) return null;
    
    const labels = selectedVendors;
    
    if (chartType === 'bar') {
      // Bar chart data
      return {
        labels,
        datasets: [
          {
            label: 'Full Support',
            data: selectedVendors.map(vendor => 
              (vendorFeatureSupport[vendor].fullSupport / vendorFeatureSupport[vendor].total * 100).toFixed(1)
            ),
            backgroundColor: 'rgba(66, 133, 244, 0.8)',
          },
          {
            label: 'Partial Support',
            data: selectedVendors.map(vendor => 
              (vendorFeatureSupport[vendor].partialSupport / vendorFeatureSupport[vendor].total * 100).toFixed(1)
            ),
            backgroundColor: 'rgba(251, 188, 4, 0.8)',
          },
          {
            label: 'No Support',
            data: selectedVendors.map(vendor => 
              (vendorFeatureSupport[vendor].noSupport / vendorFeatureSupport[vendor].total * 100).toFixed(1)
            ),
            backgroundColor: 'rgba(234, 67, 53, 0.8)',
          }
        ]
      };
    } else if (chartType === 'radar') {
      // Radar chart data - category support by vendor
      return {
        labels: featureCategories,
        datasets: selectedVendors.map((vendor, index) => {
          const colorIndex = index % 10;
          const colors = [
            'rgba(66, 133, 244, 0.7)',
            'rgba(219, 68, 55, 0.7)',
            'rgba(244, 180, 0, 0.7)',
            'rgba(15, 157, 88, 0.7)',
            'rgba(171, 71, 188, 0.7)',
            'rgba(0, 172, 193, 0.7)',
            'rgba(255, 112, 67, 0.7)',
            'rgba(141, 110, 99, 0.7)',
            'rgba(120, 144, 156, 0.7)',
            'rgba(38, 198, 218, 0.7)'
          ];
          
          return {
            label: vendor,
            data: featureCategories.map(category => {
              const categoryStats = vendorFeatureSupport[vendor].byCategory[category];
              if (!categoryStats || categoryStats.total === 0) return 0;
              
              return (
                ((categoryStats.fullSupport + (categoryStats.partialSupport * 0.5)) / categoryStats.total) * 100
              ).toFixed(1);
            }),
            backgroundColor: colors[colorIndex].replace('0.7', '0.2'),
            borderColor: colors[colorIndex],
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          };
        })
      };
    } else if (chartType === 'doughnut') {
      // Doughnut chart - average support across selected vendors
      const totalFeatures = selectedVendors.reduce((sum, vendor) => sum + vendorFeatureSupport[vendor].total, 0);
      const fullSupport = selectedVendors.reduce((sum, vendor) => sum + vendorFeatureSupport[vendor].fullSupport, 0);
      const partialSupport = selectedVendors.reduce((sum, vendor) => sum + vendorFeatureSupport[vendor].partialSupport, 0);
      const noSupport = selectedVendors.reduce((sum, vendor) => sum + vendorFeatureSupport[vendor].noSupport, 0);
      
      return {
        labels: ['Full Support', 'Partial Support', 'No Support'],
        datasets: [
          {
            data: [
              ((fullSupport / totalFeatures) * 100).toFixed(1),
              ((partialSupport / totalFeatures) * 100).toFixed(1),
              ((noSupport / totalFeatures) * 100).toFixed(1)
            ],
            backgroundColor: [
              'rgba(66, 133, 244, 0.8)',
              'rgba(251, 188, 4, 0.8)',
              'rgba(234, 67, 53, 0.8)'
            ],
            borderWidth: 1
          }
        ]
      };
    }
    
    return null;
  }, [vendorFeatureSupport, selectedVendors, chartType, featureCategories]);
  
  // Chart options
  const chartOptions = useMemo(() => {
    if (chartType === 'bar') {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage of Features (%)'
            },
            stacked: true
          },
          x: {
            stacked: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Feature Support by Vendor',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          }
        }
      };
    } else if (chartType === 'radar') {
      return {
        responsive: true,
        maintainAspectRatio: false,
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
            text: 'Category Support by Vendor',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}%`;
              }
            }
          }
        }
      };
    } else if (chartType === 'doughnut') {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Overall Support Distribution',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      };
    }
    
    return {};
  }, [chartType]);
  
  // Export chart as image
  const exportChart = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    // Create a temporary link
    const link = document.createElement('a');
    link.download = `edr-telemetry-${chartType}-${new Date().toISOString().split('T')[0]}.png`;
    
    // Convert canvas to blob and trigger download
    canvas.toBlob(function(blob) {
      link.href = URL.createObjectURL(blob);
      link.click();
    });
  };
  
  // Export data as CSV
  const exportCSV = () => {
    if (!filteredFeatures || filteredFeatures.length === 0) return;
    
    // Create CSV header row
    let csv = 'Feature,Category,Platform';
    selectedVendors.forEach(vendor => {
      csv += `,${vendor}`;
    });
    csv += '\n';
    
    // Add data rows
    filteredFeatures.forEach(feature => {
      csv += `"${feature.feature}","${feature.category}","${feature.platform}"`;
      selectedVendors.forEach(vendor => {
        let support = feature.vendors[vendor];
        csv += `,${support}`;
      });
      csv += '\n';
    });
    
    // Create blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `edr-telemetry-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  if (isLoading) {
    return (
      <div className={styles['loading']}>
        <div className={styles['loading-spinner']}></div>
        <span>Loading telemetry data...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles['error']}>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className={styles['explorer-container']}>
      <div className={styles['explorer-controls']}>
        <div className={styles['search-section']}>
          <h3>Search and Filter</h3>
          <input
            type="text"
            placeholder="Search by feature name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles['search-input']}
          />
        </div>
        
        <div className={styles['filters-section']}>
          <div className={styles['platform-filter']}>
            <h4>Platform</h4>
            <div className={styles['radio-group']}>
              <label>
                <input
                  type="radio"
                  name="platform"
                  value="all"
                  checked={selectedPlatform === 'all'}
                  onChange={() => setSelectedPlatform('all')}
                />
                All Platforms
              </label>
              <label>
                <input
                  type="radio"
                  name="platform"
                  value="windows"
                  checked={selectedPlatform === 'windows'}
                  onChange={() => setSelectedPlatform('windows')}
                />
                Windows
              </label>
              <label>
                <input
                  type="radio"
                  name="platform"
                  value="linux"
                  checked={selectedPlatform === 'linux'}
                  onChange={() => setSelectedPlatform('linux')}
                />
                Linux
              </label>
            </div>
          </div>
          
          <div className={styles['category-filter']}>
            <h4>Feature Categories</h4>
            <div className={styles['checkbox-container']}>
              {featureCategories.map(category => (
                <label key={category} className={styles['checkbox-label']}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          
          <div className={styles['vendor-filter']}>
            <h4>EDR Vendors</h4>
            <div className={styles['checkbox-container']}>
              {vendors.map(vendor => (
                <label key={vendor} className={styles['checkbox-label']}>
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor)}
                    onChange={() => toggleVendor(vendor)}
                  />
                  {vendor}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles['chart-controls']}>
          <h4>Chart Type</h4>
          <div className={styles['radio-group']}>
            <label>
              <input
                type="radio"
                name="chartType"
                value="bar"
                checked={chartType === 'bar'}
                onChange={() => setChartType('bar')}
              />
              Bar Chart
            </label>
            <label>
              <input
                type="radio"
                name="chartType"
                value="radar"
                checked={chartType === 'radar'}
                onChange={() => setChartType('radar')}
              />
              Radar Chart
            </label>
            <label>
              <input
                type="radio"
                name="chartType"
                value="doughnut"
                checked={chartType === 'doughnut'}
                onChange={() => setChartType('doughnut')}
              />
              Doughnut Chart
            </label>
          </div>
        </div>
        
        <div className={styles['export-controls']}>
          <h4>Export</h4>
          <div className={styles['export-buttons']}>
            <button 
              className={styles['export-button']} 
              onClick={exportChart}
              disabled={!chartData || selectedVendors.length === 0}
            >
              Export Chart Image
            </button>
            <button 
              className={styles['export-button']} 
              onClick={exportCSV}
              disabled={filteredFeatures.length === 0 || selectedVendors.length === 0}
            >
              Export Data as CSV
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles['explorer-results']}>
        {selectedVendors.length === 0 ? (
          <div className={styles['empty-selection']}>
            <p>Please select at least one EDR vendor to view charts and comparisons</p>
          </div>
        ) : (
          <>
            <div className={styles['chart-container']} style={{ height: '500px' }}>
              {chartType === 'bar' && chartData && (
                <Bar data={chartData} options={chartOptions} />
              )}
              {chartType === 'radar' && chartData && (
                <Radar data={chartData} options={chartOptions} />
              )}
              {chartType === 'doughnut' && chartData && (
                <Doughnut data={chartData} options={chartOptions} />
              )}
            </div>
            
            <div className={styles['feature-summary']}>
              <h3>Feature Support Summary</h3>
              <div className={styles['summary-cards']}>
                {selectedVendors.map(vendor => (
                  <div key={vendor} className={styles['vendor-card']}>
                    <h4>{vendor}</h4>
                    <div className={styles['support-stats']}>
                      <div className={styles['stat-item']}>
                        <span className={styles['stat-label']}>Full Support:</span>
                        <span className={styles['stat-value']}>
                          {(vendorFeatureSupport[vendor].fullSupport / vendorFeatureSupport[vendor].total * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className={styles['stat-item']}>
                        <span className={styles['stat-label']}>Partial Support:</span>
                        <span className={styles['stat-value']}>
                          {(vendorFeatureSupport[vendor].partialSupport / vendorFeatureSupport[vendor].total * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className={styles['stat-item']}>
                        <span className={styles['stat-label']}>No Support:</span>
                        <span className={styles['stat-value']}>
                          {(vendorFeatureSupport[vendor].noSupport / vendorFeatureSupport[vendor].total * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className={styles['stat-item']}>
                        <span className={styles['stat-label']}>Features Analyzed:</span>
                        <span className={styles['stat-value']}>
                          {vendorFeatureSupport[vendor].total}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div className={styles['feature-list']}>
          <h3>Telemetry Features List ({filteredFeatures.length} features)</h3>
          <div className={styles['table-container']}>
            <table className={styles['features-table']}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Category</th>
                  <th>Platform</th>
                  {selectedVendors.map(vendor => (
                    <th key={vendor}>{vendor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.slice(0, 50).map((feature, index) => (
                  <tr key={`${feature.feature}-${feature.platform}-${index}`}>
                    <td>{feature.feature}</td>
                    <td>{feature.category}</td>
                    <td>{feature.platform}</td>
                    {selectedVendors.map(vendor => (
                      <td key={vendor} className={styles[`support-${feature.vendors[vendor]}`]}>
                        {feature.vendors[vendor] === 'full' ? '✓' : 
                         feature.vendors[vendor] === 'partial' ? '◐' : '✕'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFeatures.length > 50 && (
              <div className={styles['table-note']}>
                Showing 50 of {filteredFeatures.length} features. Use the search and filters to narrow results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureExplorer; 
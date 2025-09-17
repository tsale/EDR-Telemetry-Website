import TemplatePage from '../components/TemplatePage'
import { useState, useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

// Common scoring values for both Windows and Linux
const FEATURES_DICT_VALUED = {
    "Yes": 1,
    "No": 0,
    "Via EnablingTelemetry": 1,
    "Partially": 0.5,
    "Via EventLogs": 0.5,
    "Pending Response": 0
};

// Windows-specific categories with their weights
const WINDOWS_CATEGORIES_VALUED = {
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
    "JA3/JA3s": 1,
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
    "Script-Block Activity": 1,
    "Win32 API Telemetry": 1,
    "Volume Shadow Copy Deletion": 0.5,
};

// Linux-specific categories with their weights
const LINUX_CATEGORIES_VALUED = {
    "Process Creation": 1,
    "Process Termination": 0.5,
    "File Creation": 1,
    "File Modification": 1,
    "File Deletion": 1,
    "User Logon": 0.7,
    "User Logoff": 0.4,
    "Logon Failed": 1,
    "Script Content": 1,
    "Network Connection": 1,
    "Network Socket Listen": 1,
    "DNS Query": 1,
    "Scheduled Task": 0.7,
    "User Account Created": 1,
    "User Account Modified": 1,
    "User Account Deleted": 0.5,
    "Driver Load": 1,
    "Driver Modification": 1,
    "Image Load": 1,
    "eBPF Event": 1,
    "Raw Access Read": 1,
    "Process Access": 1,
    "Process Tampering": 1,
    "Process Call Stacks":1,
    "Service Creation": 1,
    "Service Modification": 0.7,
    "Service Deletion": 0.6,
    "Agent Start": 0.2,
    "Agent Stop": 0.8,
    "MD5": 1,
    "SHA": 1,
    "Fuzzy Hash": 1
};

export default function Scores() {
  // State for scoring data
  const [windowsTelemetryData, setWindowsTelemetryData] = useState(null);
  const [linuxTelemetryData, setLinuxTelemetryData] = useState(null);
  const [currentPlatform, setCurrentPlatform] = useState('windows');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scores, setScores] = useState([]);
  const [stats, setStats] = useState({
    avgScore: 0,
    maxScore: 0,
    minScore: 0
  });

  // Add heading links
  useHeadingLinks();
  
  // Additional useEffect to re-apply heading links after content loads
  useEffect(() => {
    if (!isLoading && !error) {
      // Short delay to ensure the DOM has updated with the loaded content
      const timer = setTimeout(() => {
        // Re-initialize heading links after content is loaded
        const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
        headings.forEach(heading => {
          // Remove existing links if any
          const existingLink = heading.parentNode.querySelector('.heading-link');
          if (existingLink) {
            existingLink.remove();
          }
          // Remove processed class to allow for re-processing
          heading.classList.remove('heading-processed');
        });
        
        // Call useHeadingLinks again (indirectly by triggering a re-render)
        setCurrentPlatform(prev => prev);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error]);

  useEffect(() => {
    // Load both Windows and Linux telemetry data
    loadAllTelemetryData();
  }, []);

  useEffect(() => {
    // Update scores when platform changes or data loads
    if (currentPlatform === 'windows' && windowsTelemetryData) {
      const calculatedScores = calculateScores(windowsTelemetryData, 'windows');
      setScores(calculatedScores);
      updateStats(calculatedScores);
    } else if (currentPlatform === 'linux' && linuxTelemetryData) {
      const calculatedScores = calculateScores(linuxTelemetryData, 'linux');
      setScores(calculatedScores);
      updateStats(calculatedScores);
    }
  }, [currentPlatform, windowsTelemetryData, linuxTelemetryData]);

  // Function to load all telemetry data from Supabase API
  const loadAllTelemetryData = async () => {
    setIsLoading(true);
    
    try {
      // Load Windows data from Supabase API
      const windowsResponse = await fetch('/api/telemetry/windows');
      if (!windowsResponse.ok) 
        throw new Error(`Failed to fetch Windows telemetry data: ${windowsResponse.status}`);
      
      const windowsData = await windowsResponse.json();
      setWindowsTelemetryData(windowsData);
      
      // Load Linux data from Supabase API
      const linuxResponse = await fetch('/api/telemetry/linux');
      if (!linuxResponse.ok) 
        throw new Error(`Failed to fetch Linux telemetry data: ${linuxResponse.status}`);
      
      const linuxData = await linuxResponse.json();
      setLinuxTelemetryData(linuxData);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading telemetry data:', error);
      setError(error.message || 'Failed to load telemetry data');
      setIsLoading(false);
    }
  };

  // Function to calculate scores with platform-specific categories
  const calculateScores = (data, platform) => {
    const categories = platform.toLowerCase() === 'linux' ? 
        LINUX_CATEGORIES_VALUED : WINDOWS_CATEGORIES_VALUED;

    // Filter out optional telemetry from scoring calculation
    const scoringData = data.filter(entry => !entry.optional);

    const edrHeaders = Object.keys(data[0] || {}).filter(
        key => key !== 'Telemetry Feature Category' &&
               key !== 'Sub-Category' &&
               key !== 'optional' &&
               key !== '__explanations'
    );

    // Initialize scores object for each EDR
    let scoresArray = edrHeaders.map(edr => ({ edr: edr, score: 0 }));

    scoringData.forEach(entry => {
        const subCategory = entry['Sub-Category'];
        const featureWeight = categories[subCategory] || 0;

        edrHeaders.forEach((edr, index) => {
            const status = entry[edr];
            const statusValue = FEATURES_DICT_VALUED[status] !== undefined ? 
                FEATURES_DICT_VALUED[status] : 0;
            const scoreIncrement = statusValue * featureWeight;
            scoresArray[index].score += scoreIncrement;
        });
    });

    // Sort scores in descending order
    scoresArray.sort((a, b) => b.score - a.score);

    return scoresArray;
  };

  // Update statistics based on scores
  const updateStats = (scoreData) => {
    if (scoreData.length === 0) return;
    
    const avgScore = scoreData.reduce((acc, curr) => acc + curr.score, 0) / scoreData.length;
    const maxScore = Math.max(...scoreData.map(s => s.score));
    const minScore = Math.min(...scoreData.map(s => s.score));
    
    setStats({
      avgScore,
      maxScore,
      minScore
    });
  };

  // Function to get row class based on rank
  const getRowClass = (index) => {
    if (index === 0) return 'gold-row';
    if (index === 1) return 'silver-row';
    if (index === 2) return 'bronze-row';
    return '';
  };

  // Function to render rank
  const renderRank = (index) => {
    if (index === 0) return <><span className="rank-top">1</span></>
    if (index === 1) return <><span className="rank-top">2</span></>
    if (index === 2) return <><span className="rank-top">3</span></>
    return index + 1;
  };

  return (
    <TemplatePage title="EDR Telemetry Project - Scores">
      <div className="scores-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>EDR Telemetry Scores</h1>
            <p>Compare the telemetry capabilities of different EDR solutions based on our scoring methodology.</p>
          </div>
        </div>

        <div className="scores-container">
          {/* Platform selector */}
          <div className="platform-selector">
            <button 
              className={`platform-btn ${currentPlatform === 'windows' ? 'active' : ''}`}
              onClick={() => setCurrentPlatform('windows')}
            >
              Windows
            </button>
            <button 
              className={`platform-btn linux ${currentPlatform === 'linux' ? 'active' : ''}`}
              onClick={() => setCurrentPlatform('linux')}
            >
              Linux
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="error-container">
              <h3>Unable to Load Data</h3>
              <p>{error}</p>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="loader-wrapper">
              <div className="loader"></div>
            </div>
          )}
          
          {/* Scores content */}
          {!isLoading && !error && (
            <div className="scores-content">
              {/* Scores table */}
              <div className="scores-table-wrapper">
                <table className="scores-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>EDR Solution</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((entry, index) => (
                      <tr key={entry.edr} className={getRowClass(index)}>
                        <td className="rank">
                          {renderRank(index)}
                        </td>
                        <td>
                          <div className="edr-cell">
                            <span className="edr-name">{entry.edr}</span>
                            <span className={`platform-tag ${currentPlatform}`}>
                              {currentPlatform}
                            </span>
                          </div>
                        </td>
                        <td className="score">
                          {entry.score.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Statistics */}
              <div className="stats-card">
                <h3>Score Statistics</h3>
                <div className="stat-item">
                  <div className="stat-label">Average Score</div>
                  <div className="stat-value">
                    {stats.avgScore.toFixed(2)}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Highest Score</div>
                  <div className="stat-value highest">
                    {stats.maxScore.toFixed(2)}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Lowest Score</div>
                  <div className="stat-value lowest">
                    {stats.minScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Scoring methodology */}
          <div className="methodology">
            <h2 id="scoring-methodology">Understanding the Scores</h2>
            <p>Our scoring system evaluates EDR solutions based on telemetry capabilities across various categories. Each telemetry feature is weighted based on its importance in endpoint detection and response.</p>
            
            <div className="methodology-sections">
              <div className="methodology-section">
                <h3 id="status-values">Status Values</h3>
                <table className="status-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Yes</td>
                      <td>1.0</td>
                    </tr>
                    <tr>
                      <td>Via EnablingTelemetry</td>
                      <td>1.0</td>
                    </tr>
                    <tr>
                      <td>Partially</td>
                      <td>0.5</td>
                    </tr>
                    <tr>
                      <td>Via EventLogs</td>
                      <td>0.5</td>
                    </tr>
                    <tr>
                      <td>No</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Pending Response</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="methodology-section">
                <h3 id="feature-weights">Feature Weights</h3>
                <p>Each telemetry feature category is weighted based on its importance in the overall assessment. Some key examples include:</p>
                
                <div className="weight-cards">
                  <div className="weight-card">
                    <span className="category-name">Process Creation</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">Process Access</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">File Creation</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">File Modification</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">File Deletion</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">DNS Query</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">TCP Connection</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">Remote Thread</span>
                    <span className="weight-value">1.0</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">File Renaming</span>
                    <span className="weight-value">0.7</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">Account Login</span>
                    <span className="weight-value">0.7</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">Process Termination</span>
                    <span className="weight-value">0.5</span>
                  </div>
                  <div className="weight-card">
                    <span className="category-name">Account Logoff</span>
                    <span className="weight-value">0.4</span>
                  </div>
                </div>
                
                <a 
                  href="https://github.com/tsale/EDR-Telemetry/blob/529c238c3af4bfaa9fce77350af21a6d5758fa39/Tools/compare.py#L7-L102" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  View complete weight distribution on GitHub
                </a>
              </div>
            </div>
            
            <div className="methodology-section">
              <h3 id="optional-telemetry">Optional Telemetry & Fair Scoring</h3>
              <p>To maintain fair and consistent scoring across all EDR vendors, new Sub-Categories are initially marked as &quot;optional&quot; and <strong>do not count against the final scoring</strong> until they reach sufficient adoption across the vendor ecosystem.</p>
              
              <div className="optional-info">
                <div className="optional-rule">
                  <strong>75% Coverage Rule:</strong> New Sub-Categories only contribute to vendor scores once they achieve at least 75% implementation coverage across all currently supported EDR vendors.
                </div>
                <div className="optional-benefit">
                  <strong>Why This Matters:</strong> This approach prevents unfair advantages for vendors who propose new telemetry additions, ensuring that scores reflect mature, widely-adopted telemetry capabilities rather than cutting-edge features that may not be universally supported.
                </div>
                <div className="optional-visual">
                  <strong>Visual Indicator:</strong> Optional telemetry features are marked with a <span className="optional-badge">New</span> badge in the telemetry tables and will be promoted to scored telemetry once the coverage threshold is met.
                </div>
              </div>
            </div>
            
            <h3 id="final-score-calculation">Final Score Calculation</h3>
            <div className="formula-container">
              <div className="formula">
                Total Score = Σ (Status Value × Feature Weight) <small>for non-optional features</small>
              </div>
              <div className="formula-explanation">
                The final score represents the weighted sum of all non-optional features, providing a comprehensive evaluation of each EDR solution&apos;s telemetry capabilities.
              </div>
            </div>
            
            <p>To calculate the score:</p>
            <ol>
              <li>Optional telemetry features are excluded from the scoring calculation</li>
              <li>For each remaining telemetry feature (sub-category), we determine the implementation status (Yes, Partially, Via EventLogs, etc.)</li>
              <li>The status is converted to a numerical value according to the status table</li>
              <li>This value is multiplied by the weight assigned to that feature category</li>
              <li>All weighted values are summed to produce the final score</li>
            </ol>
            
            <p>This methodology ensures that more critical telemetry capabilities have a greater impact on the overall score, providing a fair and accurate comparison between different EDR solutions.</p>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
}

import TemplatePage from '../components/TemplatePage'
import { useState, useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'
import { Trophy, TrendingUp, TrendingDown, BarChart3, Info, Github, Award, Medal, Crown } from 'lucide-react'
import TransparencyIndicator from '../components/TransparencyIndicator'

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
  "Process Call Stacks": 1,
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
  const [transparencyData, setTransparencyData] = useState({});

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
      // Load Windows, Linux, and transparency data in parallel
      const [windowsResponse, linuxResponse, transparencyResponse] = await Promise.all([
        fetch('/api/telemetry/windows'),
        fetch('/api/telemetry/linux'),
        fetch('/api/telemetry/transparency')
      ]);

      if (!windowsResponse.ok)
        throw new Error(`Failed to fetch Windows telemetry data: ${windowsResponse.status}`);

      const windowsData = await windowsResponse.json();
      setWindowsTelemetryData(windowsData);

      if (!linuxResponse.ok)
        throw new Error(`Failed to fetch Linux telemetry data: ${linuxResponse.status}`);

      const linuxData = await linuxResponse.json();
      setLinuxTelemetryData(linuxData);

      if (transparencyResponse.ok) {
        const transparency = await transparencyResponse.json();
        setTransparencyData(transparency);
      }

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
    <TemplatePage title="EDR Telemetry Scores: Vendor-Neutral Benchmarking"
      description="Compare endpoint detection telemetry depth with transparent, weighted scoring for Windows and Linux.">

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/20 blur-[100px]"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Trophy className="w-4 h-4 mr-2" />
            Transparent Scoring Methodology
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 !text-white heading-processed">
            EDR Telemetry Scores
          </h1>

          <div className="w-full flex justify-center">
            <p className="mt-6 text-xl !text-slate-300 max-w-3xl leading-relaxed text-center">
              Compare the telemetry capabilities of different EDR solutions based on our transparent, weighted scoring methodology.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Platform selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex gap-2 rounded-xl bg-slate-100 shadow-lg p-2 border border-slate-200">
              <button
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentPlatform === 'windows'
                  ? '!bg-blue-600 !text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                onClick={() => setCurrentPlatform('windows')}
              >
                Windows
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${currentPlatform === 'linux'
                  ? '!bg-orange-500 !text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                onClick={() => setCurrentPlatform('linux')}
              >
                Linux
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto mb-8">
              <div className="text-red-600 mb-2">
                <Info className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Unable to Load Data</h3>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-600 font-medium">Loading scores...</p>
              </div>
            </div>
          )}

          {/* Scores content */}
          {!isLoading && !error && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Scores table */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-2 sm:px-6 py-4 text-left text-sm font-bold text-slate-700">Rank</th>
                          <th className="px-2 sm:px-6 py-4 text-left text-sm font-bold text-slate-700">EDR Solution</th>
                          <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-bold text-slate-700">
                            <span className="inline-flex items-center gap-1" title="Validation method and transparency details">
                              Transparency
                              <Info className="w-3.5 h-3.5 text-slate-400" />
                            </span>
                          </th>
                          <th className="px-2 sm:px-6 py-4 text-right text-sm font-bold text-slate-700">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {scores.map((entry, index) => (
                          <tr
                            key={entry.edr}
                            className={`transition-all hover:bg-slate-50 ${index === 0 ? 'bg-amber-50/50' :
                              index === 1 ? 'bg-slate-100/50' :
                                index === 2 ? 'bg-orange-50/50' : ''
                              }`}
                          >
                            <td className="px-2 sm:px-6 py-4">
                              <div className="flex items-center">
                                {index === 0 && <Crown className="w-5 h-5 text-amber-500 mr-2" />}
                                {index === 1 && <Medal className="w-5 h-5 text-slate-400 mr-2" />}
                                {index === 2 && <Award className="w-5 h-5 text-orange-600 mr-2" />}
                                <span className={`font-bold ${index === 0 ? 'text-amber-600 text-xl' :
                                    index === 1 ? 'text-slate-500 text-xl' :
                                      index === 2 ? 'text-orange-600 text-xl' :
                                        'text-slate-600'
                                  }`}>
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-slate-900 inline-flex items-center">
                                  {entry.edr}
                                </span>
                                <div className="sm:hidden mt-1">
                                  <TransparencyIndicator
                                    indicators={transparencyData[entry.edr]?.indicators || []}
                                    transparencyNote={transparencyData[entry.edr]?.transparency_note || ''}
                                    vendorName={entry.edr}
                                    showLabel={true}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-6 py-4">
                              <TransparencyIndicator
                                indicators={transparencyData[entry.edr]?.indicators || []}
                                transparencyNote={transparencyData[entry.edr]?.transparency_note || ''}
                                vendorName={entry.edr}
                                showLabel={true}
                              />
                            </td>
                            <td className="px-2 sm:px-6 py-4 text-right">
                              <span className="text-lg font-bold text-slate-900">
                                {entry.score.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900">Score Statistics</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="font-medium">Average Score</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {stats.avgScore.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-emerald-700 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">Highest Score</span>
                      </div>
                      <div className="text-3xl font-bold text-emerald-600">
                        {stats.maxScore.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-medium">Lowest Score</span>
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        {stats.minScore.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scoring methodology */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 id="scoring-methodology" className="text-3xl font-bold text-slate-900 mb-4">Understanding the Scores</h2>
            <p className="text-lg text-slate-600 mb-8">Our scoring system evaluates EDR solutions based on telemetry capabilities across various categories. Each telemetry feature is weighted based on its importance in endpoint detection and response.</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 id="status-values" className="text-xl font-bold text-slate-900 mb-4">Status Values</h3>
                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-white transition-colors">
                        <td className="px-4 py-3 text-slate-700">Yes</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">1.0</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="px-4 py-3 text-slate-700">Via EnablingTelemetry</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">1.0</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="px-4 py-3 text-slate-700">Partially</td>
                        <td className="px-4 py-3 text-right font-bold text-amber-600">0.5</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="px-4 py-3 text-slate-700">Via EventLogs</td>
                        <td className="px-4 py-3 text-right font-bold text-amber-600">0.5</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="px-4 py-3 text-slate-700">No</td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">0</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="px-4 py-3 text-slate-700">Pending Response</td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 id="feature-weights" className="text-xl font-bold text-slate-900 mb-4">Feature Weights</h3>
                <p className="text-slate-600 mb-4">Each telemetry feature category is weighted based on its importance in the overall assessment. Some key examples include:</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Process Creation</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Process Access</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">File Creation</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">File Modification</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">File Deletion</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">DNS Query</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">TCP Connection</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Remote Thread</span>
                    <span className="text-sm font-bold text-blue-600">1.0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">File Renaming</span>
                    <span className="text-sm font-bold text-amber-600">0.7</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Account Login</span>
                    <span className="text-sm font-bold text-amber-600">0.7</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Process Termination</span>
                    <span className="text-sm font-bold text-orange-600">0.5</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Account Logoff</span>
                    <span className="text-sm font-bold text-orange-600">0.4</span>
                  </div>
                </div>

                <a
                  href="https://github.com/tsale/EDR-Telemetry/blob/529c238c3af4bfaa9fce77350af21a6d5758fa39/Tools/compare.py#L7-L102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View complete weight distribution on GitHub
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h3 id="optional-telemetry" className="text-xl font-bold text-slate-900 mb-4">Optional Telemetry & Fair Scoring</h3>
              <p className="text-slate-600 mb-6">To maintain fair and consistent scoring across all EDR vendors, new Sub-Categories are initially marked as &quot;optional&quot; and <strong>do not count against the final scoring</strong> until they reach sufficient adoption across the vendor ecosystem.</p>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 space-y-4">
                <div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">75% Coverage Rule:</strong>
                      <p className="text-blue-800 mt-1">New Sub-Categories only contribute to vendor scores once they achieve at least 75% implementation coverage across all currently supported EDR vendors.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">Why This Matters:</strong>
                      <p className="text-blue-800 mt-1">This approach prevents unfair advantages for vendors who propose new telemetry additions, ensuring that scores reflect mature, widely-adopted telemetry capabilities rather than cutting-edge features that may not be universally supported.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">Visual Indicator:</strong>
                      <p className="text-blue-800 mt-1">Optional telemetry features are marked with a <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">New</span> badge in the telemetry tables and will be promoted to scored telemetry once the coverage threshold is met.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 id="final-score-calculation" className="text-xl font-bold text-slate-900 mb-4">Final Score Calculation</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  Total Score = Σ (Status Value × Feature Weight)
                </div>
                <div className="text-sm text-slate-600 italic">
                  for non-optional features
                </div>
                <p className="text-slate-700 mt-4 max-w-2xl mx-auto">
                  The final score represents the weighted sum of all non-optional features, providing a comprehensive evaluation of each EDR solution&apos;s telemetry capabilities.
                </p>
              </div>

              <div className="mt-6">
                <p className="text-slate-700 font-semibold mb-3">To calculate the score:</p>
                <ol className="space-y-2 text-slate-600 list-decimal list-inside">
                  <li>Optional telemetry features are excluded from the scoring calculation</li>
                  <li>For each remaining telemetry feature (sub-category), we determine the implementation status (Yes, Partially, Via EventLogs, etc.)</li>
                  <li>The status is converted to a numerical value according to the status table</li>
                  <li>This value is multiplied by the weight assigned to that feature category</li>
                  <li>All weighted values are summed to produce the final score</li>
                </ol>
              </div>

              <p className="text-slate-600 mt-6">
                This methodology ensures that more critical telemetry capabilities have a greater impact on the overall score, providing a fair and accurate comparison between different EDR solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
}

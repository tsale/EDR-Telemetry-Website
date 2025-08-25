import TemplatePage from '../components/TemplatePage'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

export default function Eligibility() {
  // Use the heading links hook
  useHeadingLinks();
  
  useEffect(() => {
    // Client-side code for Eligibility page
    // Search functionality for the exclusion table
    if (typeof window !== 'undefined') {
      const searchInput = document.getElementById('exclusionSearch');
      const exclusionRows = document.querySelectorAll('.exclusion-row:not(.header)');
      const exclusionFilter = document.querySelector('.exclusion-filter');
      
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase().trim();
          let visibleCount = 0;
          
          exclusionRows.forEach(row => {
            const productName = row.querySelector('.product-col').textContent.toLowerCase();
            const primaryReason = row.querySelector('.primary-reason-col').textContent.toLowerCase();
            const details = row.querySelector('.details-col').textContent.toLowerCase();
            
            const matchesSearch = 
              productName.includes(searchTerm) || 
              primaryReason.includes(searchTerm) || 
              details.includes(searchTerm);
            
            if (matchesSearch) {
              row.style.display = '';
              visibleCount++;
              // Highlight the matching text
              if (searchTerm.length > 0) {
                highlightText(row, searchTerm);
              } else {
                // Remove highlights if search is cleared
                removeHighlights(row);
              }
            } else {
              row.style.display = 'none';
            }
          });
          
          // Update the result count
          if (exclusionFilter) {
            exclusionFilter.setAttribute('data-count', visibleCount);
            if (searchTerm.length > 0) {
              exclusionFilter.classList.add('has-count');
            } else {
              exclusionFilter.classList.remove('has-count');
            }
          }
        });
        
        // Add placeholder animation
        searchInput.addEventListener('focus', function() {
          this.placeholder = '';
        });
        
        searchInput.addEventListener('blur', function() {
          if (!this.value) {
            this.placeholder = 'Search for products or limitations...';
          }
        });
      }
      
      // Function to highlight matching text
      function highlightText(row, term) {
        // First remove any existing highlights
        removeHighlights(row);
        
        // Get all text nodes in the row
        const textNodes = getTextNodes(row);
        
        textNodes.forEach(node => {
          const text = node.nodeValue;
          const lowerText = text.toLowerCase();
          let position = lowerText.indexOf(term);
          
          if (position !== -1) {
            // Create a document fragment to hold the new nodes
            const fragment = document.createDocumentFragment();
            let lastPosition = 0;
            
            while (position !== -1) {
              // Add text before the match
              if (position > lastPosition) {
                fragment.appendChild(document.createTextNode(text.substring(lastPosition, position)));
              }
              
              // Create a span for the highlighted text
              const highlight = document.createElement('span');
              highlight.className = 'highlight';
              highlight.appendChild(document.createTextNode(text.substring(position, position + term.length)));
              fragment.appendChild(highlight);
              
              lastPosition = position + term.length;
              position = lowerText.indexOf(term, lastPosition);
            }
            
            // Add any remaining text
            if (lastPosition < text.length) {
              fragment.appendChild(document.createTextNode(text.substring(lastPosition)));
            }
            
            // Replace the original node with the fragment
            node.parentNode.replaceChild(fragment, node);
          }
        });
      }
      
      // Function to get all text nodes in an element
      function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        
        let node;
        while (node = walker.nextNode()) {
          if (node.nodeValue.trim() !== '') {
            textNodes.push(node);
          }
        }
        
        return textNodes;
      }
      
      // Function to remove highlights
      function removeHighlights(element) {
        const highlights = element.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
          const parent = highlight.parentNode;
          parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
          parent.normalize();
        });
      }
    }
  }, [])

  return (
    <TemplatePage title="EDR Eligibility Criteria - EDR Telemetry Project">
      <div className="hero-eligibility-modern">
        <div className="hero-eligibility-content">
          <div className="eligibility-badge-modern">
            <span className="shield-icon">🛡️</span>
            EDR Evaluation Guidelines
          </div>
          <h1 className="eligibility-heading-modern">
            Eligibility Criteria &{' '}
            <span className="eligibility-heading-gradient">
              Solution Requirements
            </span>
          </h1>
          <p className="eligibility-description-modern">
            Comprehensive guidelines for EDR solution implementation, including eligibility requirements, 
            exclusion criteria, and conditional approval processes for enterprise environments.
          </p>
          <div className="eligibility-buttons-modern">
            <a href="#core-requirements" className="eligibility-button-primary-modern">
              <span style={{marginRight: '0.5rem'}}>👁️</span>
              View Requirements
            </a>
            <a href="#ineligible-solutions" className="eligibility-button-secondary-modern">
              <span style={{marginRight: '0.5rem'}}>📋</span>
              View Exclusions
            </a>
          </div>
        </div>
      </div>
      {/* Modern Definition Cards */}
      <div className="definitions-section-modern">
        <div className="definitions-header-modern">
          <h2 className="definitions-title-modern">Key Definitions</h2>
          <p className="definitions-subtitle-modern">
            Understanding the fundamental concepts of EDR eligibility and implementation
          </p>
        </div>
        
        <div className="definitions-grid-modern">
          <div className="definition-card-modern blue">
            <div className="definition-card-header-modern">
              <div className="definition-card-icon-modern">
                <span>🛡️</span>
              </div>
              <h3 id="core-requirements" className="definition-card-title-modern">Core Requirements</h3>
            </div>
            <div className="definition-card-description-modern">
              For an EDR solution to be included in our comparison, it must provide real-time event collection, 
              automated telemetry without manual intervention, and out-of-the-box capabilities as a dedicated EDR solution.
            </div>
          </div>

          <div className="definition-card-modern green">
            <div className="definition-card-header-modern">
              <div className="definition-card-icon-modern">
                <span>✓</span>
              </div>
              <h3 className="definition-card-title-modern">EDR Telemetry Definition</h3>
            </div>
            <div className="definition-card-description-modern">
              Data or events automatically collected and transmitted by a sensor in real-time as events occur, 
              excluding live querying, artifact access, or correlation-based signals.
            </div>
          </div>

          <div className="definition-card-modern red">
            <div className="definition-card-header-modern">
              <div className="definition-card-icon-modern">
                <span>✗</span>
              </div>
              <h3 className="definition-card-title-modern">Exclusion Factors</h3>
            </div>
            <div className="definition-card-description-modern">
              Solutions that lack continuous real-time telemetry streaming, require manual collection, 
              or don't provide direct access to raw telemetry data for customer analysis.
            </div>
          </div>

          <div className="definition-card-modern yellow">
            <div className="definition-card-header-modern">
              <div className="definition-card-icon-modern">
                <span>⚠️</span>
              </div>
              <h3 className="definition-card-title-modern">Direct vs Inferred</h3>
            </div>
            <div className="definition-card-description-modern">
              Each telemetry event must represent a distinct system action captured directly rather than inferred. 
              For example, explicit service creation recording vs. assuming service creation from process events.
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="requirements-section">
          <div className="definition-card eligibility" style={{display: 'none'}}>
            <h3 id="core-requirements">Core Requirements</h3>
            <p>For an EDR solution to be included in our comparison, it must meet these basic requirements:</p>
            <ul>
              <li>Provide real-time or near real-time event collection</li>
              <li>Offer automated telemetry collection without manual intervention</li>
              <li>Include out-of-the-box telemetry capabilities</li>
              <li>Function as a dedicated endpoint detection and response solution</li>
              <li>Collect direct telemetry events rather than inferred activities <a href="#telemetry-vs-inferred">(See detailed explanation below)</a></li>
            </ul>
          </div>

          <div className="definition-card telemetry" style={{display: 'none'}}>
            <h3 id="edr-telemetry-definition">EDR Telemetry Definition</h3>
            <p>In this project, EDR Telemetry refers to data or events that are:</p>
            <div className="includes">
              <h4 id="included-telemetry">✓ Included</h4>
              <li>Automatically collected and transmitted by a sensor in real-time or near real-time as events occur</li>
            </div>
            <div className="excludes">
              <h4 id="excluded-telemetry">✗ Not Included</h4>
              <ul>
                <li>Live querying of artifacts</li>
                <li>Access to artifacts on a system</li>
                <li>Signals or detections based on correlation</li>
                <li>Additional modules or integrations</li>
              </ul>
            </div>
          </div>

          <div id="telemetry-vs-inferred" className="definition-card telemetry-vs-inferred" style={{display: 'none'}}>
            <h3 id="telemetry-vs-inferred-comparison">Telemetry Events vs. Inferred Activity</h3>
            <p>Each telemetry event must represent a distinct and independent system action, captured directly rather than inferred:</p>
            <div className="includes">
              <h4 id="direct-telemetry">✓ Direct Telemetry</h4>
              <p>Explicit event recording of service creation through Windows Service Control Manager</p>
            </div>
            <div className="excludes">
              <h4 id="inferred-activity">✗ Inferred Activity</h4>
              <p>Assuming service creation by detecting new process creation events with command line: <code style={{ color: 'red' }}>sc create ServiceName binPath= "C:\Example\Path\To\YourApp.exe"</code></p>
            </div>
          </div>

          {/* Enhanced Requirements Section */}
          <div className="requirements-section-modern">
            <div className="requirements-card-modern">
              <div className="requirements-card-header-modern">
                <h2 id="ineligible-solutions" className="requirements-card-title-modern">Eligibility Requirements</h2>
                <p className="requirements-card-subtitle-modern">
                  Search and filter through EDR solution eligibility criteria and exclusions
                </p>
              </div>
              <div className="search-controls-modern">
                <div className="search-input-modern">
                  <span className="search-icon">🔍</span>
                  <input type="text" id="exclusionSearch" placeholder="Search criteria, categories, or details..." aria-label="Search exclusion table" />
                </div>
                <div className="filter-select-modern">
                  <select id="statusFilter">
                    <option value="all">All Statuses</option>
                    <option value="excluded">Excluded</option>
                    <option value="conditional">Conditional</option>
                  </select>
                </div>
                <div className="filter-select-modern">
                  <select id="categoryFilter">
                    <option value="all">All Categories</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="telemetry">Telemetry</option>
                    <option value="functionality">Functionality</option>
                  </select>
                </div>
              </div>
              
              <div className="disclaimer-callout" style={{margin: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '0.75rem'}}>
                <div className="disclaimer-icon" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>ℹ️</div>
                <div className="disclaimer-content">
                  <h4 style={{color: '#1e40af', marginBottom: '0.5rem', fontWeight: '600'}}>Important Note</h4>
                  <p style={{marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5'}}>The exclusion of a product from this comparison does not reflect on its overall quality or effectiveness. Each solution listed below may excel in its intended use case and could be the ideal choice depending on your specific environment, security requirements, and operational needs.</p>
                  <p style={{color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5'}}>Our eligibility criteria are specifically designed for comparing traditional EDR telemetry capabilities and should not be the sole factor in evaluating security solutions for your organization.</p>
                </div>
              </div>
              
              <div className="modern-table-container">
                <table className="modern-table">
                  <thead className="modern-table-header">
                    <tr>
                      <th>Product</th>
                      <th>Primary Limitation</th>
                      <th>Additional Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Sandfly</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">No Real-time Streaming</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Lacks continuous real-time telemetry streaming capabilities</p>
                          <p style={{marginBottom: '0.5rem'}}>• Focuses on periodic scanning and threat hunting</p>
                          <p>• Designed for point-in-time forensics rather than real-time detection</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Velociraptor</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Manual Collection Required</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Relies on manual VQL queries for artifact collection</p>
                          <p style={{marginBottom: '0.5rem'}}>• No continuous automated telemetry stream</p>
                          <p>• Better suited for incident response than continuous monitoring</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">OSquery (standalone)</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">No Real-time Collection</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Designed for point-in-time queries</p>
                          <p style={{marginBottom: '0.5rem'}}>• Lacks native event streaming capability</p>
                          <p>• Requires additional tooling for continuous monitoring</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Huntress EDR</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Limited EDR Functionality</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Lacks direct access to raw telemetry data</p>
                          <p style={{marginBottom: '0.5rem'}}>• Managed threat hunting platform rather than traditional EDR</p>
                          <p>• Limited endpoint telemetry visibility for customers</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Cisco EDR</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Limited EDR Functionality</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Lacks direct access to raw telemetry data</p>
                          <p style={{marginBottom: '0.5rem'}}>• Requires additional modules and licensing</p>
                          <p>• Limited endpoint telemetry visibility in base product</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Tanium</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Limited Real-Time Telemetry</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Focuses on forensic visibility rather than real-time ingestion</p>
                          <p style={{marginBottom: '0.5rem'}}>• Uses polling-based architecture vs continuous streaming</p>
                          <p>• Lacks continuous real-time monitoring capabilities</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Kaspersky</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Limited Telemetry Access</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Does not provide open access to detailed raw telemetry</p>
                          <p>• Telemetry data is aggregated, limiting granular visibility</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Aurora</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Not a Full EDR Solution</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Functions as threat detection engine vs complete EDR</p>
                          <p style={{marginBottom: '0.5rem'}}>• Relies on log ingestion and rule-based detection</p>
                          <p>• Does not stream telemetry to centralized location</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">Wazuh</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">No Native Telemetry Collection</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• Relies on external tools (Sysmon, OSQuery)</p>
                          <p style={{marginBottom: '0.5rem'}}>• Functions primarily as a log aggregator</p>
                          <p>• Lacks native real-time event streaming capabilities</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="exclusion-row modern-table-row">
                      <td className="product-col modern-table-cell">
                        <span className="category-badge-modern">BitDefender EDR</span>
                      </td>
                      <td className="primary-reason-col modern-table-cell">
                        <span className="status-badge-modern excluded">Limited EDR Functionality</span>
                      </td>
                      <td className="details-col modern-table-cell">
                        <div style={{fontSize: '0.875rem', color: '#64748b'}}>
                          <p style={{marginBottom: '0.5rem'}}>• No ability to search logs unless an alert fires</p>
                          <p style={{marginBottom: '0.5rem'}}>• No continuous event ingestion for full visibility</p>
                          <p>• Functions more like an NGAV than a true EDR</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
        </div>
      </div>
    </div>
    </TemplatePage>
  )
}
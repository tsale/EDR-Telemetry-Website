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
      <div className="hero-section">
        <div className="hero-content">
          <h1>EDR Eligibility Criteria</h1>
          <p>Understanding which solutions qualify for comparison in the EDR Telemetry Project</p>
        </div>
      </div>
      <div className="content-container">
        <div className="requirements-section">
          <div className="definition-card eligibility">
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

          <div className="definition-card telemetry">
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

          <div id="telemetry-vs-inferred" className="definition-card telemetry-vs-inferred">
            <h3 id="telemetry-vs-inferred-comparison">Telemetry Events vs. Inferred Activity</h3>
            <p>Each telemetry event must represent a distinct and independent system action, captured directly rather than inferred:</p>
            <div className="includes">
              <h4 id="direct-telemetry">✓ Direct Telemetry</h4>
              <p>Explicit event recording of service creation through Windows Service Control Manager</p>
            </div>
            <div className="excludes">
              <h4 id="inferred-activity">✗ Inferred Activity</h4>
              <p>Assuming service creation by detecting new registry keys under <code style={{ color: 'red' }}>HKLM\SYSTEM\CurrentControlSet\services</code></p>
            </div>
          </div>

          <div className="definition-card excluded-edrs">
            <h3 id="ineligible-solutions">Solutions Not Currently Meeting Criteria</h3>
            <div className="disclaimer-callout">
              <div className="disclaimer-icon">ℹ️</div>
              <div className="disclaimer-content">
                <h4>Important Note</h4>
                <p>The exclusion of a product from this comparison does not reflect on its overall quality or effectiveness. Each solution listed below may excel in its intended use case and could be the ideal choice depending on your specific environment, security requirements, and operational needs.</p>
                <p>Our eligibility criteria are specifically designed for comparing traditional EDR telemetry capabilities and should not be the sole factor in evaluating security solutions for your organization.</p>
              </div>
            </div>
            <p>The following solutions are not included in our comparison due to specific limitations in meeting our eligibility criteria:</p>
            
            <div className="exclusion-filter">
              <div className="exclusion-search">
                <input type="text" id="exclusionSearch" placeholder="Search for products or limitations..." aria-label="Search exclusion table" />
              </div>
            </div>
            
            <div className="exclusion-table">
              <div className="exclusion-row header">
                <div className="product-col">Product</div>
                <div className="primary-reason-col">Primary Limitation</div>
                <div className="details-col">Additional Details</div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Sandfly</div>
                <div className="primary-reason-col">No Real-time Streaming</div>
                <div className="details-col">
                  <ul>
                    <li>Lacks continuous real-time telemetry streaming capabilities of traditional EDR solutions</li>
                    <li>Focuses on periodic scanning and threat hunting rather than continuous monitoring</li>
                    <li>Designed for point-in-time forensics and incident response rather than real-time detection</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Velociraptor</div>
                <div className="primary-reason-col">Manual Collection Required</div>
                <div className="details-col">
                  <ul>
                    <li>Relies on manual VQL queries for artifact collection</li>
                    <li>No continuous automated telemetry stream</li>
                    <li>Better suited for incident response than continuous monitoring</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">OSquery (standalone)</div>
                <div className="primary-reason-col">No Real-time Collection</div>
                <div className="details-col">
                  <ul>
                    <li>Designed for point-in-time queries</li>
                    <li>Lacks native event streaming capability</li>
                    <li>Requires additional tooling for continuous monitoring</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Huntress EDR</div>
                <div className="primary-reason-col">Limited EDR Functionality</div>
                <div className="details-col">
                  <ul>
                    <li>Lacks direct access to raw telemetry data for customer analysis and investigation</li>
                    <li>Managed threat hunting platform rather than traditional EDR</li>
                    <li>Limited endpoint telemetry visibility for customers</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Cisco EDR</div>
                <div className="primary-reason-col">Limited EDR Functionality</div>
                <div className="details-col">
                  <ul>
                    <li>Lacks direct access to raw telemetry data for customer analysis and investigation</li>
                    <li>Requires additional modules and licensing for basic EDR capabilities</li>
                    <li>Limited endpoint telemetry visibility in base product</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Tanium</div>
                <div className="primary-reason-col">Limited Real-Time Telemetry</div>
                <div className="details-col">
                  <ul>
                    <li>Primarily focuses on forensic endpoint visibility rather than real-time telemetry ingestion</li>
                    <li>Uses polling-based architecture instead of continuous event streaming, leading to potential telemetry gaps</li>
                    <li>Lacks continuous real-time process creation, file modification, and script execution monitoring</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Kaspersky</div>
                <div className="primary-reason-col">Limited Telemetry Access</div>
                <div className="details-col">
                  <ul>
                    <li>Does not provide open access to detailed raw telemetry data</li>
                    <li>Telemetry data is aggregated, limiting granular event-level visibility</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Aurora</div>
                <div className="primary-reason-col">Not a Full EDR Solution</div>
                <div className="details-col">
                  <ul>
                    <li>Functions as a threat detection engine rather than a complete EDR solution</li>
                    <li>Relies on log ingestion and rule-based detection instead of real-time telemetry collection</li>
                    <li>Does not stream telemetry data to a centralized location for real-time analysis and monitoring</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">Wazuh</div>
                <div className="primary-reason-col">No Native Telemetry Collection</div>
                <div className="details-col">
                  <ul>
                    <li>Relies on external tools (Sysmon, OSQuery) for basic endpoint telemetry collection</li>
                    <li>Functions primarily as a log aggregator rather than direct telemetry collector</li>
                    <li>Lacks native real-time event streaming capabilities for endpoint activities</li>
                  </ul>
                </div>
              </div>
              <div className="exclusion-row">
                <div className="product-col">BitDefender EDR</div>
                <div className="primary-reason-col">Limited EDR Functionality</div>
                <div className="details-col">
                  <ul>
                    <li>No ability to search logs unless an alert fires</li>
                    <li>No continuous event ingestion for full system visibility</li>
                    <li>Functions more like an NGAV than a true EDR</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 
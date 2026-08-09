import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
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
      const exclusionRows = document.querySelectorAll('.eligibility-exclusion-row:not(.header)');
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
    <TemplatePage title="EDR Eligibility & Scope Criteria"
      description="Understand inclusion rules, exclusions, and definitions used in EDR telemetry benchmarking.">
      <div className="hero-eligibility-modern">
        <div className="hero-eligibility-content">
          <div className="eligibility-badge-modern">
            <span className="shield-icon">🛡️</span>
            EDR Evaluation Guidelines
          </div>
          <h1 className="eligibility-heading-modern">
            Eligibility Criteria &{' '}
            <span className="eligibility-heading-gradient">
              Excluded Products
            </span>
          </h1>
          <p className="eligibility-description-modern">
            Inclusion rules, exclusions, and definitions used when a product is compared for
            telemetry visibility.
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
            Terms used in the inclusion and exclusion rules below
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
              or don&apos;t provide direct access to raw telemetry data for customer analysis.
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

      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 id="telemetry-eligibility-standard" className="text-3xl font-bold text-slate-900 mb-4">Telemetry Eligibility Standard</h2>
            <p className="text-slate-600 mb-6">
              A product must expose automatically collected telemetry that a customer can search, export, hunt on, or use for investigation. Live query, point-in-time artifact collection, historical backfill, manual collection, and backend-only conclusions do not qualify as scoring telemetry.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                <h3 id="near-real-time-window" className="text-lg font-bold text-blue-900 mb-2">Near-real-time window</h3>
                <p className="text-blue-800 text-sm mb-0">Telemetry should be available for customer search within ten minutes by default, unless an engagement explicitly defines a different window.</p>
              </div>
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                <h3 id="consumer-availability" className="text-lg font-bold text-emerald-900 mb-2">Consumer availability</h3>
                <p className="text-emerald-800 text-sm mb-0">Telemetry must be accessible through the agreed product UI, API, or export without vendor engineering, support-only retrieval, or manual backend extraction.</p>
              </div>
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-100">
                <h3 id="directness-requirement" className="text-lg font-bold text-amber-900 mb-2">Directness requirement</h3>
                <p className="text-amber-800 text-sm mb-0">Direct events count. Inferences from unrelated file, process, registry, or log activity do not receive full direct-event credit.</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-5 bg-emerald-50">
                  <h3 id="direct-telemetry-visible" className="text-xl font-bold text-emerald-900 mb-2">Direct telemetry example</h3>
                  <p className="text-emerald-800 mb-0">A direct service-creation event exposed by the product.</p>
                </div>
                <div className="p-5 bg-red-50">
                  <h3 id="inferred-activity-visible" className="text-xl font-bold text-red-900 mb-2">Insufficient substitute</h3>
                  <p className="text-red-800 mb-0">Assuming service creation from a generic process event or a registry write under the Services key.</p>
                </div>
              </div>
            </div>
            <Link href="/methodology#valid-telemetry-criteria" className="inline-flex mt-6 text-blue-600 hover:underline font-semibold">
              Read the full methodology criteria
            </Link>
          </div>
        </div>
      </section>

      <div className="content-container">
        <div className="requirements-section">
          <div id="telemetry-vs-inferred" className="definition-card telemetry-vs-inferred" style={{display: 'none'}}>
            <h3 id="telemetry-vs-inferred-comparison">Telemetry Events vs. Inferred Activity</h3>
            <p>Each telemetry event must represent a distinct and independent system action, captured directly rather than inferred:</p>
            <div className="includes">
              <h4 id="direct-telemetry">✓ Direct Telemetry</h4>
              <p>Explicit event recording of service creation through Windows Service Control Manager</p>
            </div>
            <div className="excludes">
              <h4 id="inferred-activity">✗ Inferred Activity</h4>
              <p>Assuming service creation by detecting new process creation events with command line: <code style={{ color: 'red' }}>sc create ServiceName binPath= &quot;C:\Example\Path\To\YourApp.exe&quot;</code></p>
            </div>
          </div>

          {/* Enhanced Requirements Section */}
          <div className="requirements-section-modern">
            <div className="requirements-card-modern">
              <div className="requirements-card-header-modern">
                <h2 id="ineligible-solutions" className="requirements-card-title-modern">Eligibility Requirements</h2>
                <p className="requirements-card-subtitle-modern">
                  Search through EDR solution exclusions
                </p>
              </div>
              <div className="search-controls-modern">
                <div className="search-input-modern">
                  <span className="search-icon">🔍</span>
                  <input type="text" id="exclusionSearch" placeholder="Search criteria, categories, or details..." aria-label="Search exclusion table" />
                </div>
              </div>
              
              <div className="disclaimer-callout" style={{margin: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '0.75rem'}}>
                <div className="disclaimer-icon" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>ℹ️</div>
                <div className="disclaimer-content">
                  <h4 style={{color: '#1e40af', marginBottom: '0.5rem', fontWeight: '600'}}>Scope note</h4>
                  <p style={{marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5'}}>Exclusion means the product is out of scope for this telemetry comparison, not that it is a weak security product. Many listed products fit other use cases well.</p>
                  <p style={{color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5'}}>These criteria exist to compare traditional EDR telemetry capabilities. Do not treat them as a full product evaluation.</p>
                </div>
              </div>
              
          <div className="eligibility-table-container">
              <div className="eligibility-exclusion-row header">
                <div className="product-col">Product</div>
                <div className="primary-reason-col">Primary Limitation</div>
                <div className="details-col">Additional Details</div>
              </div>
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
                <div className="product-col">Kaspersky</div>
                <div className="primary-reason-col">Limited Telemetry Access</div>
                <div className="details-col">
                  <ul>
                    <li>Does not provide open access to detailed raw telemetry data</li>
                    <li>Telemetry data is aggregated, limiting granular event-level visibility</li>
                  </ul>
                </div>
              </div>
              <div className="eligibility-exclusion-row">
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
              <div className="eligibility-exclusion-row">
                <div className="product-col">Wazuh</div>
                <div className="primary-reason-col">Different Product Category</div>
                <div className="details-col">
                  <ul>
                    <li>Designed as a Unified XDR and SIEM platform with broader security monitoring scope beyond traditional EDR</li>
                    <li>While offering native telemetry capabilities, architecture differs from dedicated EDR sensor-based implementations</li>
                    <li>Platform focuses on unified security operations rather than specialized endpoint-centric EDR telemetry depth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TemplatePage>
  )
}

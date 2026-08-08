import TemplatePage from '../components/TemplatePage'
import Link from 'next/link'
import { useEffect } from 'react'
import useHeadingLinks from '../hooks/useHeadingLinks'

export default function Contribute() {
  // Use the heading links hook
  useHeadingLinks();
  
  useEffect(() => {
    // Initialize any client-side logic if needed
  }, []);

  return (
    <TemplatePage
      title="Contribute - EDR Telemetry Project"
      description="How to contribute telemetry evidence, pull requests, and documentation updates to the EDR Telemetry Project."
    >
      <div className="hero-section">
        <div className="hero-content">
          <h1>How to Contribute</h1>
          <p>Join our community of contributors and help improve EDR telemetry understanding</p>
        </div>
      </div>

      <div className="content-section">
        <div className="contribute-container">
          <div className="contribute-grid">
            <div className="method-card">
              <div className="icon">📝</div>
              <h3 id="about-contributions">About Contributions</h3>
              <p>We welcome all kinds of contributions to the EDR_telem.json file. Use our tools to make contributing easier:</p>
              <ul className="feature-list">
                <li><span className="check">✓</span>Convert between JSON and CSV formats</li>
                <li><span className="check">✓</span>Edit in your preferred format</li>
                <li><span className="check">✓</span>Automatic validation checks</li>
              </ul>
            </div>

            <div className="method-card">
              <div className="icon">✅</div>
              <h3 id="validation-process">Validation Process</h3>
              <p>All contributions require validation through either:</p>
              <div className="validation-methods">
                <div className="method">
                  <span className="method-icon">📸</span>
                  <span className="method-text">Telemetry Screenshots</span>
                </div>
                <div className="method">
                  <span className="method-icon">🪵</span>
                  <span className="method-text">Official Documentation</span>
                </div>
              </div>
              <div className="note">
                <span className="note-icon">ℹ️</span>
                <p>Private documentation can be shared confidentially with <a href="https://github.com/tsale" target="_blank" rel="noopener noreferrer">Kostas</a></p>
              </div>
            </div>
          </div>

          <section className="contribute-section">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 id="evidence-requirements"><span className="step-icon">🔎</span> Evidence Requirements</h2>
              <p className="text-slate-600 mb-6">
                Status changes need evidence that can be rechecked. A screenshot or documentation link is useful, but disputed direct-test conclusions should also show what was executed, what was searched, and why the final status follows the methodology.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <h3 id="accepted-evidence" className="text-xl font-bold text-emerald-900 mb-3">Accepted evidence</h3>
                  <ul className="space-y-2 text-emerald-800">
                    <li>Official vendor documentation</li>
                    <li>Screenshots of telemetry exposed by the product</li>
                    <li>Log extracts or raw event records</li>
                    <li>Direct hands-on testing results</li>
                    <li>Private documentation shared confidentially for validation</li>
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
                  <h3 id="direct-test-checklist" className="text-xl font-bold text-blue-900 mb-3">Direct-test checklist</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>Test/action executed and UTC execution timestamp</li>
                    <li>Endpoint, OS build, sensor version, and policy/configuration</li>
                    <li>Expected telemetry target and status being requested</li>
                    <li>Query/search used, time window, raw event source, table, or index</li>
                    <li>Observed fields, missing expected fields, screenshot or raw export</li>
                    <li>Rationale for Yes, Partially, Via EventLogs, Via EnablingTelemetry, No, or Pending Response</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-amber-50 border border-amber-100">
                <h3 id="absence-findings-contribution" className="text-xl font-bold text-amber-900 mb-2">For No or absence findings</h3>
                <p className="text-amber-800 mb-0">Document the search window, sources searched, queries or search terms, covered time range, endpoint identifiers examined, and any relevant vendor table or index guidance. Vague claims are not enough to upgrade or downgrade a status.</p>
              </div>
              <Link href="/methodology#evidence-package" className="inline-flex mt-6 text-blue-600 hover:underline font-semibold">
                View the full evidence package standard
              </Link>
            </div>
          </section>

          <section className="contribute-section">
            <h2 id="contribution-steps"><span className="step-icon">🚀</span> Contribution Steps</h2>
            
            <div className="steps-flow">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Fork Repository</h3>
                  <div className="step-description">
                    <p>Create your own copy of the project:</p>
                    <ol className="step-list">
                      <li>Visit main repository</li>
                      <li>Click &quot;Fork&quot; button</li>
                      <li>Select your account</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="step-arrow">↓</div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">Create Branch</h3>
                  <div className="step-description">
                    <p>Make a new branch for your changes</p>
                    <div className="code-snippet">
                      git checkout -b feature-branch-name
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-arrow">↓</div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">Make Changes</h3>
                  <div className="step-description">
                    <p>Use these values in your changes:</p>
                    <div className="values-grid">
                      <div className="value-item">
                        <span className="icon">✅</span>
                        <span className="label">Yes</span>
                        <span className="description">Implemented</span>
                      </div>
                      <div className="value-item">
                        <span className="icon">❌</span>
                        <span className="label">No</span>
                        <span className="description">Not Implemented</span>
                      </div>
                      <div className="value-item">
                        <span className="icon">⚠️</span>
                        <span className="label">Partially</span>
                        <span className="description">Partially Implemented</span>
                      </div>
                      <div className="value-item">
                        <span className="icon">❓</span>
                        <span className="label">Pending</span>
                        <span className="description">Pending Response</span>
                      </div>
                      <div className="value-item">
                        <span className="icon">🪵</span>
                        <span className="label">Via EventLogs</span>
                        <span className="description">Collected from Windows Event Logs</span>
                      </div>
                      <div className="value-item">
                        <span className="icon">🎚️</span>
                        <span className="label">Via EnablingTelemetry</span>
                        <span className="description">Additional telemetry capability</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-arrow">↓</div>

              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3 className="step-title">Submit PR</h3>
                  <div className="step-description">
                    <p>Create a pull request:</p>
                    <ul className="pr-checklist">
                      <li className="checked">Push your changes</li>
                      <li className="checked">Open pull request</li>
                      <li className="checked">Add documentation</li>
                      <li className="checked">Wait for review</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="contribute-section">
            <div className="guidelines-header">
              <h2 id="additional-guidelines"><span className="guidelines-icon">📋</span> Additional Guidelines</h2>
            </div>
            
            <div className="guidelines-content">
              <div className="guidelines-left">
                <div className="card-icon">🐛</div>
                <h3 id="reporting-issues">Reporting Issues</h3>
                <ul className="guidelines-list">
                  <li>Check existing issues</li>
                  <li>Use latest version</li>
                  <li>Clear descriptions</li>
                  <li>Reproduction steps</li>
                </ul>
              </div>

              <div className="guidelines-right">
                <div className="card-icon">💡</div>
                <h3 id="feature-requests">Feature Requests</h3>
                <ul className="guidelines-list">
                  <li>Check existing proposals</li>
                  <li>Clear title</li>
                  <li>Detailed description</li>
                  <li>Use case examples</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="contribute-section cta-section">
            <h2>Ready to Contribute?</h2>
            <p>We welcome contributions of all sizes. Every bit helps improve the project!</p>
            <div className="cta-buttons">
              <a href="https://github.com/tsale/EDR-Telemetry" target="_blank" rel="noopener noreferrer" className="action-button primary-button">Get Started on GitHub</a>
              <Link href="/contact" className="action-button secondary-button">Contact Us</Link>
            </div>
          </section>
        </div>
      </div>
    </TemplatePage>
  )
} 

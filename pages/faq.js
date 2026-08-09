import TemplatePage from '../components/TemplatePage'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, Users, FileText, Lock, MessageCircle } from 'lucide-react'

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedPanel, setExpandedPanel] = useState(null)
  
  const faqData = [
    {
      id: 1,
      question: "What is EDR Telemetry?",
      answer: "EDR telemetry refers to the data collected and transmitted by Endpoint Detection and Response (EDR) products and tools. These products are designed to monitor, detect, and respond to potential threats and suspicious activities on endpoints such as computers, servers, and other devices within a network."
    },
    {
      id: 2,
      question: "What is the purpose of this project?",
      answer: "The EDR Telemetry Project aims to:",
      list: [
        "Compare and evaluate telemetry capabilities across different EDR products",
        "Give practitioners comparable telemetry visibility data for validation and evaluation",
        "Push vendors toward clearer public telemetry documentation",
        "Publish a public reference of EDR telemetry capabilities"
      ]
    },
    {
      id: 3,
      question: "How is the data collected?",
      answer: "The data is collected through:",
      list: [
        "Direct testing in controlled environments",
        "Documentation review from vendors",
        "Community contributions and verification",
        "Continuous updates and validation"
      ]
    },
    {
      id: 4,
      question: "How can I contribute?",
      answer: "You can contribute by:",
      list: [
        "Submitting telemetry data for EDR products",
        "Verifying existing data",
        "Reporting discrepancies or updates",
        "Joining our Discord community"
      ],
      additionalContent: <p>Visit our <Link href="/contribute">Contribution page</Link> for more details.</p>
    },
    {
      id: 5,
      question: "How often is the data updated?",
      answer: "We update results when new evidence lands. Search GitHub pull requests or commits for the product you care about to find the last change date."
    },
    {
      id: 6,
      question: "What do the different symbols mean?",
      answer: "We use the following symbols in our telemetry tables:",
      list: [
        "✅ - Feature is fully implemented",
        "❌ - Feature is not implemented",
        "⚠️ - Feature is partially implemented",
        "❓ - Information is pending or unverified",
        "🪵 - Collected via Windows Event Logs",
        "🎚️ - Available through additional telemetry settings"
      ]
    },
    {
      id: 7,
      question: "Does a higher score mean better protection?",
      answer: "No. Scores reflect telemetry availability and exposed visibility under the project methodology. They do not measure prevention efficacy, detection efficacy, product quality, managed service quality, or SOC maturity.",
      additionalContent: <p>See the <Link href="/methodology">methodology page</Link> for the full scope statement.</p>
    },
    {
      id: 8,
      question: "What counts as valid telemetry?",
      answer: "Valid telemetry must directly represent the tested system action, be automatically collected in real time or near-real time, be exposed to the customer for search or investigation, and be backed by evidence. Live query, manual collection, historical backfill, and backend-only conclusions do not count as scoring telemetry."
    },
    {
      id: 9,
      question: "Why do alerts or detections not count by themselves?",
      answer: "Alerts and correlated signals can be useful, but they are not substitutes for raw or near-raw event records. The project scores the telemetry that analysts can inspect, pivot on, and use for hunting, not only a product conclusion."
    },
    {
      id: 10,
      question: "What does Partially mean?",
      answer: "Partially means some related telemetry exists, but one or more full-credit criteria fail. Common reasons include missing required fields, conditional visibility, limited subset coverage, inconsistent generation, incomplete events, or related-but-not-direct action representation."
    },
    {
      id: 11,
      question: "What evidence is needed to change a status?",
      answer: "A status change needs enough evidence for reviewers to recheck the claim: test or action executed, expected telemetry, observed raw events or documented absence, query or search used, source/table/index, time window, observed and missing fields, screenshot or raw export, and rationale for the requested status.",
      additionalContent: <p>Contribution requirements are summarized on the <Link href="/contribute#evidence-requirements">contribution page</Link>.</p>
    },
    {
      id: 12,
      question: "How are No or absence findings handled?",
      answer: "No or absence findings should document the search window, sources searched, queries or search terms, covered time range, endpoint identifiers, and any relevant vendor table or index guidance consulted. A vague claim that another source exists is not enough without enough detail to perform a targeted recheck."
    },
    {
      id: 13,
      anchor: "transparency-indicators",
      question: "What do the transparency indicators mean?",
      answer: "Transparency indicators show how we validated the telemetry data for each vendor. These icons appear next to vendor names in the telemetry tables and scores page:",
      customContent: (
        <div className="transparency-indicators-list">
          <div className="indicator-item">
            <span className="indicator-icon bg-emerald-100 text-emerald-600">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <strong>Direct Access</strong>
              <p>Validation was performed with direct, independent access to the product. The vendor granted us access to their platform without an NDA and with full permission to publish our findings.</p>
            </div>
          </div>
          <div className="indicator-item">
            <span className="indicator-icon bg-blue-100 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <strong>Community Verified</strong>
              <p>Validation was performed by a verified, independent community member with direct product access. These contributors have confirmed access to the EDR and submitted evidence of telemetry capabilities.</p>
            </div>
          </div>
          <div className="indicator-item">
            <span className="indicator-icon bg-amber-100 text-amber-600">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <strong>Evidence Only</strong>
              <p>Validation was based on evidence provided by the vendor (such as documentation, screenshots, raw logs, or a combination of these), without direct access to the product for independent verification.</p>
            </div>
          </div>
          <div className="indicator-item">
            <span className="indicator-icon bg-purple-100 text-purple-600">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <strong>Conditional Access</strong>
              <p>Validation was performed under an NDA or other terms that may limit what can be disclosed. While we had access to the product, certain restrictions apply to our findings.</p>
            </div>
          </div>
          <div className="indicator-item">
            <span className="indicator-icon bg-sky-100 text-sky-600">
              <MessageCircle className="w-4 h-4" />
            </span>
            <div>
              <strong>Engaged Vendor</strong>
              <p>We have reached out to the vendor or are about to reach out and are awaiting a response regarding access to their platform for independent validation.</p>
            </div>
          </div>
        </div>
      )
    }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const searchLower = searchTerm.toLowerCase()
    return (
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower) ||
      (faq.list && faq.list.some(item => item.toLowerCase().includes(searchLower)))
    )
  })

  const togglePanel = (id) => {
    setExpandedPanel(expandedPanel === id ? null : id)
  }

  return (
    <TemplatePage
      title="FAQ - EDR Telemetry Project"
      description="Answers to common questions about EDR telemetry benchmarking, eligibility, scoring methodology, contributions, and project transparency."
    >
      <div className="hero-section">
        <div className="hero-content">
          <h1>Frequently Asked Questions</h1>
          <p>Common questions about the EDR Telemetry Project and their answers.</p>
        </div>
      </div>
      
      <div className="faq-container">
        <div className="faq-search">
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="faq-search-input"
          />
        </div>

        <div className="faq-accordion">
          {filteredFAQs.map((faq) => (
            <div 
              key={faq.id}
              id={faq.anchor || undefined}
              className={`faq-panel ${expandedPanel === faq.id ? 'expanded' : ''}`}
            >
              <button 
                className="faq-question" 
                onClick={() => togglePanel(faq.id)}
                aria-expanded={expandedPanel === faq.id}
              >
                {faq.question}
                <span className="faq-icon"></span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
                {faq.list && (
                  <ul>
                    {faq.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {faq.customContent}
                {faq.additionalContent}
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="no-results">
            <p>No FAQ entries found matching your search. Try different keywords.</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="contact-us-section">
          <p>More questions? Contact us.</p>
          <div className="contact-button-container">
            <Link href="/contact" className="contact-us-button action-button primary-button view-button">Contact Us</Link>
            <Link href="/support" className="contact-us-button action-button secondary-button view-button">Join Our Community</Link>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 

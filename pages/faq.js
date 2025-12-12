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
        "Help security practitioners make informed decisions about EDR tools",
        "Encourage EDR vendors to be more transparent about their telemetry features",
        "Provide a comprehensive reference for EDR telemetry capabilities"
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
      answer: "The data is updated regularly as new information becomes available. We encourage the community to help keep the information current. You can also search on Github Pull Requests/commits for the EDR you are interested in to find the last updated date."
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
    <TemplatePage title="FAQ - EDR Telemetry Project">
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
          <p>Still have questions? We&apos;re here to help!</p>
          <div className="contact-button-container">
            <Link href="/contact" className="contact-us-button action-button primary-button view-button">Contact Us</Link>
            <Link href="/sponsorship" className="contact-us-button action-button secondary-button view-button">Join Our Community</Link>
          </div>
        </div>
      </div>
    </TemplatePage>
  )
} 

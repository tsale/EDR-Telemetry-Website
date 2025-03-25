import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

// Search result categories with their icons
const CATEGORIES = {
  windows: '🪟',
  linux: '🐧',
  macos: '🍎',
  statistics: '📊',
  scores: '🎯',
  blog: '📝',
  faq: '❓',
  docs: '📚',
  support: '💝',
  premium: '⭐',
  about: 'ℹ️',
  other: '📄'
}

// Default search suggestions
const DEFAULT_SUGGESTIONS = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    category: 'faq',
    url: '/faq',
    excerpt: 'Common questions about EDR telemetry and the project'
  },
  {
    id: 'windows',
    title: 'Windows Telemetry',
    category: 'windows',
    url: '/windows',
    excerpt: 'Windows EDR telemetry capabilities and documentation'
  },
  {
    id: 'premium',
    title: 'Premium Services',
    category: 'premium',
    url: '/premium-services',
    excerpt: 'Professional services and enterprise support'
  },
  {
    id: 'support',
    title: 'Support Us',
    category: 'support',
    url: '/sponsorship',
    excerpt: 'Help support the EDR Telemetry Project'
  }
]

// All searchable content
const SEARCHABLE_CONTENT = [
  {
    id: 'windows',
    title: 'Windows Telemetry',
    category: 'windows',
    url: '/windows',
    excerpt: 'Windows EDR telemetry table',
    keywords: ['windows', 'telemetry', 'process', 'file', 'registry', 'network']
  },
  {
    id: 'linux',
    title: 'Linux Telemetry',
    category: 'linux',
    url: '/linux',
    excerpt: 'Linux EDR telemetry table',
    keywords: ['linux', 'telemetry', 'process', 'file', 'network', 'syscall']
  },
  {
    id: 'macos',
    title: 'macOS Telemetry',
    category: 'macos',
    url: '/macOS',
    excerpt: 'macOS EDR telemetry capabilities and monitoring features',
    keywords: ['macos', 'mac', 'apple', 'telemetry', 'process', 'file']
  },
  {
    id: 'faq',
    title: 'FAQ',
    category: 'faq',
    url: '/faq',
    excerpt: 'Frequently asked questions about EDR telemetry',
    keywords: ['faq', 'help', 'questions', 'answers', 'support']
  },
  {
    id: 'scores',
    title: 'EDR Scores',
    category: 'scores',
    url: '/scores',
    excerpt: 'Scoring and comparison of EDR telemetry capabilities',
    keywords: ['scores', 'comparison', 'ranking', 'evaluation']
  },
  {
    id: 'statistics',
    title: 'Statistics',
    category: 'statistics',
    url: '/statistics',
    excerpt: 'Statistical analysis of EDR telemetry data',
    keywords: ['statistics', 'analysis', 'data', 'metrics']
  },
  {
    id: 'mitre',
    title: 'MITRE Mappings',
    category: 'docs',
    url: '/mitre-mappings',
    excerpt: 'MITRE ATT&CK framework mappings for EDR telemetry',
    keywords: ['mitre', 'att&ck', 'framework', 'mapping', 'tactics']
  },
  {
    id: 'premium',
    title: 'Premium Services',
    category: 'premium',
    url: '/premium-services',
    excerpt: 'Professional services and enterprise support options',
    keywords: ['premium', 'services', 'enterprise', 'support', 'professional']
  },
  {
    id: 'support',
    title: 'Support Us',
    category: 'support',
    url: '/sponsorship',
    excerpt: 'Support the EDR Telemetry Project',
    keywords: ['support', 'sponsor', 'donate', 'contribution']
  },
  {
    id: 'about',
    title: 'About',
    category: 'about',
    url: '/about',
    excerpt: 'About the EDR Telemetry Project and team',
    keywords: ['about', 'team', 'project', 'mission']
  },
  {
    id: 'blog',
    title: 'Blog',
    category: 'blog',
    url: '/blog',
    excerpt: 'Latest updates, articles, and insights',
    keywords: ['blog', 'articles', 'posts', 'news', 'updates']
  },
  {
    id: 'contribute',
    title: 'Contribution Guide',
    category: 'docs',
    url: '/contribute',
    excerpt: 'How to contribute to the EDR Telemetry Project',
    keywords: ['contribute', 'guide', 'development', 'participation']
  },
  {
    id: 'roadmap',
    title: 'Project Roadmap',
    category: 'docs',
    url: '/roadmap',
    excerpt: 'Future plans and development roadmap',
    keywords: ['roadmap', 'future', 'plans', 'development']
  },
  {
    id: 'contact',
    title: 'Contact Us',
    category: 'support',
    url: '/contact',
    excerpt: 'Get in touch with the EDR Telemetry team for support, questions, or collaboration',
    keywords: ['contact', 'support', 'help', 'email', 'reach out', 'get in touch', 'questions']
  },
  {
    id: 'github-issues',
    title: 'GitHub Issues',
    category: 'support',
    url: 'https://github.com/tsale/EDR-Telemetry/issues',
    excerpt: 'Report bugs, request features, or contribute through GitHub issues',
    keywords: ['github', 'issues', 'bugs', 'features', 'contribute', 'report']
  },
  {
    id: 'faq-what-is-edr',
    title: 'What is EDR Telemetry?',
    category: 'faq',
    url: '/faq#what-is-edr',
    excerpt: 'Learn about EDR telemetry, its importance, and how it helps in endpoint detection and response',
    keywords: ['what is edr', 'edr definition', 'telemetry basics', 'endpoint detection', 'monitoring']
  },
  {
    id: 'faq-data-collection',
    title: 'How is EDR Telemetry Data Collected?',
    category: 'faq',
    url: '/faq#data-collection',
    excerpt: 'Understanding how EDR solutions collect and process telemetry data from endpoints',
    keywords: ['data collection', 'telemetry collection', 'endpoint monitoring', 'data gathering']
  },
  {
    id: 'faq-comparison',
    title: 'How to Compare EDR Solutions?',
    category: 'faq',
    url: '/faq#comparison',
    excerpt: 'Guidelines for comparing different EDR solutions based on their telemetry capabilities',
    keywords: ['compare edr', 'edr comparison', 'solution comparison', 'evaluation']
  },
  {
    id: 'stats-overview',
    title: 'EDR Statistics Overview',
    category: 'statistics',
    url: '/statistics#overview',
    excerpt: 'Overview of EDR telemetry statistics across different platforms and vendors',
    keywords: ['statistics', 'overview', 'metrics', 'data analysis', 'comparison']
  },
  {
    id: 'stats-windows-chart',
    title: 'Windows Telemetry Statistics',
    category: 'statistics',
    url: '/statistics#windows-chart',
    excerpt: 'Detailed statistics and charts for Windows EDR telemetry capabilities',
    keywords: ['windows statistics', 'windows chart', 'windows metrics', 'windows comparison']
  },
  {
    id: 'stats-linux-chart',
    title: 'Linux Telemetry Statistics',
    category: 'statistics',
    url: '/statistics#linux-chart',
    excerpt: 'Detailed statistics and charts for Linux EDR telemetry capabilities',
    keywords: ['linux statistics', 'linux chart', 'linux metrics', 'linux comparison']
  },
  {
    id: 'stats-macos-chart',
    title: 'macOS Telemetry Statistics',
    category: 'statistics',
    url: '/statistics#macos-chart',
    excerpt: 'Detailed statistics and charts for macOS EDR telemetry capabilities',
    keywords: ['macos statistics', 'macos chart', 'macos metrics', 'macos comparison']
  },
  {
    id: 'stats-vendor-comparison',
    title: 'Vendor Comparison Charts',
    category: 'statistics',
    url: '/statistics#vendor-comparison',
    excerpt: 'Statistical comparison of EDR vendors and their telemetry capabilities',
    keywords: ['vendor comparison', 'vendor statistics', 'vendor charts', 'solution comparison']
  },
  {
    id: 'stats-telemetry-coverage',
    title: 'Telemetry Coverage Analysis',
    category: 'statistics',
    url: '/statistics#coverage-analysis',
    excerpt: 'Analysis of telemetry coverage across different EDR solutions and platforms',
    keywords: ['coverage analysis', 'telemetry coverage', 'coverage statistics', 'coverage comparison']
  },
  {
    id: 'eligibility-overview',
    title: 'Eligibility Requirements',
    category: 'docs',
    url: '/eligibility',
    excerpt: 'Learn about the eligibility criteria for EDR telemetry evaluation and participation',
    keywords: ['eligibility', 'requirements', 'criteria', 'participation', 'qualify']
  },
  {
    id: 'eligibility-vendor',
    title: 'Vendor Eligibility',
    category: 'docs',
    url: '/eligibility#vendor',
    excerpt: 'Specific requirements and criteria for EDR vendors to participate in the evaluation',
    keywords: ['vendor eligibility', 'vendor requirements', 'vendor criteria', 'edr vendor', 'solution provider']
  },
  {
    id: 'eligibility-product',
    title: 'Product Requirements',
    category: 'docs',
    url: '/eligibility#product',
    excerpt: 'Technical requirements and specifications for EDR products to be evaluated',
    keywords: ['product requirements', 'technical specifications', 'minimum requirements', 'product criteria']
  },
  {
    id: 'eligibility-process',
    title: 'Evaluation Process',
    category: 'docs',
    url: '/eligibility#process',
    excerpt: 'Understanding the evaluation process, timeline, and requirements for participation',
    keywords: ['evaluation process', 'assessment', 'timeline', 'participation process', 'steps']
  },
  {
    id: 'eligibility-submission',
    title: 'Submission Guidelines',
    category: 'docs',
    url: '/eligibility#submission',
    excerpt: 'Guidelines and requirements for submitting your EDR solution for evaluation',
    keywords: ['submission guidelines', 'how to submit', 'application process', 'submission requirements']
  },
  {
    id: 'eligibility-compliance',
    title: 'Compliance Requirements',
    category: 'docs',
    url: '/eligibility#compliance',
    excerpt: 'Compliance and regulatory requirements for EDR evaluation participation',
    keywords: ['compliance', 'regulatory requirements', 'standards', 'regulations', 'certification']
  },
  {
    id: 'eligibility-testing',
    title: 'Testing Environment Requirements',
    category: 'docs',
    url: '/eligibility#testing',
    excerpt: 'Technical requirements for the testing environment and infrastructure',
    keywords: ['testing environment', 'infrastructure requirements', 'test setup', 'environment specifications']
  },
  {
    id: 'eligibility-documentation',
    title: 'Required Documentation',
    category: 'docs',
    url: '/eligibility#documentation',
    excerpt: 'Documentation and materials required for EDR evaluation submission',
    keywords: ['required documentation', 'materials', 'documents', 'submission requirements', 'paperwork']
  },
  {
    id: 'eligibility-support',
    title: 'Support Requirements',
    category: 'docs',
    url: '/eligibility#support',
    excerpt: 'Support and maintenance requirements for participating EDR solutions',
    keywords: ['support requirements', 'maintenance', 'technical support', 'vendor support']
  },
  {
    id: 'eligibility-faq',
    title: 'Eligibility FAQ',
    category: 'faq',
    url: '/eligibility#faq',
    excerpt: 'Frequently asked questions about eligibility and participation requirements',
    keywords: ['eligibility faq', 'common questions', 'eligibility questions', 'participation questions']
  },
  {
    id: 'eligibility-core',
    title: 'Core Requirements',
    category: 'docs',
    url: '/eligibility#core-requirements',
    excerpt: 'Core requirements and fundamental criteria for EDR telemetry evaluation',
    keywords: ['core requirements', 'fundamental criteria', 'basic requirements', 'essential requirements']
  },
  {
    id: 'eligibility-telemetry-comparison',
    title: 'Telemetry vs Inferred Comparison',
    category: 'docs',
    url: '/eligibility#telemetry-vs-inferred-comparison',
    excerpt: 'Understanding the difference between direct telemetry and inferred data collection',
    keywords: ['telemetry comparison', 'inferred data', 'data comparison', 'telemetry vs inferred', 'data collection types']
  },
  {
    id: 'eligibility-data-types',
    title: 'Required Data Types',
    category: 'docs',
    url: '/eligibility#required-data-types',
    excerpt: 'Specific data types required for EDR telemetry evaluation',
    keywords: ['data types', 'required data', 'telemetry types', 'data requirements']
  },
  {
    id: 'eligibility-collection-methods',
    title: 'Collection Methods',
    category: 'docs',
    url: '/eligibility#collection-methods',
    excerpt: 'Approved methods for collecting EDR telemetry data',
    keywords: ['collection methods', 'data collection', 'telemetry collection', 'gathering methods']
  },
  {
    id: 'eligibility-data-format',
    title: 'Data Format Requirements',
    category: 'docs',
    url: '/eligibility#data-format',
    excerpt: 'Required formats and structures for EDR telemetry data submission',
    keywords: ['data format', 'format requirements', 'data structure', 'submission format']
  },
  {
    id: 'eligibility-performance',
    title: 'Performance Requirements',
    category: 'docs',
    url: '/eligibility#performance-requirements',
    excerpt: 'Performance criteria and benchmarks for EDR solutions',
    keywords: ['performance', 'benchmarks', 'criteria', 'performance metrics', 'requirements']
  },
  {
    id: 'eligibility-platform-support',
    title: 'Platform Support',
    category: 'docs',
    url: '/eligibility#platform-support',
    excerpt: 'Required platform support and compatibility requirements',
    keywords: ['platform support', 'compatibility', 'supported platforms', 'operating systems']
  },
  {
    id: 'eligibility-data-quality',
    title: 'Data Quality Standards',
    category: 'docs',
    url: '/eligibility#data-quality',
    excerpt: 'Quality standards and requirements for EDR telemetry data',
    keywords: ['data quality', 'quality standards', 'data requirements', 'quality metrics']
  },
  {
    id: 'eligibility-submission-process',
    title: 'Submission Process',
    category: 'docs',
    url: '/eligibility#submission-process',
    excerpt: 'Step-by-step process for submitting EDR solutions for evaluation',
    keywords: ['submission process', 'how to submit', 'submission steps', 'evaluation process']
  },
  {
    id: 'eligibility-review-criteria',
    title: 'Review Criteria',
    category: 'docs',
    url: '/eligibility#review-criteria',
    excerpt: 'Criteria used to review and evaluate EDR telemetry submissions',
    keywords: ['review criteria', 'evaluation criteria', 'assessment criteria', 'scoring']
  }
]

export default function Search({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const router = useRouter()

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
      // Show default suggestions when opened
      setResults(DEFAULT_SUGGESTIONS)
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selectedResult = results[selectedIndex]
      handleResultClick(selectedResult)
    }
  }

  const handleResultClick = (result) => {
    // Split the URL into base path and hash
    const [basePath, hash] = result.url.split('#')
    
    // If there's a hash, handle the navigation in two steps
    if (hash) {
      // First navigate to the base path
      router.push(basePath).then(() => {
        // After navigation, scroll to the element
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100) // Small delay to ensure the page has rendered
      })
    } else {
      // If no hash, just navigate normally
      router.push(result.url)
    }
    
    onClose()
    setSearchTerm('')
    setResults(DEFAULT_SUGGESTIONS)
  }

  const handleSearch = async (value) => {
    setSearchTerm(value)
    setIsLoading(true)

    try {
      if (!value.trim()) {
        setResults(DEFAULT_SUGGESTIONS)
        return
      }

      const searchTerms = value.toLowerCase().split(' ')
      const searchResults = SEARCHABLE_CONTENT.filter(item => {
        const searchableText = [
          item.title.toLowerCase(),
          item.excerpt.toLowerCase(),
          ...(item.keywords || []).map(k => k.toLowerCase())
        ].join(' ')

        return searchTerms.every(term => searchableText.includes(term))
      })

      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay">
      <div className="search-modal">
        <div className="search-header">
          <input
            ref={searchRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search across all content..."
            className="search-input"
          />
          <button onClick={onClose} className="search-close-btn">
            ✕
          </button>
        </div>

        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <ul className="results-list">
                {results.map((result, index) => (
                  <li 
                    key={result.id}
                    className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleResultClick(result)}
                  >
                    <span className="result-category">
                      {CATEGORIES[result.category] || CATEGORIES.other}
                    </span>
                    <div className="result-content">
                      <h4>{result.title}</h4>
                      <p>{result.excerpt}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {!searchTerm && (
                <div className="search-suggestions">
                  <p>Try searching for platforms, features, documentation, or support</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              No results found for "{searchTerm}"
              <p className="no-results-suggestion">
                Try searching for different terms or browse the suggested content below
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
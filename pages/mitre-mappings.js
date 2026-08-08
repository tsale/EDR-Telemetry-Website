import React, { useState, useEffect } from 'react'
import TemplatePage from '../components/TemplatePage'
import { fetchMitreMappings } from '../lib/mitreMappings'

export async function getStaticProps() {
  try {
    const mappings = await fetchMitreMappings()
    return {
      props: {
        initialMappings: mappings,
        initialError: null,
      },
      revalidate: 86400,
    }
  } catch (err) {
    return {
      props: {
        initialMappings: [],
        initialError: err.message || 'Failed to fetch mappings',
      },
      revalidate: 300,
    }
  }
}

export default function MitreMappings({ initialMappings = [], initialError = null }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [mappings, setMappings] = useState(initialMappings)
  const [loading, setLoading] = useState(initialMappings.length === 0 && !initialError)
  const [error, setError] = useState(initialError)
  const [expandedPanels, setExpandedPanels] = useState(new Set())

  useEffect(() => {
    if (initialMappings.length > 0 || initialError) {
      return
    }

    let cancelled = false

    fetchMitreMappings()
      .then((processedMappings) => {
        if (cancelled) return
        setMappings(processedMappings)
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [initialMappings, initialError])

  const togglePanel = (index) => {
    setExpandedPanels((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const filterMappings = () => {
    if (!searchTerm) return mappings

    return mappings.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.techniques.some(
          (tech) =>
            tech.name.toLowerCase().includes(searchTerm) ||
            (tech.mapping && tech.mapping.toLowerCase().includes(searchTerm))
        )
    )
  }

  const filteredMappings = filterMappings()

  // When search term changes, expand all matching panels
  useEffect(() => {
    if (searchTerm) {
      const matchingPanels = filteredMappings.map((_, index) => index)
      setExpandedPanels(new Set(matchingPanels))
    } else {
      setExpandedPanels(new Set())
    }
    // filteredMappings is derived from mappings + searchTerm; avoid depending on a new array each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, mappings])

  const formatMapping = (mapping) => {
    if (!mapping || mapping === '-') return <span className="no-mapping">No mapping available</span>

    return mapping.split(',').map((m, index) => {
      const [name, ds] = m.trim().split(' - ')
      if (!ds) return <span key={index} className="no-mapping">{name}</span>
      const dsNumber = ds.match(/DS\d+/)?.[0] || ''
      return (
        <span key={index} className="ds-pill">
          {name}
          {dsNumber && <span className="ds-number">{dsNumber}</span>}
        </span>
      )
    })
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  if (loading) {
    return (
      <TemplatePage
        title="MITRE ATT&CK Mappings - EDR Telemetry Project"
        description="Map EDR telemetry feature categories to MITRE ATT&CK data sources for coverage comparison across attack techniques."
      >
        <div className="mitre-container">
          <div className="mitre-header">
            <h1>Loading MITRE ATT&CK® Mappings...</h1>
          </div>
        </div>
      </TemplatePage>
    )
  }

  if (error && mappings.length === 0) {
    return (
      <TemplatePage
        title="MITRE ATT&CK Mappings - EDR Telemetry Project"
        description="Map EDR telemetry feature categories to MITRE ATT&CK data sources for coverage comparison across attack techniques."
      >
        <div className="mitre-container">
          <div className="mitre-header">
            <h1>Error Loading MITRE ATT&CK® Mappings</h1>
            <p>{error}</p>
          </div>
        </div>
      </TemplatePage>
    )
  }

  return (
    <TemplatePage
      title="MITRE ATT&CK Mappings - EDR Telemetry Project"
      description="Map EDR telemetry feature categories to MITRE ATT&CK data sources for coverage comparison across attack techniques."
    >
      <div className="mitre-container">
        <div className="mitre-header">
          <h1>MITRE ATT&CK® Framework Mappings</h1>
          <p>
            Comprehensive mapping of EDR telemetry features to MITRE ATT&CK data sources.
            This page provides detailed coverage information and comparisons across different attack techniques.
          </p>
        </div>

        <div className="mitre-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tactics or techniques..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="filter-icon" title="Filter options">📊</span>
        </div>

        <div className="mitre-grid">
          {filteredMappings.map((category, index) => (
            <div key={index} className={`mitre-card ${!expandedPanels.has(index) ? 'collapsed' : ''}`}>
              <div className="mitre-card-header" onClick={() => togglePanel(index)}>
                <h3>{category.name}</h3>
                <span className="collapse-icon" aria-label={expandedPanels.has(index) ? 'Collapse' : 'Expand'} />
              </div>
              <div className="mitre-card-content">
                <p>{category.description}</p>
                <h4>Techniques:</h4>
                <ul className="mitre-card-list">
                  {category.techniques.map((technique, techIndex) => (
                    <li key={techIndex}>
                      <div className="technique-name">{technique.name}</div>
                      <div className="technique-mappings">
                        {formatMapping(technique.mapping)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {filteredMappings.length === 0 && (
          <div className="empty-state">
            No matching mappings found
          </div>
        )}
      </div>
    </TemplatePage>
  )
}

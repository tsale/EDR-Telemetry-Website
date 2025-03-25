import React from 'react'
import TemplatePage from '../components/TemplatePage'
import { useState, useEffect } from 'react'

export default function MitreMappings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mappings, setMappings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedPanels, setExpandedPanels] = useState(new Set())

  useEffect(() => {
    fetchMitreMappings()
  }, [])

  const togglePanel = (index) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // When search term changes, expand all matching panels
  useEffect(() => {
    if (searchTerm) {
      const matchingPanels = filteredMappings.map((_, index) => index)
      setExpandedPanels(new Set(matchingPanels))
    } else {
      setExpandedPanels(new Set())
    }
  }, [searchTerm])

  const fetchMitreMappings = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/mitre_att%26ck_mappings.json')
      if (!response.ok) throw new Error('Failed to fetch mappings')
      const data = await response.json()
      const processedMappings = processMappings(data)
      setMappings(processedMappings)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const processMappings = (data) => {
    const mappings = {}
    let currentCategory = ''
    
    data.forEach(item => {
      if (item["Telemetry Feature Category"]) {
        currentCategory = item["Telemetry Feature Category"]
        mappings[currentCategory] = {
          name: currentCategory,
          techniques: [],
          description: `Techniques related to ${currentCategory.toLowerCase()}`
        }
      }
      if (currentCategory && item["Sub-Category"]) {
        mappings[currentCategory].techniques.push({
          name: item["Sub-Category"],
          mapping: item["MITRE ATT&CK Mappings"]
        })
      }
    })
    
    return Object.values(mappings)
  }

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

  const filterMappings = () => {
    if (!searchTerm) return mappings
    
    return mappings.filter(category => 
      category.name.toLowerCase().includes(searchTerm) ||
      category.techniques.some(tech => 
        tech.name.toLowerCase().includes(searchTerm) ||
        (tech.mapping && tech.mapping.toLowerCase().includes(searchTerm))
      )
    )
  }

  if (loading) return (
    <TemplatePage title="EDR Telemetry Project - MITRE Mappings">
      <div className="mitre-container">
        <div className="mitre-header">
          <h1>Loading MITRE ATT&CK® Mappings...</h1>
        </div>
      </div>
    </TemplatePage>
  )

  if (error) return (
    <TemplatePage title="EDR Telemetry Project - MITRE Mappings">
      <div className="mitre-container">
        <div className="mitre-header">
          <h1>Error Loading MITRE ATT&CK® Mappings</h1>
          <p>{error}</p>
        </div>
      </div>
    </TemplatePage>
  )

  const filteredMappings = filterMappings()

  return (
    <TemplatePage title="EDR Telemetry Project - MITRE Mappings">
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
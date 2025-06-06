import TemplatePage from '../components/TemplatePage'
import { useState, useEffect } from 'react'
import styles from '../styles/telemetry-categories.module.css'

export default function TelemetryCategories() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Handle view mode transition
  const handleViewChange = (mode) => {
    if (mode === viewMode) return
    setIsTransitioning(true)
    setTimeout(() => {
      setViewMode(mode)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  
  // Telemetry category data
  const categories = [
    {
      id: 'process-execution',
      title: 'Process Execution',
      description: 'Monitors and analyzes process creation and execution across endpoints',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9V5a2 2 0 012-2h4a2 2 0 012 2v4m-6 8v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6-6h8m-8 0v8m0-8V5m8 8v4m0-4V5m0 0h-8" />
        </svg>
      ),
      color: '#00a3e0',
      purpose: 'This category focuses on the telemetry associated with the lifecycle and manipulation of processes on the system. It is foundational for establishing visibility into execution flow, child-parent relationships, and process-based techniques such as injection or tampering.',
      dataCollected: 'Process creation events, process termination, process access, image/library loading, remote thread creation, process tampering activity, and process call stacks.',
      securityBenefits: 'Provides the foundation for execution visibility. Used to map process trees, identify suspicious binaries, track execution lineage, and detect process injection techniques.',
      detectionExamples: 'Malicious process creation, suspicious parent-child relationships, process injection, code execution, and lateral movement techniques.'
    },
    {
      id: 'network-connections',
      title: 'Network Connections',
      description: 'Tracks inbound and outbound network connections from endpoints',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      color: '#4caf50',
      purpose: 'This category tracks outbound and inbound connections, name resolution, and download behavior to establish context around external communication and potential command-and-control.',
      dataCollected: 'TCP connections, UDP connections, URLs accessed, DNS queries, and file downloads from external sources.',
      securityBenefits: 'Allows tracking of command-and-control infrastructure, lateral movement via network connections, and data exfiltration attempts.',
      detectionExamples: 'Malware beaconing, suspicious domain access, data exfiltration, and lateral movement through the network.'
    },
    {
      id: 'file-operations',
      title: 'File Operations',
      description: 'Monitors file creation, modification, and deletion activities',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: '#9c27b0',
      purpose: 'This category tracks file-level interactions which are essential for uncovering persistence mechanisms, staging activity, payload delivery, and destructive actions.',
      dataCollected: 'File creation, file opening, file deletion, file modification, and file renaming events.',
      securityBenefits: 'Identifies artifact creation associated with malware staging, configuration drops, script deployment, and potential evidence wiping.',
      detectionExamples: 'Ransomware file encryption, malicious script creation, configuration file tampering, and data staging for exfiltration.'
    },
    {
      id: 'registry-changes',
      title: 'Registry Changes',
      description: 'Tracks modifications to the Windows registry',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: '#ffc107',
      purpose: 'This category includes telemetry on registry operations that can indicate persistence mechanisms, configuration changes, and attacker tooling setup.',
      dataCollected: 'Registry key/value creation, modification, and deletion events.',
      securityBenefits: 'Supports detection of persistence setup, software installation behavior, and malicious tampering with system configuration.',
      detectionExamples: 'Autorun registry modifications, malware persistence mechanisms, and system configuration tampering.'
    },
    {
      id: 'user-account-activity',
      title: 'User Account Activity',
      description: 'Monitors changes to local user accounts and authentication events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: '#3f51b5',
      purpose: 'This category provides insight into changes to local user accounts and authentication events. Useful for privilege escalation, persistence, and lateral movement tracking.',
      dataCollected: 'Local account creation, modification, deletion, login events, and logoff events.',
      securityBenefits: 'Identifies unauthorized access setup, privilege escalation attempts, and suspicious authentication patterns.',
      detectionExamples: 'Creation of rogue accounts, privilege escalation through group membership changes, and anomalous login activity.'
    },
    {
      id: 'hash-algorithms',
      title: 'Hash Algorithms',
      description: 'Fingerprinting of files or memory regions using hashing algorithms',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: '#607d8b',
      purpose: 'This category focuses on the fingerprinting of files or memory regions using hashing algorithms to allow deduplication, integrity checks, and malware correlation.',
      dataCollected: 'MD5, SHA1, SHA256, and IMPHASH values of files and memory regions.',
      securityBenefits: 'Enables matching against known threat indicators and helps identify malware families through import table similarity.',
      detectionExamples: 'Identification of known malicious files, grouping of malware variants, and integrity verification of system files.'
    },
    {
      id: 'scheduled-task-activity',
      title: 'Scheduled Task Activity',
      description: 'Monitors creation and modification of scheduled tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#ff5722',
      purpose: 'This category captures telemetry related to scheduled tasks, a common persistence and execution mechanism.',
      dataCollected: 'Scheduled task creation, modification, and deletion events.',
      securityBenefits: 'Provides insight into persistence mechanisms and automated execution setups.',
      detectionExamples: 'Malware establishing persistence through scheduled tasks, tampering with existing tasks, and cleanup activities.'
    },
    {
      id: 'service-activity',
      title: 'Service Activity',
      description: 'Tracks Windows service changes for persistence or execution',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      color: '#795548',
      purpose: 'This category tracks Windows service changes that are often used for persistence or execution.',
      dataCollected: 'Service creation, modification, and deletion events.',
      securityBenefits: 'Useful for tracking persistent system-level execution points and detecting malicious service configurations.',
      detectionExamples: 'Malware installing backdoor services, modifying legitimate services for malicious purposes, and service-based persistence mechanisms.'
    },
    {
      id: 'driver-module-activity',
      title: 'Driver/Module Activity',
      description: 'Monitors kernel-level drivers and modules',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: '#009688',
      purpose: 'This category monitors kernel-level drivers and modules that may affect the stability, security, or integrity of the system.',
      dataCollected: 'Driver loading, modification, and unloading events.',
      securityBenefits: 'Key for rootkit detection and monitoring signed/unsigned driver behavior.',
      detectionExamples: 'Rootkit installation, kernel-level exploits, and driver tampering for persistence or privilege escalation.'
    },
    {
      id: 'device-operations',
      title: 'Device Operations',
      description: 'Tracks physical and virtual device activities',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: '#e91e63',
      purpose: 'This category provides telemetry related to physical and virtual devices, especially removable or mountable media.',
      dataCollected: 'Virtual disk mount events, USB device mount and unmount events.',
      securityBenefits: 'Monitors for data exfiltration, unauthorized device usage, and staging behavior.',
      detectionExamples: 'Data exfiltration via USB devices, malware delivery through removable media, and use of virtual disks for hiding malicious content.'
    },
    {
      id: 'named-pipe-activity',
      title: 'Named Pipe Activity',
      description: 'Monitors inter-process communication channels',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: '#673ab7',
      purpose: 'Named pipes are a common method for inter-process communication (IPC) and are often used in lateral movement and evasion.',
      dataCollected: 'Pipe creation and connection events.',
      securityBenefits: 'Helps identify malicious IPC channels, staging behavior, and post-exploitation frameworks.',
      detectionExamples: 'Malware command and control channels, lateral movement techniques, and post-exploitation activity.'
    },
    {
      id: 'edr-sysops',
      title: 'EDR SysOps',
      description: 'Tracks EDR agent lifecycle and health',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: '#2196f3',
      purpose: 'This category includes operational telemetry from the EDR agent itself to track its lifecycle and health.',
      dataCollected: 'Agent start, stop, install, uninstall, keep-alive, and error events.',
      securityBenefits: 'Critical for detecting tampering or evasion attempts and ensuring continuous protection.',
      detectionExamples: 'EDR tampering, agent disabling, and security control evasion techniques.'
    },
    {
      id: 'wmi-activity',
      title: 'WMI Activity',
      description: 'Monitors Windows Management Instrumentation activity',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: '#ff9800',
      purpose: 'This category focuses on Windows Management Instrumentation activity, which is often abused for persistence, execution, and reconnaissance.',
      dataCollected: 'WMI event consumer to filter binding, event consumer creation/modification, and event filter creation/modification.',
      securityBenefits: 'Crucial for understanding execution triggers and persistence setup through WMI.',
      detectionExamples: 'Fileless malware persistence, WMI-based lateral movement, and stealthy execution techniques.'
    },
    {
      id: 'bits-jobs-activity',
      title: 'BITS Jobs Activity',
      description: 'Tracks Background Intelligent Transfer Service operations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: '#8bc34a',
      purpose: 'This category covers telemetry related to Background Intelligent Transfer Service (BITS), a mechanism sometimes used by attackers for stealthy downloads or task scheduling.',
      dataCollected: 'BITS job creation, update, and execution events.',
      securityBenefits: 'Helps detect covert tasking and stealthy download operations.',
      detectionExamples: 'Malware using BITS for stealthy downloads, persistence through BITS jobs, and covert command and control channels.'
    },
    {
      id: 'powershell-activity',
      title: 'PowerShell Activity',
      description: 'Monitors PowerShell script execution',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: '#03a9f4',
      purpose: 'This category provides visibility into PowerShell script execution, an essential component of modern threat actor toolkits.',
      dataCollected: 'PowerShell script-block activity, including raw script content and metadata.',
      securityBenefits: 'Provides deep inspection capability of executed scripts, even those that are obfuscated or multi-stage.',
      detectionExamples: 'Fileless malware, obfuscated PowerShell attacks, credential theft scripts, and post-exploitation frameworks.'
    },
    {
      id: 'group-policy-modification',
      title: 'Group Policy Modification',
      description: 'Tracks changes to group policy objects or local policy settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: '#cddc39',
      purpose: 'This event offers supplementary visibility into critical system-level changes or access points.',
      dataCollected: 'Changes made to group policy objects or local policy settings.',
      securityBenefits: 'Important for tracking unauthorized configuration changes or policy abuse.',
      detectionExamples: 'Security policy weakening, privilege escalation through policy changes, and enterprise-wide malicious configuration deployment.'
    }
  ];
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    return (
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.purpose.toLowerCase().includes(query) ||
      category.dataCollected.toLowerCase().includes(query) ||
      category.securityBenefits.toLowerCase().includes(query) ||
      category.detectionExamples.toLowerCase().includes(query)
    )
  })
  
  // Highlight search matches in text
  const highlightMatch = (text, query) => {
    if (!query.trim() || !text) return text
    
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    
    return (
      <>
        {parts.map((part, index) => {
          const isMatch = part.toLowerCase() === query.toLowerCase()
          return isMatch ?
            <span key={index} className={styles.highlight}>{part}</span> :
            <span key={index}>{part}</span>
        })}
      </>
    )
  }
  
  return (
    <TemplatePage title="EDR Telemetry Categories - EDR Telemetry Project"
      description="Understanding the different types of endpoint data collected for threat detection">
      
      <div className={styles.container}>
        {/* Header */}
        <div className="text-center">
          <h1
            className={styles['page-title']}
            id="telemetry-categories-heading"
            aria-label="EDR Telemetry Categories"
          >
            EDR Telemetry Categories
          </h1>
          <p className={styles['page-subtitle']}>Understanding the different types of endpoint data collected for threat detection</p>
        </div>
        
        {/* View toggle */}
        <div className={styles['view-controls']}>
          <div className={styles['view-toggle']}>
            <button
              onClick={() => handleViewChange('grid')}
              className={`${styles['view-button']} ${viewMode === 'grid' ? styles.active : ''}`}
              aria-label="Switch to grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Grid View
            </button>
            <button
              onClick={() => handleViewChange('list')}
              className={`${styles['view-button']} ${viewMode === 'list' ? styles.active : ''}`}
              aria-label="Switch to list view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              List View
            </button>
          </div>
        </div>
        
              {/* Search bar - moved below content for subtlety */}
              <div className={styles['search-container-subtle']}>
          <div className={styles['search-wrapper-subtle']}>
            <svg className={styles['search-icon']} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className={styles['search-input-subtle']}
              placeholder="Filter telemetry categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Filter telemetry categories"
            />
            {searchQuery && (
              <button
                className={styles['search-clear']}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Categories */}
        <div
          className={`${viewMode === 'grid' ? styles['grid-view'] : styles['list-view']} ${isTransitioning ? styles['fade-transition'] : ''}`}
          aria-live="polite"
        >
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
            <div key={category.id} className={`${styles.card} ${styles['card-animation']}`} style={{'--animation-order': index}}>
              <div className={styles['card-contents']}>
                <div className={styles['icon-container']}>
                  <div className={styles['icon-box']} style={{color: category.color, background: `linear-gradient(135deg, ${category.color}1a 0%, ${category.color}0d 100%)`}}>
                    {category.icon}
                  </div>
                </div>
                
                <div className={styles['card-info']}>
                  <h3>{searchQuery ? highlightMatch(category.title, searchQuery) : category.title}</h3>
                  <p>{searchQuery ? highlightMatch(category.description, searchQuery) : category.description}</p>
                </div>
                
              </div>
              
              <div className={styles.accordion}>
                <details className={styles['accordion-item']}>
                  <summary className={styles['accordion-header']}>
                    <span className={styles['accordion-header-text']}>
                      <svg className={styles['chevron-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                      Purpose
                    </span>
                  </summary>
                  <div className={styles['accordion-content']}>
                    <p>{searchQuery ? highlightMatch(category.purpose, searchQuery) : category.purpose}</p>
                  </div>
                </details>
                
                <details className={styles['accordion-item']}>
                  <summary className={styles['accordion-header']}>
                    <span className={styles['accordion-header-text']}>
                      <svg className={styles['chevron-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                      Data Collected
                    </span>
                  </summary>
                  <div className={styles['accordion-content']}>
                    <p>{searchQuery ? highlightMatch(category.dataCollected, searchQuery) : category.dataCollected}</p>
                  </div>
                </details>
                
                <details className={styles['accordion-item']}>
                  <summary className={styles['accordion-header']}>
                    <span className={styles['accordion-header-text']}>
                      <svg className={styles['chevron-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                      Security Benefits
                    </span>
                  </summary>
                  <div className={styles['accordion-content']}>
                    <p>{searchQuery ? highlightMatch(category.securityBenefits, searchQuery) : category.securityBenefits}</p>
                  </div>
                </details>
                
                <details className={styles['accordion-item']}>
                  <summary className={styles['accordion-header']}>
                    <span className={styles['accordion-header-text']}>
                      <svg className={styles['chevron-icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                      Detection Examples
                    </span>
                  </summary>
                  <div className={styles['accordion-content']}>
                    <p>{searchQuery ? highlightMatch(category.detectionExamples, searchQuery) : category.detectionExamples}</p>
                  </div>
                </details>
              </div>
            </div>
            ))
          ) : (
            <div className={styles['no-results']}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <h3>No matching categories found</h3>
              <p>Try adjusting your search query or browse all categories by clearing the search.</p>
              <button
                className={styles['clear-search-button']}
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </TemplatePage>
  )
}
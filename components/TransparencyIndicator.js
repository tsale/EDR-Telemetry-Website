import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Users, FileText, Lock, ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'

// Map indicator keys to display info
const INDICATOR_CONFIG = {
  direct_access: {
    icon: Eye,
    label: 'Direct Access',
    tooltip: 'Validation was performed with direct, independent access to the product.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  community_verified: {
    icon: Users,
    label: 'Community Verified',
    tooltip: 'Validation was performed by a verified, independent community member with direct product access.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  evidence_only: {
    icon: FileText,
    label: 'Evidence Only',
    tooltip: 'Validation was based on evidence provided by the vendor, without direct access.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  conditional_access: {
    icon: Lock,
    label: 'Conditional Access',
    tooltip: 'Validation was performed under an NDA or other terms.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  engaged_vendor: {
    icon: MessageCircle,
    label: 'Engaged Vendor',
    tooltip: 'We have reached out to the vendor or are about to reach out and are awaiting a response regarding access.',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
  },
}

export default function TransparencyIndicator({
  indicators = [],
  transparencyNote = '',
  vendorName = '',
  showLabel = false,
  className = ''
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false)
  const triggerRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  // Track if component is mounted (for portal)
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  // Update tooltip position when showing
  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top - 8, // Position above the trigger with some spacing
        left: rect.left + rect.width / 2 // Center horizontally
      })
    }
  }, [showTooltip])

  // Handle delayed hide (allows moving mouse to tooltip)
  const handleMouseEnterTrigger = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    setShowTooltip(true)
  }

  const handleMouseLeaveTrigger = () => {
    hideTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTooltip) {
        setShowTooltip(false)
      }
    }, 150) // Small delay to allow moving to tooltip
  }

  const handleMouseEnterTooltip = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    setIsHoveringTooltip(true)
  }

  const handleMouseLeaveTooltip = () => {
    setIsHoveringTooltip(false)
    setShowTooltip(false)
  }

  // If no indicators, don't render anything
  if (!indicators || indicators.length === 0) {
    return null
  }

  // Tooltip content component
  const TooltipContent = () => (
    <div
      className="fixed"
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        transform: 'translate(-50%, -100%)',
        zIndex: 99999
      }}
      onMouseEnter={handleMouseEnterTooltip}
      onMouseLeave={handleMouseLeaveTooltip}
    >
      <div className="bg-slate-900 text-white text-xs rounded-lg py-3 px-4 shadow-2xl border border-slate-700"
        style={{ maxWidth: '320px', minWidth: '200px' }}>
        <div className="font-bold text-sm mb-2 text-white">{vendorName} Transparency</div>
        {indicators.map((indicator, idx) => {
          const config = INDICATOR_CONFIG[indicator]
          if (!config) return null
          return (
            <div key={idx} className="mb-2 last:mb-0">
              <span className="font-semibold text-slate-200">{config.label}:</span>{' '}
              <span className="text-slate-300">{config.tooltip}</span>
            </div>
          )
        })}
        {transparencyNote && (
          <div className="mt-3 pt-2 border-t border-slate-600 text-slate-300 italic text-xs leading-relaxed">
            {transparencyNote}
          </div>
        )}
        <div className="mt-3 pt-2 border-t border-slate-600">
          <Link
            href="/faq#transparency-indicators"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium"
          >
            Learn more about transparency indicators
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
      {/* Arrow pointing down */}
      <div className="flex justify-center -mt-px">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900"></div>
      </div>
    </div>
  )

  return (
    <div
      ref={triggerRef}
      className={`inline-flex items-center gap-1 cursor-help ${className}`}
      onMouseEnter={handleMouseEnterTrigger}
      onMouseLeave={handleMouseLeaveTrigger}
      onClick={() => setShowTooltip(prev => !prev)}
    >
      {indicators.map((indicator, idx) => {
        const config = INDICATOR_CONFIG[indicator]
        if (!config) return null

        const IconComponent = config.icon
        return (
          <div key={idx} className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${config.bgColor} ${config.color} transition-transform hover:scale-110`}
            >
              <IconComponent className="w-3 h-3" />
            </span>
            {showLabel && (
              <div className="flex flex-col items-start leading-none">
                <span className="hidden sm:inline text-sm text-slate-600 font-medium whitespace-nowrap border-b border-dotted border-slate-400 group-hover:border-slate-600 transition-colors">
                  {config.label}
                </span>
                <span className="sm:hidden text-sm text-slate-700 font-medium">
                  {config.label} <span className="text-xs text-blue-500 font-normal ml-1">(Tap for details)</span>
                </span>
              </div>
            )}
          </div>
        )
      })}

      {/* Portal tooltip - renders at document body level to escape overflow containers */}
      {showTooltip && isMounted && typeof document !== 'undefined' &&
        createPortal(<TooltipContent />, document.body)
      }
    </div>
  )
}

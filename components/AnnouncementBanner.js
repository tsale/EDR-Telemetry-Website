import { useState, useEffect } from 'react'

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const STORAGE_KEY = 'edr-comparison-announcement-dismissed'

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(STORAGE_KEY)
    if (!isDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="announcement-banner" role="banner" aria-label="Site announcement">
      <div className="announcement-content">
        <span className="announcement-text">
          <strong>New:</strong> The EDR Feature Comparison platform is now live →{' '}
          <a
            href="https://edr-comparison.com"
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-link"
          >
            edr-comparison.com
          </a>
        </span>
        <button
          onClick={handleDismiss}
          className="announcement-close"
          aria-label="Dismiss announcement"
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

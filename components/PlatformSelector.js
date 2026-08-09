import { Fragment } from 'react'
import { LinuxLogo, MacosLogo, WindowsLogo } from './PlatformOsIcons'

const PLATFORMS = [
  {
    id: 'windows',
    label: 'Windows',
    icon: WindowsLogo,
    activeClass: '!bg-blue-600 !text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-600',
    ariaLabel: 'Show Windows content',
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: LinuxLogo,
    activeClass: '!bg-orange-500 !text-white shadow-md shadow-orange-500/25 ring-1 ring-orange-500',
    ariaLabel: 'Show Linux content',
  },
  {
    id: 'macos',
    label: 'macOS',
    icon: MacosLogo,
    activeClass: '!bg-purple-600 !text-white shadow-md shadow-purple-600/25 ring-1 ring-purple-600',
    ariaLabel: 'Show macOS content',
  },
]

export default function PlatformSelector({ value, onChange, className = '' }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div
        role="tablist"
        aria-label="Select platform"
        className="inline-flex w-full max-w-lg sm:max-w-none sm:w-auto items-center rounded-2xl bg-white/90 p-2 sm:p-2.5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur-sm"
      >
        {PLATFORMS.map((platform, index) => {
          const Icon = platform.icon
          const isActive = value === platform.id

          return (
            <Fragment key={platform.id}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-1.5 sm:mx-2.5 h-8 w-px shrink-0 bg-gradient-to-b from-transparent via-slate-300/90 to-transparent"
                />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={platform.ariaLabel}
                onClick={() => onChange(platform.id)}
                className={[
                  'inline-flex min-h-[48px] min-w-0 flex-1 sm:flex-none items-center justify-center gap-2.5 sm:gap-3 rounded-xl px-4 sm:px-8 py-3 text-sm sm:text-base font-semibold transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                  isActive
                    ? platform.activeClass
                    : '!text-slate-600 hover:!bg-slate-50 hover:!text-slate-900 active:!bg-slate-100',
                ].join(' ')}
              >
                <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem] shrink-0" />
                <span className="truncate">{platform.label}</span>
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

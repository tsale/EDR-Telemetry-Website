import GitHubButton from 'react-github-btn'

export default function GitHubStarButton() {
  return (
    <div className="flex items-center shrink-0 h-7">
      <GitHubButton
        href="https://github.com/tsale/edr-telemetry"
        data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-icon="octicon-star"
        data-size="large"
        data-show-count="true"
        aria-label="Star tsale/edr-telemetry on GitHub"
      >
        Star
      </GitHubButton>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Github, Star } from 'lucide-react'

const repositoryUrl = 'https://github.com/tsale/edr-telemetry'

export default function GitHubStarButton() {
  const [starCount, setStarCount] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    fetch('https://api.github.com/repos/tsale/edr-telemetry', {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load star count')
        return response.json()
      })
      .then((data) => {
        if (Number.isInteger(data.stargazers_count) && data.stargazers_count >= 0) {
          setStarCount(data.stargazers_count)
        }
      })
      .catch(() => {}) // Keep the Star link available if GitHub is unavailable.
      .finally(() => clearTimeout(timeout))

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return (
    <div className="inline-flex items-center shrink-0 h-7 text-xs font-semibold">
      <a
        href={repositoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex h-7 items-center gap-1.5 border border-slate-300 bg-slate-50 px-2.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 ${starCount === null ? 'rounded' : 'rounded-l'}`}
        aria-label="Star tsale/edr-telemetry on GitHub"
      >
        <Github className="h-4 w-4" aria-hidden="true" />
        <Star className="h-4 w-4 fill-white text-yellow-500" aria-hidden="true" />
        Star
      </a>
      {starCount !== null && (
        <a
          href={`${repositoryUrl}/stargazers`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center rounded-r border border-l-0 border-slate-300 bg-white px-2.5 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
          aria-label={`${starCount.toLocaleString('en-US')} stargazers on GitHub`}
        >
          {starCount.toLocaleString('en-US')}
        </a>
      )}
    </div>
  )
}

export function isVercelObservabilityEnabled() {
  const explicitFlag = process.env.NEXT_PUBLIC_ENABLE_VERCEL_OBSERVABILITY

  if (explicitFlag === 'true') {
    return true
  }

  if (explicitFlag === 'false') {
    return false
  }

  return process.env.NODE_ENV === 'production'
}

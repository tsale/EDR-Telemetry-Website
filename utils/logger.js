export const logger = {
  info(message, context = {}) {
    const payload = {
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString()
    }
    console.log(JSON.stringify(payload))
  },
  error(message, context = {}) {
    const safeContext = { ...context }
    if (safeContext.err instanceof Error) {
      safeContext.err = {
        name: safeContext.err.name,
        message: safeContext.err.message
      }
    }
    const payload = {
      level: 'error',
      message,
      context: safeContext,
      timestamp: new Date().toISOString()
    }
    console.error(JSON.stringify(payload))
  }
}

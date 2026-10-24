export async function register() {
  // Skip during `next build`: build containers don't have runtime secrets.
  if (
    process.env.NEXT_RUNTIME !== 'nodejs' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    return
  }
  const { validateEnv } = await import('./env')
  validateEnv()
}

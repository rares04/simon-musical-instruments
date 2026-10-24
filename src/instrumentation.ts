import type { Instrumentation } from 'next'

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

/** Every uncaught server error (pages, route handlers, server actions) goes to error tracking. */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { captureError } = await import('./lib/observability/errors')
  const { requestIdFrom } = await import('./lib/observability/logger')
  const { scrubUrl } = await import('./lib/observability/scrub')
  captureError(error, {
    source: 'request',
    route: context.routePath,
    route_type: context.routeType,
    method: request.method,
    path: scrubUrl(request.path),
    request_id: requestIdFrom(request.headers),
  })
}

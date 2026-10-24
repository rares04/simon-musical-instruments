import { logger } from './logger'
import { scrubError } from './scrub'
import { appContext, getServerPostHog } from './server-posthog'

export type ErrorContext = {
  /** Where it happened: a request, a background job, an email send, … */
  source: 'request' | 'job' | 'email' | 'other'
  /** Background job name, e.g. `holds_sweep`. */
  job?: string
  route?: string
  request_id?: string
  [key: string]: string | number | boolean | undefined
}

/**
 * Where errors go. PostHog error tracking today; a Sentry sink can be added here without
 * touching call sites. `ERROR_TRACKER=none` turns reporting off (logs still happen).
 */
type ErrorSink = (error: Error, context: ErrorContext) => void

const posthogSink: ErrorSink = (error, context) => {
  getServerPostHog()?.captureException(error, 'server', {
    ...context,
    ...appContext(),
    $process_person_profile: false,
  })
}

function currentSink(): ErrorSink | null {
  switch (process.env.ERROR_TRACKER ?? 'posthog') {
    case 'none':
      return null
    default:
      return posthogSink
  }
}

/**
 * Reports an error: one scrubbed JSON log line, plus an error-tracking event (which alerts).
 * Never throws. The message and stack are scrubbed first, because database and email-provider
 * errors can contain customer data.
 */
export function captureError(error: unknown, context: ErrorContext): void {
  const safe = scrubError(error)
  logger.error(context.job ? `${context.job}: failed` : 'error', { ...context, err: safe })
  try {
    currentSink()?.(safe, context)
  } catch (sinkError) {
    logger.warn('error tracker: capture failed', { err: sinkError })
  }
}

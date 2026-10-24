import { logger } from './logger'
import { appContext, getServerPostHog } from './server-posthog'

/**
 * Server-side business events. The source of truth for counts and alerting; see the tracking
 * plan in docs/observability/. Properties must never contain personal data: order numbers and
 * instrument IDs are fine; emails, names and addresses are not (they're stripped anyway).
 */
export type ServerEvents = {
  reservation_created: {
    order_number: string
    item_count: number
    total_eur: number
    delivery_method: 'delivery' | 'pickup'
  }
  reservation_rejected: { reason: string }
  reservation_hold_expired: { order_number: string; item_count: number; age_hours: number }
  instruments_released: {
    order_number: string
    instrument_count: number
    cause: 'expired' | 'cancelled'
  }
  email_sent: { template: EmailTemplate; resend_id: string }
  email_failed: { template: EmailTemplate; error_name: string }
  inquiry_received: { inquiry_type: string }
}

export type EmailTemplate =
  | 'reservation_customer'
  | 'reservation_paul'
  | 'shipping'
  | 'contact'
  | 'otp'
  | 'unknown'

/** Records a business event: one JSON log line, plus a PostHog event when analytics is on. */
export function trackServerEvent<E extends keyof ServerEvents>(
  event: E,
  properties: ServerEvents[E],
): void {
  logger.info(event, { event, ...properties })
  try {
    getServerPostHog()?.capture({
      distinctId: 'server',
      event,
      properties: { ...properties, ...appContext(), $process_person_profile: false },
    })
  } catch (error) {
    logger.warn('analytics: capture failed', { event, err: error })
  }
}

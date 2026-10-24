import posthog from 'posthog-js'

/**
 * Browser events from the tracking plan (docs/observability/). Never pass personal data: no
 * emails, names, phone numbers or free text. `before_send` strips them anyway.
 */
export type ClientEvents = {
  instrument_viewed: {
    instrument_id: string
    instrument_type: string
    price_eur: number | null
    price_on_request: boolean
  }
  gallery_filtered: { instrument_type?: string; price_band?: string }
  cart_item_added: { instrument_id: string; instrument_type: string; price_eur: number | null }
  checkout_started: { item_count: number; total_eur: number }
  reservation_completed: {
    item_count: number
    total_eur: number
    delivery_method: 'delivery' | 'pickup'
  }
  reservation_failed: { http_status: number; reason: string }
  price_request_clicked: { instrument_id: string; instrument_type: string }
  contact_clicked: {
    channel: 'email' | 'phone' | 'whatsapp' | 'instagram'
    placement: 'footer' | 'checkout' | 'success' | 'contact' | 'product'
  }
  inquiry_submitted: { inquiry_type: string }
  inquiry_failed: { http_status: number }
  account_created: { method: 'email' | 'google' }
  signed_in: { method: 'email' | 'google' }
}

/** Sends a browser event. A no-op when analytics isn't initialised (no key, or `/admin`). */
export function trackEvent<E extends keyof ClientEvents>(
  event: E,
  properties: ClientEvents[E],
): void {
  if (!posthog.__loaded) return
  posthog.capture(event, properties)
}

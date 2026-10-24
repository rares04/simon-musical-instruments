import type { CaptureResult, PostHogConfig } from 'posthog-js'
import { scrubProperties, scrubUrl } from './scrub'

const LOCALES = new Set(['en', 'ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'])

/** Pages where autocapture is off entirely: forms there hold the visitor's details. */
export const AUTOCAPTURE_IGNORED = [/\/(account|checkout|login|register|verify-email)(\/|\?|#|$)/]

/**
 * Element attributes autocapture never records. The header avatar's `alt` is the signed-in
 * user's name and its `src` is their Google photo URL.
 */
export const DROPPED_ELEMENT_ATTRIBUTES = [
  'alt',
  'title',
  'src',
  'srcset',
  'aria-label',
  'placeholder',
  'value',
  'name',
]

const DROPPED_CHAIN_ATTR_RE = new RegExp(
  `(?:attr__)?(?:${DROPPED_ELEMENT_ATTRIBUTES.join('|')}|text)="(?:[^"\\\\]|\\\\.)*"`,
  'g',
)
const CHAIN_HREF_RE = /((?:attr__)?href=")((?:[^"\\]|\\.)*)(")/g

/** Removes personal attributes and element text from `$elements_chain`, and scrubs link URLs. */
export function sanitizeElementsChain(chain: string): string {
  return chain
    .replace(DROPPED_CHAIN_ATTR_RE, '')
    .replace(CHAIN_HREF_RE, (_match, open: string, href: string, close: string) => {
      return `${open}${scrubUrl(href)}${close}`
    })
}

function sanitizeElement(element: unknown): unknown {
  if (!element || typeof element !== 'object') return element
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(element as Record<string, unknown>)) {
    const attribute = key.replace(/^attr__/, '')
    if (key === '$el_text' || DROPPED_ELEMENT_ATTRIBUTES.includes(attribute)) continue
    out[key] = key === 'attr__href' && typeof value === 'string' ? scrubUrl(value) : value
  }
  return out
}

export function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

function pathOf(url: unknown): string {
  if (typeof url !== 'string') return ''
  try {
    return new URL(url, 'http://relative.invalid').pathname
  } catch {
    return ''
  }
}

/**
 * `before_send` for posthog-js. Drops `/admin` events, strips personal data and non-campaign
 * query parameters from every property (including `$set` / `$set_once`), and tags each event
 * with the page locale and the app environment.
 */
export function sanitizeClientEvent(
  event: CaptureResult | null,
  context: { appEnv: string; appVersion: string },
): CaptureResult | null {
  if (!event) return null
  const properties = event.properties ?? {}
  const pathname = pathOf(properties.$current_url)
  if (isAdminPath(pathname)) return null

  const cleaned = scrubProperties(properties)
  if (typeof cleaned.$elements_chain === 'string') {
    cleaned.$elements_chain = sanitizeElementsChain(cleaned.$elements_chain)
  }
  if (Array.isArray(cleaned.$elements)) cleaned.$elements = cleaned.$elements.map(sanitizeElement)
  const segment = pathname.split('/')[1] ?? ''
  if (LOCALES.has(segment)) cleaned.locale = segment
  cleaned.app_env = context.appEnv
  cleaned.app_version = context.appVersion

  return {
    ...event,
    properties: cleaned,
    $set: event.$set ? scrubProperties(event.$set) : event.$set,
    $set_once: event.$set_once ? scrubProperties(event.$set_once) : event.$set_once,
  }
}

/**
 * posthog-js settings. Nothing is stored in the browser (`persistence: 'memory'`), session replay
 * and surveys are off, and visitors are never identified. See docs/observability/.
 */
export function clientConfig(context: {
  apiHost: string
  appEnv: string
  appVersion: string
}): Partial<PostHogConfig> {
  return {
    api_host: context.apiHost,
    ui_host: 'https://eu.posthog.com',
    persistence: 'memory',
    person_profiles: 'identified_only',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    autocapture: {
      url_ignorelist: AUTOCAPTURE_IGNORED,
      element_attribute_ignorelist: DROPPED_ELEMENT_ATTRIBUTES,
    },
    // Clicked text can be a signed-in user's name. Custom events carry the details we need.
    mask_all_text: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true, network_timing: false },
    capture_dead_clicks: false,
    capture_heatmaps: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_web_experiments: true,
    disable_product_tours: true,
    disable_conversations: true,
    advanced_disable_flags: true,
    // Our own scrubbing keeps gclid & co. for ads attribution; PostHog's built-in masking would not.
    mask_personal_data_properties: false,
    before_send: (event) => sanitizeClientEvent(event, context),
  }
}

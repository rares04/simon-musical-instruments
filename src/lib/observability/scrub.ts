/**
 * Removes personal data from anything we send to logs or analytics.
 * Runs in the browser and on the server, so it must stay dependency-free.
 */

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
// 9+ digits with optional separators: phone numbers, IBANs, card-like numbers.
const LONG_NUMBER_RE = /\+?\d(?:[\s().-]*\d){8,}/g
// Drizzle puts the query parameters (customer data) after "params:", on one line. Stop at the line
// end so a stack trace that follows survives.
const QUERY_PARAMS_RE = /\bparams:[^\n]*/gi

/** Query parameters kept on URLs: campaign attribution only. Everything else is dropped. */
const KEPT_QUERY_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
])

/** Property keys whose values are never sent, whatever they contain. */
const SECRET_KEY_RE =
  /(e-?mail|password|passwd|token|secret|otp|authorization|cookie|phone|address|street|postcode|zip|iban|card)/i
// `name`, `customerName`, `first_name`, …, but not `error_name` or `template_name`.
const PERSON_NAME_KEY_RE =
  /^(customer|first|last|full|user|contact|billing|shipping|recipient)?_?name$/i
const PERSONAL_KEYS = new Set(['message', 'notes', 'customernotes'])
/** PostHog routing fields: `token` is the public project key, not a secret. Never dropped. */
const ALWAYS_KEPT_KEYS = new Set(['token', 'distinct_id', 'uuid'])

export function scrubText(text: string): string {
  return text
    .replace(QUERY_PARAMS_RE, 'params: [redacted]')
    .replace(EMAIL_RE, '[email]')
    .replace(LONG_NUMBER_RE, '[number]')
}

/**
 * Keeps the origin, path and campaign parameters of a URL; drops every other query parameter and
 * the fragment. Works on absolute URLs and on paths ("/en/verify-email?email=…").
 */
export function scrubUrl(value: string): string {
  const isAbsolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(value)
  let url: URL
  try {
    url = new URL(value, 'http://relative.invalid')
  } catch {
    return scrubText(value.split(/[?#]/)[0] ?? '')
  }
  const kept = new URLSearchParams()
  url.searchParams.forEach((paramValue, key) => {
    if (KEPT_QUERY_PARAMS.has(key.toLowerCase())) kept.append(key, paramValue)
  })
  const query = kept.toString()
  const path = scrubText(decodeURIComponentSafe(url.pathname))
  // `origin` is "null" for file: and other non-HTTP schemes, so build the prefix by hand.
  const base = isAbsolute ? `${url.protocol}//${url.host}${path}` : path
  return query ? `${base}?${query}` : base
}

function decodeURIComponentSafe(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isSecretKey(key: string): boolean {
  return (
    SECRET_KEY_RE.test(key) ||
    PERSON_NAME_KEY_RE.test(key) ||
    PERSONAL_KEYS.has(key.toLowerCase().replace(/[_-]/g, ''))
  )
}

const URL_LIKE_RE = /^(https?:\/\/|\/)/i

/**
 * Deep-copies a properties object: drops secret keys, rewrites URLs with `scrubUrl` and other
 * strings with `scrubText`. `$`-prefixed keys are PostHog's own: their values are scrubbed, but no
 * key inside them is dropped (web-vitals objects have a `name: 'LCP'`, for example).
 */
export function scrubProperties<T>(value: T, depth = 0, insidePostHogKey = false): T {
  if (depth > 8) return value
  if (typeof value === 'string') {
    return (URL_LIKE_RE.test(value) ? scrubUrl(value) : scrubText(value)) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => scrubProperties(item, depth + 1, insidePostHogKey)) as T
  }
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (ALWAYS_KEPT_KEYS.has(key) && depth === 0) {
        out[key] = item
        continue
      }
      const isPostHogKey = insidePostHogKey || key.startsWith('$')
      if (!isPostHogKey && isSecretKey(key)) continue
      out[key] = scrubProperties(item, depth + 1, isPostHogKey)
    }
    return out as T
  }
  return value
}

/** A copy of `error` safe to log or send: scrubbed message and stack, same name. */
export function scrubError(error: unknown): Error {
  if (error instanceof Error) {
    const safe = new Error(scrubText(error.message))
    safe.name = error.name
    safe.stack = error.stack ? scrubText(error.stack) : undefined
    const digest = (error as { digest?: unknown }).digest
    if (typeof digest === 'string') Object.assign(safe, { digest })
    return safe
  }
  return new Error(scrubText(typeof error === 'string' ? error : 'Non-Error thrown'))
}

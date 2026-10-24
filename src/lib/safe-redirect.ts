/**
 * Returns `value` only if it is a same-site relative path ("/account", "/checkout?x=1").
 * Anything else (absolute URLs, protocol-relative "//host", backslashes, control characters)
 * falls back, so redirect targets taken from the query string can't leave the site.
 */
export function safeCallbackPath(value: string | null | undefined, fallback = '/'): string {
  if (!value || typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  if (value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return fallback
  return value
}

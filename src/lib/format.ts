/**
 * Locale-stable formatting for prices and dates.
 *
 * Always pass the page locale (`useLocale()` in components, `getLocale()` in async server
 * components). Never rely on the runtime default: the server formats as en-US while a visitor's
 * browser uses its own locale, and the mismatch breaks hydration (React error #418).
 */

// Pin the time zone too, so server (UTC) and browser render the same calendar day.
const TIME_ZONE = 'Europe/Bucharest'

export function formatPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(
  date: string | number | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  return new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options }).format(new Date(date))
}

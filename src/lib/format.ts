/**
 * Locale-stable formatting for prices and dates.
 *
 * Always pass the page locale (`useLocale()` in components, `getLocale()` in async server
 * components). Never rely on the runtime default: the server formats as en-US while a visitor's
 * browser uses its own locale, and the mismatch breaks hydration (React error #418).
 */

// Pin the time zone too, so server (UTC) and browser render the same calendar day.
const TIME_ZONE = 'Europe/Bucharest'

const priceFormatters = new Map<string, Intl.NumberFormat>()
const dateFormatters = new Map<string, Intl.DateTimeFormat>()

export function formatPrice(amount: number, locale: string): string {
  let formatter = priceFormatters.get(locale)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      // "€" in every locale; Romanian would otherwise print "EUR".
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
    priceFormatters.set(locale, formatter)
  }
  return formatter.format(amount)
}

export function formatDate(
  date: string | number | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  const key = `${locale}|${JSON.stringify(options)}`
  let formatter = dateFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options })
    dateFormatters.set(key, formatter)
  }
  return formatter.format(value)
}

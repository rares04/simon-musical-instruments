import { business } from './business'
import { CATEGORY_KEYS, categoryPath, categoryStats, CATEGORIES, formatList } from './categories'
import { formatEuro } from './instrument-text'
import type { InstrumentStatus, InstrumentType } from './schema'
import { absoluteUrl, locales, localizedPath, SITE_URL, type Locale } from './site'
import { instrumentPath } from './sitemap'

export type LlmsInstrument = {
  id: number
  slug?: string | null
  /** Descriptive English title, e.g. "Cello 4/4, handmade Stradivari Davidoff model, 2025". */
  name: string
  instrumentType: InstrumentType
  status: InstrumentStatus
  price?: number | null
  model?: string | null
  specs?: { bodyWood?: string | null } | null
}

const TYPE_HEADINGS: Record<InstrumentType, string> = {
  cello: 'Cellos',
  contrabass: 'Double basses',
  violin: 'Violins',
  viola: 'Violas',
}

const CATEGORY_NAMES: Record<(typeof CATEGORY_KEYS)[number], string> = {
  cellos: 'Handmade cellos',
  doubleBasses: 'Handmade double basses',
}

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  ro: 'Română',
  de: 'Deutsch',
  fr: 'Français',
  nl: 'Nederlands',
  ja: '日本語',
  ko: '한국어',
  el: 'Ελληνικά',
}

const en = (path: string, siteUrl: string) => absoluteUrl(localizedPath('en', path), siteUrl)

function priceText(price: number | null | undefined): string {
  return price != null && price > 0 ? formatEuro('en', price) : 'price on request'
}

/**
 * `/llms.txt` (https://llmstxt.org): a short Markdown summary for AI assistants, built from the
 * same facts as the structured data and from live stock, so it never contradicts the site.
 */
export function buildLlmsTxt(instruments: readonly LlmsInstrument[], siteUrl = SITE_URL): string {
  const [paul, ecaterina] = business.founders
  const a = business.address
  const [year, month] = business.foundingDate.split('-')
  const founded = new Date(Number(year), Number(month) - 1).toLocaleString('en', {
    month: 'long',
    year: 'numeric',
  })

  const lines: string[] = [
    `# ${business.name}`,
    '',
    `> ${business.name} is the workshop of ${paul.name} and ${ecaterina.name}, luthiers in ` +
      `${a.addressLocality}, Romania, founded in ${founded}. They build violins, violas, cellos and ` +
      'double basses by hand. Every instrument is one of a kind and is reserved online.',
    '',
    '## Facts',
    '',
    `- Makers: ${paul.name} and ${ecaterina.name}`,
    `- Workshop: ${a.streetAddress}, ${a.postalCode} ${a.addressLocality}, ${a.addressRegion} County, Romania`,
    `- Founded: ${founded}`,
    `- Phone: ${business.telephone}`,
    `- Email: ${business.email}`,
    '- Tops: fine-grained Romanian spruce. Varnish: spirit varnish, applied by hand',
    '- Every instrument comes with a signed certificate of authenticity',
    `- Website languages: ${locales.map((l) => LANGUAGE_NAMES[l]).join(', ')}`,
    '',
  ]

  const forSale = instruments.filter((i) => i.status === 'available')
  lines.push('## Categories', '')
  for (const key of CATEGORY_KEYS) {
    const list = instruments.filter((i) => i.instrumentType === CATEGORIES[key].type)
    const stats = categoryStats(list)
    const prices =
      stats.minPrice == null
        ? ''
        : stats.minPrice === stats.maxPrice
          ? `, ${formatEuro('en', stats.minPrice)}`
          : `, ${formatEuro('en', stats.minPrice)} to ${formatEuro('en', stats.maxPrice ?? stats.minPrice)}`
    const models = stats.models.length > 0 ? `. Models: ${formatList('en', stats.models)}` : ''
    lines.push(
      `- [${CATEGORY_NAMES[key]}](${en(categoryPath(key, 'en'), siteUrl)}): ` +
        `${stats.available} available now${prices}${models}`,
    )
  }
  lines.push(`- [All instruments](${en('/gallery', siteUrl)})`, '')

  lines.push('## Instruments available now', '')
  if (forSale.length === 0) lines.push('None right now. Custom orders are possible.', '')
  for (const type of Object.keys(TYPE_HEADINGS) as InstrumentType[]) {
    const ofType = forSale.filter((i) => i.instrumentType === type)
    if (ofType.length === 0) continue
    lines.push(`### ${TYPE_HEADINGS[type]}`, '')
    for (const i of ofType) {
      const wood = i.specs?.bodyWood?.trim()
      lines.push(
        `- [${i.name}](${en(instrumentPath(i), siteUrl)}): ${priceText(i.price)}` +
          (wood ? `. Back and ribs: ${wood}` : ''),
      )
    }
    lines.push('')
  }

  lines.push(
    '## How to buy',
    '',
    '- Reserve the instrument online, on its page. There is no online payment.',
    '- Paul contacts the buyer within 1–2 business days to answer questions and arrange payment ' +
      'and delivery.',
    `- [Frequently asked questions](${en('/faq', siteUrl)})`,
    `- [Contact](${en('/contact', siteUrl)})`,
    '',
    '## Other languages',
    '',
    ...locales
      .filter((l) => l !== 'en')
      .map((l) => `- [${LANGUAGE_NAMES[l]}](${absoluteUrl(localizedPath(l, '/'), siteUrl)})`),
    '',
  )

  return lines.join('\n')
}

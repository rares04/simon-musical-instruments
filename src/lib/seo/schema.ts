import { business } from './business'
import { SITE_URL, type Locale } from './site'

export type JsonLdNode = Record<string, unknown>

export type InstrumentStatus = 'available' | 'in-build' | 'reserved' | 'sold'
export type InstrumentType = 'violin' | 'viola' | 'cello' | 'contrabass'

/** Google accepts only 10 values; `Reserved` and `MadeToOrder` are not among them. */
export const AVAILABILITY: Record<InstrumentStatus, string> = {
  available: 'https://schema.org/InStock',
  reserved: 'https://schema.org/OutOfStock',
  'in-build': 'https://schema.org/PreOrder',
  sold: 'https://schema.org/SoldOut',
}

const CATEGORY: Record<InstrumentType, string> = {
  violin: 'Violin',
  viola: 'Viola',
  cello: 'Cello',
  contrabass: 'Double bass',
}

export const ids = {
  business: (siteUrl = SITE_URL) => `${siteUrl}/#business`,
  website: (siteUrl = SITE_URL) => `${siteUrl}/#website`,
  person: (id: string, siteUrl = SITE_URL) => `${siteUrl}/#${id}`,
}

export function graph(...nodes: (JsonLdNode | null | undefined)[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}

export function businessNode(siteUrl = SITE_URL): JsonLdNode {
  return {
    '@type': ['Organization', 'MusicStore'],
    '@id': ids.business(siteUrl),
    name: business.name,
    alternateName: [...business.alternateNames],
    url: `${siteUrl}/`,
    image: `${siteUrl}/og-default.jpg`,
    foundingDate: business.foundingDate,
    founder: business.founders.map((f) => ({ '@id': ids.person(f.id, siteUrl) })),
    telephone: business.telephone,
    email: business.email,
    address: { '@type': 'PostalAddress', ...business.address },
    areaServed: 'Worldwide',
    knowsAbout: [...business.knowsAbout],
    sameAs: [...business.sameAs],
  }
}

export function personNodes(siteUrl = SITE_URL): JsonLdNode[] {
  return business.founders.map((f) => ({
    '@type': 'Person',
    '@id': ids.person(f.id, siteUrl),
    name: f.name,
    jobTitle: f.jobTitle,
    worksFor: { '@id': ids.business(siteUrl) },
    knowsAbout: ['Violin making', 'Cello', 'Double bass'],
  }))
}

export function websiteNode(locale: Locale, siteUrl = SITE_URL): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ids.website(siteUrl),
    name: business.name,
    url: `${siteUrl}/`,
    inLanguage: locale,
    publisher: { '@id': ids.business(siteUrl) },
  }
}

export function breadcrumbNode(items: { name: string; url: string }[]): JsonLdNode | null {
  if (items.length < 2) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqNode(items: { question: string; answer: string }[]): JsonLdNode | null {
  if (items.length === 0) return null
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  }
}

export type ProductInput = {
  url: string
  name: string
  description?: string | null
  images: string[]
  sku: string
  type: InstrumentType
  model?: string | null
  year: number
  price?: number | null
  status: InstrumentStatus
  materials?: (string | null | undefined)[]
  audioUrl?: string | null
}

/**
 * Product markup for one instrument.
 * "Price on request" instruments get no `offers`: the markup stays valid for search engines and
 * AI parsers, but Google shows no product rich result for them. Never invent a price to fix that.
 */
export function productNode(p: ProductInput, siteUrl = SITE_URL): JsonLdNode {
  const materials = (p.materials ?? []).filter((m): m is string => Boolean(m?.trim()))
  const node: JsonLdNode = {
    '@type': 'Product',
    '@id': `${p.url}#product`,
    name: p.name,
    url: p.url,
    sku: p.sku,
    image: p.images,
    category: CATEGORY[p.type],
    brand: { '@id': ids.business(siteUrl) },
    manufacturer: { '@id': ids.business(siteUrl) },
    productionDate: String(p.year),
    itemCondition: 'https://schema.org/NewCondition',
  }
  if (p.description?.trim()) node.description = p.description.trim()
  if (p.model?.trim()) node.model = p.model.trim()
  if (materials.length > 0) node.material = materials.join(', ')
  if (p.price != null) {
    node.offers = {
      '@type': 'Offer',
      url: p.url,
      price: p.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: AVAILABILITY[p.status],
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ids.business(siteUrl) },
    }
  }
  if (p.audioUrl) {
    node.subjectOf = {
      '@type': 'AudioObject',
      name: `${p.name}: sound sample`,
      contentUrl: p.audioUrl,
      encodingFormat: 'audio/mpeg',
    }
  }
  return node
}

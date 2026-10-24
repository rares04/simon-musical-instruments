import { formatList, type CategoryKey, type CategoryStats } from './categories'
import { formatEuro } from './instrument-text'

/** A next-intl translator scoped to the `categoryPage` namespace. */
export type CategoryTranslator = (key: string, values?: Record<string, string | number>) => string

export type CategoryCopy = {
  h1: string
  /** Answer-first paragraph: what we build, where, which models. */
  intro: string
  /** What is for sale now, with prices. */
  stock: string
  facts: { label: string; value: string }[]
  faq: { question: string; answer: string }[]
}

function capitalize(locale: string, text: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
}

/** All visible copy for a category page, built from translated strings and live stats. */
export function categoryCopy(
  t: CategoryTranslator,
  locale: string,
  key: CategoryKey,
  stats: CategoryStats,
): CategoryCopy {
  const k = (path: string) => `${key}.${path}`
  const models = formatList(locale, stats.models)
  const woods = formatList(
    locale,
    stats.woods.map((w) => t(`woods.${w}`)),
  )

  let price = t('values.priceOnRequest')
  if (stats.minPrice != null && stats.maxPrice != null) {
    const min = formatEuro(locale, stats.minPrice)
    price =
      stats.minPrice === stats.maxPrice
        ? min
        : t('values.priceRange', { min, max: formatEuro(locale, stats.maxPrice) })
  }
  const priced = stats.minPrice != null

  const intro = [t(k('intro')), models ? t('modelsLine', { models }) : ''].filter(Boolean).join(' ')

  let stock = t('empty')
  if (stats.available > 0) {
    stock = priced
      ? t(k('stock'), { count: stats.available, price })
      : t(k('stockNoPrice'), { count: stats.available })
  }

  const facts = [
    { label: t('facts.size'), value: t(k('size')) },
    models ? { label: t('facts.models'), value: models } : null,
    { label: t('facts.top'), value: t('values.top') },
    woods ? { label: t('facts.backAndRibs'), value: capitalize(locale, woods) } : null,
    { label: t('facts.varnish'), value: t('values.varnish') },
    stats.available > 0 ? { label: t('facts.price'), value: price } : null,
    { label: t('facts.certificate'), value: t('values.certificate') },
    { label: t('facts.howToBuy'), value: t('values.howToBuy') },
  ].filter((f): f is { label: string; value: string } => f !== null)

  const faq = [
    priced && stats.available > 0
      ? { question: t(k('faq.price.question')), answer: t(k('faq.price.answer'), { price }) }
      : null,
    { question: t(k('faq.size.question')), answer: t(k('faq.size.answer')) },
    woods
      ? { question: t(k('faq.woods.question')), answer: t(k('faq.woods.answer'), { woods }) }
      : null,
    { question: t('howToBuy.question'), answer: t('howToBuy.answer') },
  ].filter((q): q is { question: string; answer: string } => q !== null)

  return { h1: t(k('h1')), intro, stock, facts, faq }
}

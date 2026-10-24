import type { InstrumentStatus } from './schema'

/** A next-intl translator scoped to the `seo` namespace. */
export type SeoTranslator = (key: string, values?: Record<string, string>) => string

type TitleInput = { title: string; model?: string | null; year: number }

/** Localized, descriptive instrument title, e.g. "Cello 4/4, handmade Stradivari Davidoff model, 2025". */
export function instrumentTitle(t: SeoTranslator, i: TitleInput): string {
  // Years are passed as strings: ICU would format the number 2025 as "2,025".
  const year = String(i.year)
  const model = i.model?.trim()
  return model
    ? t('instrument.titleWithModel', { title: i.title, model, year })
    : t('instrument.titleNoModel', { title: i.title, year })
}

type PriceInput = { price?: number | null; status: InstrumentStatus }

export function instrumentPriceText(t: SeoTranslator, locale: string, i: PriceInput): string {
  if (i.status === 'sold') return t('instrument.sold')
  if (i.status === 'reserved') return t('instrument.reserved')
  if (i.price == null) return t('instrument.priceOnRequest')
  const price = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(i.price)
  return t('instrument.price', { price })
}

export function instrumentDescription(
  t: SeoTranslator,
  locale: string,
  i: TitleInput & PriceInput,
  name: string = instrumentTitle(t, i),
): string {
  return t('instrument.description', { name, price: instrumentPriceText(t, locale, i) })
}

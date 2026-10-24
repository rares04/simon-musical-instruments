import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { ProductDetail } from './product-detail'
import { getMediaSrc, getMediaUrl } from '@/lib/media-utils'
import { buildAlternates } from '@/lib/seo/alternates'
import { findInstrument, getTranslatedLocales } from '@/lib/seo/instrument'
import { instrumentDescription, instrumentTitle } from '@/lib/seo/instrument-text'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbNode, businessNode, graph, productNode } from '@/lib/seo/schema'
import { absoluteUrl, localizedPath } from '@/lib/seo/site'
import { instrumentPath } from '@/lib/seo/sitemap'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string; locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const found = await findInstrument(id, locale)
  if (!found) return { robots: { index: false, follow: true } }

  const { instrument } = found
  const t = await getTranslations({ locale, namespace: 'seo' })
  const name = instrumentTitle(t, instrument)
  return buildMetadata({
    locale,
    path: instrumentPath(instrument),
    title: name,
    description: instrumentDescription(t, locale, instrument, name),
    image: getMediaSrc(getMediaUrl(instrument.mainImage)),
    imageAlt: name,
    translatedLocales: await getTranslatedLocales(instrument.id),
  })
}

export default async function ProductPage({ params }: Props) {
  const { id, locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const found = await findInstrument(id, locale)
  if (!found) notFound()

  const { instrument, matchedBy } = found
  // One URL per instrument: the numeric-id URL moves permanently to the slug URL.
  if (matchedBy === 'id' && instrument.slug) {
    permanentRedirect(localizedPath(locale, instrumentPath(instrument)))
  }

  // Build image gallery from mainImage + gallery
  const images: string[] = []
  const mainImageUrl = getMediaUrl(instrument.mainImage)
  if (mainImageUrl) images.push(mainImageUrl)

  if (instrument.gallery) {
    for (const item of instrument.gallery) {
      const galleryImageUrl = getMediaUrl(item.image)
      if (galleryImageUrl) images.push(galleryImageUrl)
    }
  }

  // Get audio URL if available
  const audioUrl = getMediaUrl(instrument.audioSample)

  const t = await getTranslations({ locale, namespace: 'seo' })
  const name = instrumentTitle(t, instrument)
  const path = instrumentPath(instrument)
  const { canonical } = buildAlternates({
    locale,
    path,
    translatedLocales: await getTranslatedLocales(instrument.id),
  })
  const toAbsolute = (url: string | null) => {
    const src = getMediaSrc(url)
    return src ? absoluteUrl(src) : null
  }

  const jsonLd = graph(
    businessNode(),
    productNode({
      url: canonical,
      name,
      description: instrument.luthierNotes,
      images: images.map(toAbsolute).filter((u): u is string => Boolean(u)),
      sku: String(instrument.id),
      type: instrument.instrumentType,
      model: instrument.model,
      year: instrument.year,
      price: instrument.price,
      status: instrument.status,
      materials: [instrument.specs?.topWood, instrument.specs?.bodyWood],
      audioUrl: toAbsolute(audioUrl),
    }),
    breadcrumbNode([
      { name: t('breadcrumb.home'), url: absoluteUrl(localizedPath(locale, '/')) },
      { name: t('breadcrumb.instruments'), url: absoluteUrl(localizedPath(locale, '/gallery')) },
      { name, url: canonical },
    ]),
  )

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLd} />
      <Header />
      <ProductDetail instrument={instrument} images={images} audioUrl={audioUrl} />
      <Footer />
    </div>
  )
}

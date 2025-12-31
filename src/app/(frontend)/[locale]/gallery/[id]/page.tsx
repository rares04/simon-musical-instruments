import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductDetail } from './product-detail'
import type { Instrument } from '@/payload-types'
import { getMediaUrl } from '@/lib/media-utils'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = await params
  const locale = await getLocale()
  const payload = await getPayload({ config })

  // Try to find by slug first, then by ID
  let instrument: Instrument | null = null

  const bySlug = await payload.find({
    collection: 'instruments',
    locale: locale as Locale,
    where: { slug: { equals: id } },
    limit: 1,
    depth: 1,
  })

  if (bySlug.docs.length > 0) {
    instrument = bySlug.docs[0]
  } else {
    // Try numeric ID
    const numId = parseInt(id, 10)
    if (!isNaN(numId)) {
      try {
        instrument = await payload.findByID({
          collection: 'instruments',
          id: numId,
          locale: locale as Locale,
          depth: 1,
        })
      } catch {
        instrument = null
      }
    }
  }

  if (!instrument) {
    return { title: 'Instrument Not Found' }
  }

  return {
    title: `${instrument.title} | Simon Musical Instruments`,
    description: `${instrument.title} - Handcrafted ${instrument.specs?.bodyWood || 'string instrument'} by Simon Musical Instruments. Price: €${instrument.price.toLocaleString()}`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = await params
  const locale = await getLocale()
  const payload = await getPayload({ config })

  // Try to find by slug first, then by ID
  let instrument: Instrument | null = null

  const bySlug = await payload.find({
    collection: 'instruments',
    locale: locale as Locale,
    where: { slug: { equals: id } },
    limit: 1,
    depth: 1,
  })

  if (bySlug.docs.length > 0) {
    instrument = bySlug.docs[0]
  } else {
    // Try numeric ID
    const numId = parseInt(id, 10)
    if (!isNaN(numId)) {
      try {
        instrument = await payload.findByID({
          collection: 'instruments',
          id: numId,
          locale: locale as Locale,
          depth: 1,
        })
      } catch {
        instrument = null
      }
    }
  }

  if (!instrument) {
    notFound()
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetail instrument={instrument} images={images} audioUrl={audioUrl} />
      <Footer />
    </div>
  )
}


import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductDetail } from './product-detail'
import type { Instrument, Media } from '@/payload-types'

// Helper to get image URL from Payload media
function getImageUrl(image: number | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'number') return null
  return image.url || null
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  // Try to find by slug first, then by ID
  let instrument: Instrument | null = null

  const bySlug = await payload.find({
    collection: 'instruments',
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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  // Try to find by slug first, then by ID
  let instrument: Instrument | null = null

  const bySlug = await payload.find({
    collection: 'instruments',
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
  const mainImageUrl = getImageUrl(instrument.mainImage)
  if (mainImageUrl) images.push(mainImageUrl)

  if (instrument.gallery) {
    for (const item of instrument.gallery) {
      const galleryImageUrl = getImageUrl(item.image)
      if (galleryImageUrl) images.push(galleryImageUrl)
    }
  }

  // Get audio URL if available
  const audioUrl = getImageUrl(instrument.audioSample)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetail instrument={instrument} images={images} audioUrl={audioUrl} />
      <Footer />
    </div>
  )
}

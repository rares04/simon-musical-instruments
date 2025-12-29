'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioPlayer } from '@/components/audio-player'
import { useCart } from '@/lib/cart-context'
import type { Instrument } from '@/payload-types'

interface ProductDetailProps {
  instrument: Instrument
  images: string[]
  audioUrl: string | null
}

// Helper to get proper image src
function getImageSrc(url: string): string {
  // If it's already a full URL or starts with /, use as-is
  if (url.startsWith('http') || url.startsWith('/')) {
    return url
  }
  // Otherwise prepend /api/media/file/
  return `/api/media/file/${url}`
}

export function ProductDetail({ instrument, images, audioUrl }: ProductDetailProps) {
  const { addItem } = useCart()

  // Get instrument type label
  const typeLabel =
    instrument.instrumentType === 'violin'
      ? 'Violin'
      : instrument.instrumentType === 'viola'
        ? 'Viola'
        : instrument.instrumentType === 'cello'
          ? 'Cello'
          : instrument.instrumentType === 'contrabass'
            ? 'Contrabass'
            : 'String Instrument'

  const handleAddToCart = () => {
    addItem({
      id: String(instrument.id),
      name: instrument.title,
      type: typeLabel,
      price: instrument.price,
      image: images[0] ? getImageSrc(images[0]) : '',
    })
  }

  const statusLabel =
    instrument.status === 'available'
      ? 'Available'
      : instrument.status === 'in-build'
        ? 'In Build'
        : instrument.status === 'reserved'
          ? 'Reserved'
          : 'Sold'

  return (
    <main className="pt-20">
      {/* Back to Gallery */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collection
          </Link>
        </div>
      </div>

      {/* Product Detail Layout */}
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Sticky Image Gallery */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] flex flex-col">
            <ImageGallery images={images.map(getImageSrc)} alt={instrument.title} />
          </div>

          {/* Right Column - Scrollable Content */}
          <div className="space-y-10 lg:space-y-12">
            {/* Title and Price */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wider text-accent font-medium">
                    {typeLabel}
                  </p>
                  <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground text-balance">
                    {instrument.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">{statusLabel}</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl lg:text-4xl font-bold text-accent">
                    €{instrument.price.toLocaleString()}
                  </div>
                  {instrument.year && (
                    <p className="text-sm text-muted-foreground mt-1">Crafted {instrument.year}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Luthier's Notes */}
            {instrument.luthierNotes && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">Luthier's Notes</h2>
                <div className="bg-muted/30 border border-border p-6 lg:p-8">
                  <p className="text-base text-foreground/90 leading-relaxed text-pretty whitespace-pre-wrap">
                    {instrument.luthierNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Listen to the Sound
                </h2>
                <AudioPlayer audioUrl={audioUrl} instrumentName={instrument.title} />
              </div>
            )}

            {/* Specifications */}
            {instrument.specs && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">Specifications</h2>
                <div className="grid gap-4">
                  {instrument.specs.bodyWood && (
                    <SpecRow label="Body Wood" value={instrument.specs.bodyWood} />
                  )}
                  {instrument.specs.topWood && (
                    <SpecRow label="Top Wood" value={instrument.specs.topWood} />
                  )}
                  {instrument.specs.neckWood && (
                    <SpecRow label="Neck Wood" value={instrument.specs.neckWood} />
                  )}
                  {instrument.specs.fingerboardWood && (
                    <SpecRow label="Fingerboard" value={instrument.specs.fingerboardWood} />
                  )}
                  {instrument.specs.varnish && (
                    <SpecRow label="Varnish" value={instrument.specs.varnish} />
                  )}
                  {instrument.specs.strings && (
                    <SpecRow label="Strings" value={instrument.specs.strings} />
                  )}
                  {instrument.specs.bodyLength && (
                    <SpecRow label="Body Length" value={instrument.specs.bodyLength} />
                  )}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="space-y-4 pt-4">
              {instrument.status === 'available' ? (
                <>
                  <Button
                    size="lg"
                    className="w-full h-14 text-base font-medium cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <p className="text-sm text-muted-foreground text-center text-pretty">
                    Secure checkout with insured FedEx delivery. Each instrument is a significant
                    investment and includes full documentation.
                  </p>
                </>
              ) : instrument.status === 'in-build' ? (
                <div className="bg-muted/50 border border-border p-6 text-center">
                  <p className="text-base text-muted-foreground text-pretty">
                    This instrument is currently being crafted. Contact us to reserve it or get
                    updates on completion.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-4 bg-transparent cursor-pointer"
                  >
                    Reserve This Instrument
                  </Button>
                </div>
              ) : (
                <div className="bg-muted/50 border border-border p-6 text-center">
                  <p className="text-base text-muted-foreground text-pretty">
                    This instrument has been {instrument.status}. Contact us to commission a similar
                    piece.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-4 bg-transparent cursor-pointer"
                  >
                    Commission a Similar Instrument
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-3">
      <dt className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
      <dd className="text-base text-foreground font-medium text-right">{value}</dd>
    </div>
  )
}

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden group flex-1">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - View ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Navigation Arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-[3/4] w-20 overflow-hidden bg-muted transition-all cursor-pointer ${
                index === currentIndex
                  ? 'ring-2 ring-accent opacity-100'
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

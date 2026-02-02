'use client'

import { useRef, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioPlayer } from '@/components/audio-player'
import { useCart } from '@/lib/cart-context'
import type { Instrument } from '@/payload-types'
import { getMediaSrc } from '@/lib/media-utils'

interface ProductDetailProps {
  instrument: Instrument
  images: string[]
  audioUrl: string | null
}

export function ProductDetail({ instrument, images, audioUrl }: ProductDetailProps) {
  const { addItem } = useCart()
  const t = useTranslations('instruments')
  const tProduct = useTranslations('product')

  const typeLabel =
    instrument.instrumentType === 'violin'
      ? t('violin')
      : instrument.instrumentType === 'viola'
        ? t('viola')
        : instrument.instrumentType === 'cello'
          ? t('cello')
          : instrument.instrumentType === 'contrabass'
            ? t('contrabass')
            : 'String Instrument'

  const handleAddToCart = () => {
    addItem({
      id: String(instrument.id),
      name: instrument.title,
      type: typeLabel,
      price: instrument.price,
      image: images[0] ? (getMediaSrc(images[0]) || images[0]) : '',
    })
  }

  const statusLabel =
    instrument.status === 'available'
      ? t('available')
      : instrument.status === 'in-build'
        ? t('inBuild')
        : instrument.status === 'reserved'
          ? t('reserved')
          : t('sold')

  return (
    <main className="pt-20">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tProduct('backToCollection')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] flex flex-col">
            <ImageGallery
              images={images.map((url) => getMediaSrc(url) || url)}
              alt={instrument.title}
              noImagesText={tProduct('noImagesAvailable')}
            />
          </div>

          <div className="space-y-10 lg:space-y-12">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wider text-accent font-medium">
                    {typeLabel}
                    {instrument.model && ` · ${instrument.model}`}
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {tProduct('crafted', { year: instrument.year })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {instrument.luthierNotes && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {tProduct('luthierNotes')}
                </h2>
                <div className="bg-muted/30 border border-border p-6 lg:p-8">
                  <p className="text-base text-foreground/90 leading-relaxed text-pretty whitespace-pre-wrap">
                    {instrument.luthierNotes}
                  </p>
                </div>
              </div>
            )}

            {audioUrl && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {tProduct('listenSound')}
                </h2>
                <AudioPlayer audioUrl={getMediaSrc(audioUrl) || audioUrl} instrumentName={instrument.title} />
              </div>
            )}

            {instrument.specs && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {tProduct('specifications')}
                </h2>
                <div className="grid gap-4">
                  {instrument.specs.bodyWood && (
                    <SpecRow label={tProduct('bodyWood')} value={instrument.specs.bodyWood} />
                  )}
                  {instrument.specs.topWood && (
                    <SpecRow label={tProduct('topWood')} value={instrument.specs.topWood} />
                  )}
                  {instrument.specs.neckWood && (
                    <SpecRow label={tProduct('neckWood')} value={instrument.specs.neckWood} />
                  )}
                  {instrument.specs.fingerboardWood && (
                    <SpecRow
                      label={tProduct('fingerboard')}
                      value={instrument.specs.fingerboardWood}
                    />
                  )}
                  {instrument.specs.varnish && (
                    <SpecRow label={tProduct('varnish')} value={instrument.specs.varnish} />
                  )}
                  {instrument.specs.strings && (
                    <SpecRow label={tProduct('strings')} value={instrument.specs.strings} />
                  )}
                  {instrument.specs.bodyLength && (
                    <SpecRow label={tProduct('bodyLength')} value={instrument.specs.bodyLength} />
                  )}
                  {instrument.instrumentType === 'contrabass' &&
                    instrument.specs.stringVibration && (
                      <SpecRow
                        label={tProduct('stringVibration')}
                        value={instrument.specs.stringVibration}
                      />
                    )}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
              {instrument.status === 'available' && (instrument.stock ?? 1) > 0 ? (
                <>
                  <Button
                    size="lg"
                    className="w-full h-14 text-base font-medium cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    {t('addToCart')}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center text-pretty">
                    {tProduct('checkoutNote')}
                  </p>
                  {(instrument.stock ?? 1) <= 3 && (instrument.stock ?? 1) > 1 && (
                    <p className="text-sm text-amber-600 text-center font-medium">
                      {tProduct('lowStock', { count: instrument.stock })}
                    </p>
                  )}
                </>
              ) : (
                <div className="bg-muted/50 border border-border p-6 text-center">
                  <p className="text-base text-muted-foreground text-pretty">
                    {instrument.status === 'in-build'
                      ? tProduct('inBuildNote')
                      : tProduct('soldNote', { status: instrument.status })}
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-4 bg-transparent cursor-pointer"
                    asChild
                  >
                    <Link href={`/contact?instrument=${encodeURIComponent(instrument.title)}`}>
                      {t('inquire')}
                    </Link>
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

function ImageGallery({
  images,
  alt,
  noImagesText,
}: {
  images: string[]
  alt: string
  noImagesText: string
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isMagnifying, setIsMagnifying] = useState<boolean>(false)
  // Store mouse position relative to the container
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  // Store container dimensions
  const [containerDims, setContainerDims] = useState({ width: 0, height: 0 })

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">{noImagesText}</span>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length)
  }

  const LENS_SIZE = 220
  const ZOOM = 2.5

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()

    // STRICT BOUNDARY CHECK:
    // If the mouse is outside the container rect, turn off magnifying and return.
    // This prevents the lens from "escaping".
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setIsMagnifying(false)
      return
    }

    // If we are inside, make sure magnifying is on
    if (!isMagnifying) {
      setIsMagnifying(true)
    }

    // Update state with new coordinates and dimensions
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setContainerDims({
      width: rect.width,
      height: rect.height,
    })
  }

  // CALCULATE POSITIONING FOR INNER IMAGE:
  // 1. We have a large, zoomed-in image.
  // 2. We need to move (translate) it so that the point under the cursor
  //    is exactly in the center of the lens.
  // 3. The math: (Center of Lens) - (Position on Zoomed Image)
  const translateX = LENS_SIZE / 2 - mousePos.x * ZOOM
  const translateY = LENS_SIZE / 2 - mousePos.y * ZOOM

  return (
    <div className="flex flex-col gap-4 h-full">
      <div
        ref={containerRef}
        // Add onMouseLeave as a backup to turn off the lens
        onMouseLeave={() => setIsMagnifying(false)}
        onMouseMove={handleMouseMove}
        className={`relative aspect-[3/4] bg-muted overflow-hidden group flex-1 select-none ${
          isMagnifying ? 'cursor-none' : 'cursor-default'
        }`}
      >
        {/* Main Image */}
        <Image
          src={images[currentIndex]}
          alt={`${alt} - View ${currentIndex + 1}`}
          fill
          className="object-contain pointer-events-none"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Magnifier hint */}
        <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-xs text-muted-foreground group-hover:opacity-0 transition-opacity z-10">
          <Search className="h-3 w-3" />
          <span>Hover to zoom</span>
        </div>

        {/* NEW MAGNIFIER LENS IMPLEMENTATION */}
        {isMagnifying && containerDims.width > 0 && (
          // 1. The Lens Container (Round, moves with mouse)
          <div
            className="absolute z-20 rounded-full border-2 border-white shadow-2xl overflow-hidden pointer-events-none bg-background"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              // Center the lens itself on the mouse cursor
              left: mousePos.x - LENS_SIZE / 2,
              top: mousePos.y - LENS_SIZE / 2,
            }}
          >
            {/* 2. The Zoomed Image Container (Large, gets translated) */}
            <div
              className="relative"
              style={{
                // Make this container the size of the ZOOMED image
                width: containerDims.width * ZOOM,
                height: containerDims.height * ZOOM,
                // Move it to bring the correct spot to the center
                transform: `translate(${translateX}px, ${translateY}px)`,
                // Optimization for smooth movement
                willChange: 'transform',
              }}
            >
              {/* 3. The Actual Image (Uses object-contain to avoid deformation) */}
              <Image
                src={images[currentIndex]}
                alt="Zoomed view"
                fill
                // This ensures the aspect ratio is correct!
                className="object-contain"
                priority
                // Give it a large size value for proper loading
                sizes={`${containerDims.width * ZOOM}px`}
              />
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-30 rounded-full shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-30 rounded-full shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-sm rounded z-30 pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-[3/4] w-20 overflow-hidden bg-muted transition-all cursor-pointer flex-shrink-0 ${
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
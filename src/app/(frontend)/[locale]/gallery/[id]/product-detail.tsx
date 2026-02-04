'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ChevronLeft, ChevronRight, Search, X, Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AudioPlayer } from '@/components/audio-player'
import { useCart } from '@/lib/cart-context'
import type { Instrument } from '@/payload-types'
import { getMediaSrc } from '@/lib/media-utils'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

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

// --- NOUA IMPLEMENTARE ZOOM & PAN ---
function PanZoomImage({ src, alt }: { src: string; alt: string }) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={8} // Permite zoom de pana la 8x
      centerOnInit={true}
      wheel={{ step: 0.2 }} // Cat de repede face zoom din scroll
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          {/* Controale pentru Zoom (Overlay) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[70] bg-black/60 backdrop-blur-sm p-2 rounded-full border border-white/10">
            <button
              onClick={() => zoomOut()}
              className="p-2 text-white hover:text-accent transition-colors hover:bg-white/10 rounded-full"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => resetTransform()}
              className="p-2 text-white hover:text-accent transition-colors hover:bg-white/10 rounded-full"
              title="Reset View"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => zoomIn()}
              className="p-2 text-white hover:text-accent transition-colors hover:bg-white/10 rounded-full"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            contentStyle={{
               width: "100%",
               height: "100%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center"
            }}
          >
            {/* Important: Folosim un div relativ pentru ca Next.js Image 
              are nevoie de un container parinte pentru 'fill' 
            */}
            <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                priority
                quality={100} // Fortam calitatea maxima
                sizes="100vw"
                draggable={false} // Important pentru a nu trage imaginea nativ din browser
              />
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  )
}

// --- GALERIA PRINCIPALA + LIGHTBOX MANAGEMENT ---
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Prevenim scroll-ul cand lightbox-ul e deschis
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isLightboxOpen])

  // Ascultam tasta ESC pentru a inchide
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">{noImagesText}</span>
      </div>
    )
  }

  const nextImage = (e?: any) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e?: any) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        {/* Container Imagine Principala (PREVIEW) */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[3/4] bg-muted overflow-hidden group flex-1 cursor-zoom-in rounded-sm border border-border/50"
        >
          <Image
            src={images[currentIndex]}
            alt={`${alt} - View ${currentIndex + 1}`}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Maximize2 className="w-5 h-5" />
          </div>

          <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-xs text-muted-foreground z-10 pointer-events-none">
            <Search className="h-3 w-3" />
            <span>Click to expand</span>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer z-20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-[3/4] w-20 overflow-hidden bg-muted transition-all cursor-pointer flex-shrink-0 rounded-sm border ${
                  index === currentIndex
                    ? 'ring-2 ring-accent opacity-100 border-accent'
                    : 'opacity-50 hover:opacity-75 border-transparent'
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

      {/* --- LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 lg:top-8 lg:right-8 z-[80] p-2 bg-black/20 hover:bg-black/40 text-foreground rounded-full transition-colors cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Container Imagine Lightbox - Cu Pan & Zoom */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Resetăm componenta PanZoom când se schimbă imaginea folosind key */}
            <PanZoomImage key={currentIndex} src={images[currentIndex]} alt={alt} />
            
            {/* Navigare Lightbox */}
            {images.length > 1 && (
              <>
                 <button
                  onClick={prevImage}
                  className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 bg-black/10 hover:bg-accent hover:text-white text-foreground/70 transition-colors rounded-full cursor-pointer z-[60]"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 bg-black/10 hover:bg-accent hover:text-white text-foreground/70 transition-colors rounded-full cursor-pointer z-[60]"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Counter */}
             <div className="absolute top-8 left-8 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium z-[60] pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { InstrumentFilters } from '@/components/instrument-filters'
import { Badge } from '@/components/ui/badge'
import type { Instrument, Media } from '@/payload-types'

// Helper to get image URL from Payload media
function getImageUrl(image: number | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'number') return null
  return image.url || null
}

// Helper to get proper image src
function getImageSrc(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('/')) {
    return url
  }
  return `/api/media/file/${url}`
}

interface GalleryClientProps {
  instruments: Instrument[]
}

export function GalleryClient({ instruments }: GalleryClientProps) {
  const t = useTranslations('instruments')
  const tGallery = useTranslations('gallery')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all')

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return t('available')
      case 'in-build':
        return t('inBuild')
      case 'reserved':
        return t('reserved')
      case 'sold':
        return t('sold')
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'violin':
        return t('violin')
      case 'viola':
        return t('viola')
      case 'cello':
        return t('cello')
      case 'contrabass':
        return t('contrabass')
      default:
        return type
    }
  }

  // Filter instruments based on selected criteria
  const filteredInstruments = useMemo(() => {
    return instruments.filter((instrument) => {
      // Type filter
      if (selectedType !== 'all') {
        const typeMap: Record<string, string> = {
          Violin: 'violin',
          Viola: 'viola',
          Cello: 'cello',
          Contrabass: 'contrabass',
        }
        if (instrument.instrumentType !== typeMap[selectedType]) {
          return false
        }
      }

      // Price range filter
      if (selectedPriceRange !== 'all') {
        const price = instrument.price
        switch (selectedPriceRange) {
          case 'under-3000':
            if (price >= 3000) return false
            break
          case '3000-6000':
            if (price < 3000 || price > 6000) return false
            break
          case '6000-10000':
            if (price < 6000 || price > 10000) return false
            break
          case 'over-10000':
            if (price <= 10000) return false
            break
        }
      }

      return true
    })
  }, [instruments, selectedType, selectedPriceRange])

  return (
    <>
      {/* Filters */}
      <InstrumentFilters
        selectedType={selectedType}
        selectedPriceRange={selectedPriceRange}
        onTypeChange={setSelectedType}
        onPriceRangeChange={setSelectedPriceRange}
        totalCount={filteredInstruments.length}
      />

      {/* Instruments Grid */}
      {filteredInstruments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {filteredInstruments.map((instrument) => {
            const rawImageUrl = getImageUrl(instrument.mainImage)
            const imageUrl = getImageSrc(rawImageUrl)
            const isSold = instrument.status === 'sold'
            const statusLabel = getStatusLabel(instrument.status)
            const typeLabel = getTypeLabel(instrument.instrumentType)

            return (
              <Link
                key={instrument.id}
                href={`/gallery/${instrument.slug || instrument.id}`}
                className="group block transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <article className={`space-y-4 ${isSold ? 'opacity-60' : ''}`}>
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={instrument.title}
                        fill
                        className={`object-cover transition-all duration-500 ${isSold ? 'grayscale' : 'group-hover:scale-105'}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={instrument.status === 'available' ? 'default' : 'secondary'}
                        className={
                          instrument.status === 'available'
                            ? 'bg-accent text-accent-foreground backdrop-blur-sm'
                            : 'bg-muted-foreground/80 text-background backdrop-blur-sm'
                        }
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>

                  {/* Instrument Details */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-semibold text-foreground leading-tight text-balance">
                        {instrument.title}
                      </h3>
                      <p className="text-base font-medium text-foreground whitespace-nowrap">
                        €{instrument.price.toLocaleString()}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {[instrument.specs?.bodyWood, instrument.specs?.topWood]
                        .filter(Boolean)
                        .join(' / ') || 'Handcrafted instrument'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{typeLabel}</span>
                      <span>•</span>
                      <span>{instrument.year || new Date(instrument.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">{tGallery('noResults')}</p>
          <p className="text-sm text-muted-foreground mt-2">{tGallery('adjustFilters')}</p>
        </div>
      )}
    </>
  )
}

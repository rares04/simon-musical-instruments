'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
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

interface InstrumentShowcaseProps {
  instruments: Instrument[]
}

export function InstrumentShowcase({ instruments }: InstrumentShowcaseProps) {
  const t = useTranslations('instruments')

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

  return (
    <section id="instruments" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-4 mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl lg:text-5xl text-foreground text-balance leading-tight">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto text-pretty leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {instruments.map((instrument) => {
            const rawImageUrl = getImageUrl(instrument.mainImage)
            const imageUrl = getImageSrc(rawImageUrl)
            const statusLabel = getStatusLabel(instrument.status)
            const typeLabel = getTypeLabel(instrument.instrumentType)

            return (
              <Link
                key={instrument.id}
                href={`/gallery/${instrument.slug || instrument.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-border/60 bg-card hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 cursor-pointer">
                  <div className="relative aspect-[3/4] bg-muted/30 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={instrument.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={instrument.status === 'available' ? 'default' : 'secondary'}
                        className={
                          instrument.status === 'available'
                            ? 'bg-accent text-accent-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5 space-y-2 bg-card">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {typeLabel} ·{' '}
                      {instrument.year || new Date(instrument.createdAt).getFullYear()}
                    </div>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                      {instrument.title}
                    </h3>
                    <p className="text-base font-medium text-foreground">
                      €{instrument.price.toLocaleString()}
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/gallery">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent group cursor-pointer border-border/60 hover:bg-muted/50"
            >
              {t('viewDetails')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

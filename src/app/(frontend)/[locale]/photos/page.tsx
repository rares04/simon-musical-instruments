'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

type Category = 'all' | 'instruments' | 'workshop' | 'people'

interface GalleryImage {
  id: number
  src: string
  titleKey: string
  altKey: string
  category: Category
}

const galleryImages: GalleryImage[] = [
  // Scrambled order (mixed categories). Removed duplicates/low-quality:
  // - removed id:1 (duplicate of id:3)
  // - removed id:11 (duplicate of id:12)
  // - removed id:19 (duplicate of id:15)
  // - removed id:18 (low quality)
  {
    id: 12,
    src: '/gallery/gallery-10.jpg',
    titleKey: 'images.carvedScrolls.title',
    altKey: 'images.carvedScrolls.alt',
    category: 'workshop',
  },
  {
    id: 4,
    src: '/gallery/gallery-3.jpg',
    titleKey: 'images.ecaterinaVarnishing.title',
    altKey: 'images.ecaterinaVarnishing.alt',
    category: 'people',
  },
  {
    id: 15,
    src: '/gallery/gallery-2.jpg',
    titleKey: 'images.instrumentBacks.title',
    altKey: 'images.instrumentBacks.alt',
    category: 'instruments',
  },
  {
    id: 9,
    src: '/gallery/gallery-12.jpg',
    titleKey: 'images.woodAttic.title',
    altKey: 'images.woodAttic.alt',
    category: 'workshop',
  },
  {
    id: 3,
    src: '/gallery/gallery-1.jpg',
    titleKey: 'images.paulAtWork.title',
    altKey: 'images.paulAtWork.alt',
    category: 'people',
  },
  {
    id: 16,
    src: '/gallery/gallery-6.jpg',
    titleKey: 'images.woodGrain.title',
    altKey: 'images.woodGrain.alt',
    category: 'instruments',
  },
  {
    id: 13,
    src: '/gallery/gallery-11.jpg',
    titleKey: 'images.varnishApplication.title',
    altKey: 'images.varnishApplication.alt',
    category: 'workshop',
  },
  {
    id: 2,
    src: '/gallery/about-us-ecaterina.jpg',
    titleKey: 'images.ecaterinaPortrait.title',
    altKey: 'images.ecaterinaPortrait.alt',
    category: 'people',
  },
  {
    id: 8,
    src: '/gallery/gallery-5.jpg',
    titleKey: 'images.woodStorage.title',
    altKey: 'images.woodStorage.alt',
    category: 'workshop',
  },
  {
    id: 5,
    src: '/gallery/gallery-8.jpg',
    titleKey: 'images.applyingVarnish.title',
    altKey: 'images.applyingVarnish.alt',
    category: 'people',
  },
  {
    id: 17,
    src: '/gallery/gallery-13.jpg',
    titleKey: 'images.cBoutDetail.title',
    altKey: 'images.cBoutDetail.alt',
    category: 'instruments',
  },
  {
    id: 10,
    src: '/gallery/gallery-7.jpg',
    titleKey: 'images.violinTops.title',
    altKey: 'images.violinTops.alt',
    category: 'workshop',
  },
  {
    id: 6,
    src: '/gallery/gallery-9.jpg',
    titleKey: 'images.ecaterinaWorking.title',
    altKey: 'images.ecaterinaWorking.alt',
    category: 'people',
  },
  {
    id: 14,
    src: '/gallery/gallery-4.jpg',
    titleKey: 'images.celloInProgress.title',
    altKey: 'images.celloInProgress.alt',
    category: 'workshop',
  },
  {
    id: 20,
    src: '/gallery/viol-3-1949x3000.jpg',
    titleKey: 'images.violaBack.title',
    altKey: 'images.violaBack.alt',
    category: 'instruments',
  },
  {
    id: 7,
    src: '/gallery/gallery-14.jpg',
    titleKey: 'images.craftingCello.title',
    altKey: 'images.craftingCello.alt',
    category: 'people',
  },
]

export default function PhotosPage() {
  const t = useTranslations('photos')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const filteredImages =
    selectedCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory)

  const categories: { value: Category; labelKey: string }[] = [
    { value: 'all', labelKey: 'categories.all' },
    { value: 'instruments', labelKey: 'categories.instruments' },
    { value: 'workshop', labelKey: 'categories.workshop' },
    { value: 'people', labelKey: 'categories.people' },
  ]

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1,
      )
    }
  }

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1,
      )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImageIndex === null) return
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setSelectedImageIndex(null)
  }

  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null

  return (
    <div className="min-h-screen bg-background" onKeyDown={handleKeyDown} tabIndex={0}>
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block mb-4">
              <span className="text-xs lg:text-sm uppercase tracking-wider text-accent font-medium">
                {t('badge')}
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t('subtitle')}</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                className="cursor-pointer transition-all"
              >
                {t(category.labelKey)}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted/50 cursor-pointer 
                           shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Image
                  src={image.src}
                  alt={t(image.altKey)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg font-semibold text-background">
                      {t(image.titleKey)}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedImageIndex(null)}
              role="dialog"
              aria-modal="true"
              aria-label={t(selectedImage.titleKey)}
            >
              {/* Close button */}
              <Button
                onClick={() => setSelectedImageIndex(null)}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-background hover:text-background/80 hover:bg-background/10 cursor-pointer z-10"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Previous button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-background hover:text-background/80 hover:bg-background/10 cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              {/* Next button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-background hover:text-background/80 hover:bg-background/10 cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              <div
                className="relative max-w-6xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={selectedImage.src}
                    alt={t(selectedImage.altKey)}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="font-serif text-2xl font-semibold text-background mb-2">
                    {t(selectedImage.titleKey)}
                  </h3>
                  <p className="text-background/80 max-w-2xl mx-auto">{t(selectedImage.altKey)}</p>
                  <p className="text-background/60 mt-2 text-sm">
                    {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} /{' '}
                    {filteredImages.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

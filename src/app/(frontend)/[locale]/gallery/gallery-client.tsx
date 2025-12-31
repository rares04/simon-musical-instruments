'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { InstrumentFilters } from '@/components/instrument-filters'
import { InstrumentCardWithAudio } from '@/components/instrument-card-with-audio'
import type { Instrument } from '@/payload-types'

interface GalleryClientProps {
  instruments: Instrument[]
}

export function GalleryClient({ instruments }: GalleryClientProps) {
  const searchParams = useSearchParams()
  const tGallery = useTranslations('gallery')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all')

  // Read initial filter from URL params (from category card clicks)
  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam && ['Violin', 'Viola', 'Cello', 'Contrabass'].includes(typeParam)) {
      setSelectedType(typeParam)
    }
  }, [searchParams])

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
          {filteredInstruments.map((instrument) => (
            <InstrumentCardWithAudio key={instrument.id} instrument={instrument} />
          ))}
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

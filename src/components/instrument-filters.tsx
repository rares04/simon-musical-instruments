'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

type InstrumentFiltersProps = {
  selectedType: string
  selectedPriceRange: string
  onTypeChange: (type: string) => void
  onPriceRangeChange: (range: string) => void
  totalCount: number
}

export function InstrumentFilters({
  selectedType,
  selectedPriceRange,
  onTypeChange,
  onPriceRangeChange,
  totalCount,
}: InstrumentFiltersProps) {
  const t = useTranslations('gallery.filters')
  const tGallery = useTranslations('gallery')
  const tInstruments = useTranslations('instruments')

  const instrumentTypes = [
    { value: 'all', label: t('allInstruments') },
    { value: 'Violin', label: t('violins') },
    { value: 'Viola', label: t('violas') },
    { value: 'Cello', label: t('cellos') },
    { value: 'Contrabass', label: t('contrabasses') },
  ]

  const priceRanges = [
    { value: 'all', label: t('allPrices') },
    { value: 'under-3000', label: t('under3000') },
    { value: '3000-6000', label: t('3000to6000') },
    { value: '6000-10000', label: t('6000to10000') },
    { value: 'over-10000', label: t('over10000') },
  ]

  return (
    <div className="mb-12 space-y-6">
      {/* Instrument Type Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('instrumentType')}</h3>
        <div className="flex flex-wrap gap-2">
          {instrumentTypes.map((type) => (
            <Button
              key={type.value}
              onClick={() => onTypeChange(type.value)}
              variant={selectedType === type.value ? 'default' : 'outline'}
              size="sm"
              className="rounded-sm"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('priceRange')}</h3>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <Button
              key={range.value}
              onClick={() => onPriceRangeChange(range.value)}
              variant={selectedPriceRange === range.value ? 'default' : 'outline'}
              size="sm"
              className="rounded-sm"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          {tGallery('showing', { count: totalCount })}
        </p>
      </div>
    </div>
  )
}

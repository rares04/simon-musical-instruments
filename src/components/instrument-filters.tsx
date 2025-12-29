"use client"

import { Button } from "@/components/ui/button"

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
  const instrumentTypes = [
    { value: "all", label: "All Instruments" },
    { value: "Violin", label: "Violins" },
    { value: "Viola", label: "Violas" },
    { value: "Cello", label: "Cellos" },
    { value: "Contrabass", label: "Contrabasses" },
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "under-3000", label: "Under €3,000" },
    { value: "3000-6000", label: "€3,000 - €6,000" },
    { value: "6000-10000", label: "€6,000 - €10,000" },
    { value: "over-10000", label: "Over €10,000" },
  ]

  return (
    <div className="mb-12 space-y-6">
      {/* Instrument Type Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Instrument Type</h3>
        <div className="flex flex-wrap gap-2">
          {instrumentTypes.map((type) => (
            <Button
              key={type.value}
              onClick={() => onTypeChange(type.value)}
              variant={selectedType === type.value ? "default" : "outline"}
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Price Range</h3>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <Button
              key={range.value}
              onClick={() => onPriceRangeChange(range.value)}
              variant={selectedPriceRange === range.value ? "default" : "outline"}
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
          Showing <span className="font-medium text-foreground">{totalCount}</span> instrument
          {totalCount !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  )
}

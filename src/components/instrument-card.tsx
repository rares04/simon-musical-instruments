import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Instrument, Media } from "@/payload-types"

// Helper to get image URL from Payload media
function getImageUrl(image: number | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === "number") return null
  return image.url || null
}

type InstrumentCardProps = {
  instrument: Instrument
}

export function InstrumentCard({ instrument }: InstrumentCardProps) {
  const isSold = instrument.status === "sold"
  const imageUrl = getImageUrl(instrument.mainImage)
  const statusLabel =
    instrument.status === "available"
      ? "Available"
      : instrument.status === "in-build"
        ? "In Build"
        : instrument.status === "reserved"
          ? "Reserved"
          : "Sold"

  return (
    <Link
      href={`/gallery/${instrument.slug || instrument.id}`}
      className="group block transition-transform hover:scale-[1.02] cursor-pointer"
      aria-label={`View details for ${instrument.title}`}
    >
      <article className={`space-y-4 ${isSold ? "opacity-60" : ""}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={instrument.title}
              fill
              className={`object-cover transition-all duration-500 ${isSold ? "grayscale" : "group-hover:scale-105"}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {isSold ? (
              <Badge variant="secondary" className="bg-muted-foreground/80 text-background backdrop-blur-sm">
                {statusLabel}
              </Badge>
            ) : (
              <Badge variant="default" className="bg-accent text-accent-foreground backdrop-blur-sm">
                {statusLabel}
              </Badge>
            )}
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

          {instrument.specs && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {[instrument.specs.bodyWood, instrument.specs.topWood].filter(Boolean).join(" / ")}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {instrument.instrumentType && (
              <span className="capitalize">{instrument.instrumentType}</span>
            )}
            {instrument.model && (
              <>
                <span>•</span>
                <span>{instrument.model}</span>
              </>
            )}
            {instrument.year && (
              <>
                <span>•</span>
                <span>{instrument.year}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

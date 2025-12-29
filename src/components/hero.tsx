import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-block">
              <span className="text-xs lg:text-sm uppercase tracking-wider text-muted-foreground font-medium">
                Reghin, Transylvania · Est. 2014
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-balance text-foreground">
              Welcome to Our Virtual Workshop
            </h1>

            <div className="space-y-4">
              <p className="text-base lg:text-lg text-foreground leading-relaxed max-w-xl text-pretty font-medium">
                We are Paul and Ecaterina Simon and we are happy to welcome you to our site.
              </p>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
                From our little workshop in Reghin—the City of Violins—we handcraft premium bowed
                string instruments using wood naturally cured since 2001 and traditional
                hand-applied varnish.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground group cursor-pointer w-full sm:w-auto shadow-sm"
                >
                  View Our Instruments
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#story">
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer w-full sm:w-auto border-border/60 hover:bg-muted/50 bg-transparent"
                >
                  Learn Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image - Added subtle warm overlay effect */}
          <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-md overflow-hidden bg-muted shadow-lg">
            <Image
              src="/close-up-detail-of-handcrafted-violin-with-beautif.jpg"
              alt="Handcrafted violin detail"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle warm vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}

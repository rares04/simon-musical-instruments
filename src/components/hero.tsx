import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-block">
              <span className="text-xs lg:text-sm uppercase tracking-wider text-muted-foreground font-medium">
                Reghin, Transylvania · Est. 1998
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-balance text-foreground">
              Handcrafted Excellence in Every Note
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
              Premium bowed string instruments crafted by Paul & Ecaterina Simon using wood naturally cured since 2001
              and traditional hand-applied varnish in the historic City of Violins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group cursor-pointer w-full sm:w-auto"
                >
                  View Our Instruments
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#story">
                <Button size="lg" variant="outline" className="cursor-pointer w-full sm:w-auto bg-transparent">
                  Learn Our Story
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-sm overflow-hidden bg-muted">
            <img
              src="/close-up-detail-of-handcrafted-violin-with-beautif.jpg"
              alt="Handcrafted violin detail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import { Timer, Droplet } from 'lucide-react'

export function LuthierStory() {
  return (
    <section id="story" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-muted order-2 lg:order-1">
            <Image
              src="/luthier-workshop-hands-working-on-violin-with-tool.jpg"
              alt="Luthier workshop"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl lg:text-5xl text-foreground text-balance">
                The Luthier&apos;s Craft
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty">
                In Reghin, Transylvania—known as the City of Violins—Paul and Ecaterina Simon
                continue a centuries-old tradition of handcrafting exceptional string instruments.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Timer className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-foreground">Naturally Cured Wood</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    We cure our own wood naturally, with some pieces aging since 2001. This patient
                    process ensures optimal resonance and tonal quality that cannot be rushed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Droplet className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-foreground">Traditional Varnish</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Each instrument receives hand-applied lacquer based on natural resins and
                    traditional formulas. This tactile, slow process creates depth and protects the
                    wood while enhancing its natural beauty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

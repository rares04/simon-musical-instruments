import { getPayload } from 'payload'
import config from '@/payload.config'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GalleryClient } from './gallery-client'

export const metadata = {
  title: 'Gallery | Simon Musical Instruments',
  description: 'Browse our collection of handcrafted violins, violas, cellos, and contrabasses.',
}

export default async function GalleryPage() {
  const payload = await getPayload({ config })

  // Fetch all instruments
  const { docs: instruments } = await payload.find({
    collection: 'instruments',
    limit: 100,
    depth: 1,
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="text-xs lg:text-sm uppercase tracking-wider text-accent font-medium">
                Available for Purchase
              </span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Instrument Shop
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Browse our current inventory of handcrafted instruments. Each piece is available for purchase and ready to
              ship. Click any instrument to view full details, hear sound samples, and complete your purchase.
            </p>
          </div>

          <GalleryClient instruments={instruments} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

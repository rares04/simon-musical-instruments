import { getPayload } from 'payload'
import config from '@/payload.config'

import { Header } from '@/components/header'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'
import { Hero } from '@/components/hero'
import { InstrumentShowcase } from '@/components/instrument-showcase'
import { LuthierStory } from '@/components/luthier-story'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch featured instruments from Payload
  const { docs: instruments } = await payload.find({
    collection: 'instruments',
    where: {
      status: { in: ['available', 'in-build'] },
    },
    limit: 4,
    depth: 1, // Populate media relationships
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InstrumentShowcase instruments={instruments} />
        <LuthierStory />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

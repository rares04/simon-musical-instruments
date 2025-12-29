import { getPayload } from 'payload'
import config from '@/payload.config'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/config'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { InstrumentShowcase } from '@/components/instrument-showcase'
import { LuthierStory } from '@/components/luthier-story'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const locale = await getLocale()
  const payload = await getPayload({ config })

  // Fetch featured instruments from Payload with locale
  const { docs: instruments } = await payload.find({
    collection: 'instruments',
    locale: locale as Locale,
    where: {
      status: { in: ['available', 'in-build'] },
    },
    limit: 4,
    depth: 1,
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

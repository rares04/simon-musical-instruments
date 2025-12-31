import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { InstrumentShowcase } from '@/components/instrument-showcase'
import { LuthierStory } from '@/components/luthier-story'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InstrumentShowcase />
        <LuthierStory />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { InstrumentShowcase } from '@/components/instrument-showcase'
import { LuthierStory } from '@/components/luthier-story'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { business } from '@/lib/seo/business'
import { buildMetadata } from '@/lib/seo/metadata'
import { businessNode, graph, personNodes, websiteNode } from '@/lib/seo/schema'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/',
    title: t('home.title', { brand: business.name }),
    description: t('home.description'),
    brandSuffix: false,
  })
}

export default async function HomePage({ params }: Props) {
  const locale = (await params).locale as Locale
  return (
    <div className="min-h-screen">
      <JsonLd data={graph(businessNode(), ...personNodes(), websiteNode(locale))} />
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

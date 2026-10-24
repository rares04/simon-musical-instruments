import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getLocale, getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo/metadata'
import { breadcrumbNode, businessNode, graph } from '@/lib/seo/schema'
import { absoluteUrl, localizedPath } from '@/lib/seo/site'
import { categoryPath } from '@/lib/seo/categories'
import { Link } from '@/i18n/routing'
import { GalleryClient } from './gallery-client'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (await params).locale as Locale
  const t = await getTranslations({ locale, namespace: 'seo' })
  return buildMetadata({
    locale,
    path: '/gallery',
    title: t('gallery.title'),
    description: t('gallery.description'),
  })
}

export default async function GalleryPage() {
  const locale = await getLocale()
  const t = await getTranslations('gallery')
  const tSeo = await getTranslations('seo')
  const payload = await getPayload({ config })
  const jsonLd = graph(
    businessNode(),
    breadcrumbNode([
      { name: tSeo('breadcrumb.home'), url: absoluteUrl(localizedPath(locale as Locale, '/')) },
      {
        name: tSeo('breadcrumb.instruments'),
        url: absoluteUrl(localizedPath(locale as Locale, '/gallery')),
      },
    ]),
  )

  // Fetch all instruments with locale
  const { docs: instruments } = await payload.find({
    collection: 'instruments',
    locale: locale as Locale,
    limit: 100,
    depth: 1,
    sort: '-createdAt',
  })

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLd} />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="text-xs lg:text-sm uppercase tracking-wider text-accent font-medium">
                {t('badge')}
              </span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">{t('description')}</p>
            <nav
              aria-label={t('browseBy')}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
            >
              <span className="text-muted-foreground">{t('browseBy')}:</span>
              <Link
                href={categoryPath('cellos', locale as Locale)}
                className="inline-block py-0.5 text-accent hover:underline underline-offset-4"
              >
                {t('filters.cellos')}
              </Link>
              <Link
                href={categoryPath('doubleBasses', locale as Locale)}
                className="inline-block py-0.5 text-accent hover:underline underline-offset-4"
              >
                {t('filters.contrabasses')}
              </Link>
            </nav>
          </div>

          <GalleryClient instruments={instruments} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

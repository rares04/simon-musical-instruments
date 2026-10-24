import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { InstrumentCardWithAudio } from '@/components/instrument-card-with-audio'
import { Button } from '@/components/ui/button'
import { getMediaSrc, getMediaUrl } from '@/lib/media-utils'
import { JsonLd } from '@/components/seo/json-ld'
import { buildAlternates } from '@/lib/seo/alternates'
import {
  categoryPath,
  categoryPaths,
  categoryStats,
  formatList,
  resolveCategory,
  type CategoryKey,
} from '@/lib/seo/categories'
import { categoryCopy } from '@/lib/seo/category-text'
import { findCategoryInstruments } from '@/lib/seo/instrument'
import { buildMetadata } from '@/lib/seo/metadata'
import {
  breadcrumbNode,
  businessNode,
  collectionPageNode,
  faqNode,
  graph,
  websiteNode,
} from '@/lib/seo/schema'
import { absoluteUrl, localizedPath } from '@/lib/seo/site'
import { instrumentPath } from '@/lib/seo/sitemap'

// Render at runtime (DB not accessible during build)
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; category: string }> }

/** Short labels that already exist in every locale, used for the breadcrumb. */
const BREADCRUMB_LABEL: Record<CategoryKey, string> = {
  cellos: 'filters.cellos',
  doubleBasses: 'filters.contrabasses',
}

async function load(locale: Locale, key: CategoryKey) {
  const [instruments, t, tSeo] = await Promise.all([
    findCategoryInstruments(key, locale),
    getTranslations({ locale, namespace: 'categoryPage' }),
    getTranslations({ locale, namespace: 'seo' }),
  ])
  const stats = categoryStats(instruments)
  const description = tSeo(`categories.${key}.description`, {
    models: formatList(locale, stats.models),
  })
  return { instruments, stats, t, tSeo, description }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, category } = await params
  const locale = rawLocale as Locale
  const match = resolveCategory(locale, category)
  if (!match) return { robots: { index: false, follow: true } }

  const { instruments, tSeo, description } = await load(locale, match.key)
  return buildMetadata({
    locale,
    path: categoryPath(match.key, locale),
    paths: categoryPaths(match.key),
    title: tSeo(`categories.${match.key}.title`),
    description,
    image: getMediaSrc(getMediaUrl(instruments[0]?.mainImage)),
  })
}

export default async function CategoryPage({ params }: Props) {
  const { locale: rawLocale, category } = await params
  const locale = rawLocale as Locale
  const match = resolveCategory(locale, category)
  if (!match) notFound()
  // One URL per page and language: /de/cellos and /en/Cellos move to /de/celli and /en/cellos.
  if (!match.isCanonical) permanentRedirect(localizedPath(locale, categoryPath(match.key, locale)))

  const { key } = match
  const { instruments, stats, t, tSeo, description } = await load(locale, key)
  const tGallery = await getTranslations({ locale, namespace: 'gallery' })
  const copy = categoryCopy(t, locale, key, stats)
  const hasSold = instruments.some((i) => i.status === 'sold')

  const { canonical } = buildAlternates({
    locale,
    path: categoryPath(key, locale),
    paths: categoryPaths(key),
  })
  const jsonLd = graph(
    businessNode(),
    websiteNode(locale),
    collectionPageNode({
      url: canonical,
      name: copy.h1,
      description,
      locale,
      items: instruments.map((i) => ({
        url: absoluteUrl(localizedPath(locale, instrumentPath(i))),
        name: i.title,
      })),
    }),
    breadcrumbNode([
      { name: tSeo('breadcrumb.home'), url: absoluteUrl(localizedPath(locale, '/')) },
      {
        name: tSeo('breadcrumb.instruments'),
        url: absoluteUrl(localizedPath(locale, '/gallery')),
      },
      { name: tGallery(BREADCRUMB_LABEL[key]), url: canonical },
    ]),
    faqNode(copy.faq),
  )

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLd} />
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <span className="text-xs lg:text-sm uppercase tracking-wider text-accent font-medium">
              {t('badge')}
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              {copy.h1}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">{copy.intro}</p>
            <p className="mt-4 text-base text-foreground text-pretty">{copy.stock}</p>
          </header>

          <section aria-labelledby="facts-heading" className="max-w-3xl mx-auto mb-16 lg:mb-20">
            <h2 id="facts-heading" className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
              {t('factsHeading')}
            </h2>
            <dl className="divide-y divide-border/60 border border-border/60 rounded-lg bg-card/50">
              {copy.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-4"
                >
                  <dt className="text-sm font-medium text-muted-foreground">{fact.label}</dt>
                  <dd className="sm:col-span-2 text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {instruments.length > 0 && (
            <section aria-labelledby="list-heading" className="mb-16 lg:mb-20">
              <h2
                id="list-heading"
                className="font-serif text-2xl lg:text-3xl text-foreground mb-8 text-center"
              >
                {t('listHeading')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {instruments.map((instrument) => (
                  <InstrumentCardWithAudio key={instrument.id} instrument={instrument} />
                ))}
              </div>
              {hasSold && (
                <p className="mt-8 text-sm text-muted-foreground text-center">{t('soldNote')}</p>
              )}
            </section>
          )}

          <section aria-labelledby="faq-heading" className="max-w-3xl mx-auto mb-16">
            <h2 id="faq-heading" className="font-serif text-2xl lg:text-3xl text-foreground mb-6">
              {t('faqHeading')}
            </h2>
            <div className="space-y-6">
              {copy.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="font-medium text-lg text-foreground mb-2">{item.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/gallery">{t('allInstruments')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Link href="/contact">{t('contact')}</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

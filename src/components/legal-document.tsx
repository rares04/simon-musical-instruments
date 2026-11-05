import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Link } from '@/i18n/routing'
import { formatDate } from '@/lib/format'
import { LEGAL_VERSION, legalValues } from '@/lib/legal/company'
import { fillPlaceholders, type LegalValues } from '@/lib/legal/placeholders'
import type { Locale } from '@/i18n/config'

/** A paragraph, or a nested array for a bullet list. */
type Block = string | string[]
type Section = { id: string; title: string; body: Block[] }

const LINK = /(https:\/\/[^\s)]+[^\s).,;:]|[\w.+-]+@[\w-]+\.[\w.-]*\w)/g

/** Turns bare URLs and email addresses into links. */
function linkify(text: string): ReactNode[] {
  return text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return part
    const href = part.startsWith('https://') ? part : `mailto:${part}`
    return (
      <a
        key={i}
        href={href}
        className="text-accent underline underline-offset-2 hover:text-accent/80 break-words"
        {...(href.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {part}
      </a>
    )
  })
}

function renderBlock(block: Block, values: LegalValues, key: number, boxed: boolean) {
  if (Array.isArray(block)) {
    if (boxed) {
      return (
        <div key={key} className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
          {block.map((line, i) => (
            <p key={i}>{linkify(fillPlaceholders(line, values))}</p>
          ))}
        </div>
      )
    }
    return (
      <ul key={key} className="list-disc pl-5 space-y-2">
        {block.map((item, i) => (
          <li key={i}>{linkify(fillPlaceholders(item, values))}</li>
        ))}
      </ul>
    )
  }
  return <p key={key}>{linkify(fillPlaceholders(block, values))}</p>
}

/** Sections whose list is a form to copy, shown as a box instead of bullets. */
const BOXED_SECTIONS = new Set(['withdrawal-form'])

/** Shared layout of the privacy policy and the terms of sale. Texts live in `legal.<doc>`. */
export async function LegalDocument({
  locale,
  doc,
  related,
}: {
  locale: Locale
  doc: 'privacy' | 'terms'
  related: { href: '/privacy' | '/terms'; label: string }
}) {
  const t = await getTranslations({ locale, namespace: 'legal' })
  const sections = t.raw(`${doc}.sections`) as Section[]
  const values = legalValues(t('common.pending'))

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground text-balance">
                {t(`${doc}.title`)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('common.lastUpdated', {
                  date: formatDate(LEGAL_VERSION, locale, { dateStyle: 'long' }),
                })}
              </p>
              <p className="text-lg text-muted-foreground text-pretty">{t(`${doc}.intro`)}</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto space-y-10">
            <nav
              aria-labelledby="legal-contents"
              className="rounded-md border border-border/60 p-4"
            >
              <h2 id="legal-contents" className="text-sm font-medium uppercase tracking-wider">
                {t('common.contents')}
              </h2>
              <ol className="mt-3 list-decimal pl-5 space-y-1 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="inline-block py-0.5 text-muted-foreground hover:text-accent"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-24 space-y-4"
              >
                <h2 id={`${s.id}-title`} className="font-serif text-2xl text-foreground">
                  {i + 1}. {s.title}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {s.body.map((block, j) =>
                    renderBlock(block, values, j, BOXED_SECTIONS.has(s.id)),
                  )}
                </div>
              </section>
            ))}

            <p className="border-t border-border/60 pt-6 text-sm text-muted-foreground">
              {t('common.seeAlso')}:{' '}
              <Link href={related.href} className="text-accent hover:text-accent/80">
                {related.label}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import { getTranslations } from 'next-intl/server'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export async function generateMetadata() {
  const t = await getTranslations('faq')
  return {
    title: `${t('title')} | Simon Musical Instruments`,
    description: t('subtitle'),
  }
}

export default async function FAQPage() {
  const t = await getTranslations('faq')

  const faqKeys = [
    'purchase',
    'shipping',
    'returns',
    'certificate',
    'care',
    'custom',
    'payment',
    'packaging',
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground text-balance">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">{t('subtitle')}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqKeys.map((key, index) => (
                <AccordionItem
                  key={key}
                  value={`item-${index}`}
                  className="border border-border/60 rounded-lg px-6 bg-card/50 hover:bg-card transition-colors"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-accent py-5">
                    {t(`questions.${key}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {t(`questions.${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/60 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-3xl text-foreground">{t('contactPrompt')}</h2>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground cursor-pointer"
                >
                  {t('contactLink')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


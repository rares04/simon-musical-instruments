import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'FAQ | Simon Musical Instruments',
  description:
    'Frequently asked questions about purchasing, shipping, and caring for our handcrafted string instruments.',
}

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I purchase an instrument?',
      answer:
        "Browse our collection, add your chosen instrument to cart, and complete checkout with secure Stripe payment. We'll contact you to confirm shipping details and answer any questions you may have about your new instrument.",
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes! We ship worldwide with insured FedEx/DHL. Instruments are professionally packed in protective cases with additional padding. Shipping costs are calculated at checkout based on your destination.',
    },
    {
      question: 'What is your return/trial policy?',
      answer:
        "We offer a 14-day trial period. If the instrument doesn't meet your expectations, return it in original condition for a full refund (minus shipping). Contact us within 48 hours of delivery to arrange returns.",
    },
    {
      question: 'Do instruments come with a certificate of authenticity?',
      answer:
        'Yes, every instrument includes a signed certificate of authenticity from Paul Simon, documenting the woods used, date of completion, and unique characteristics of your instrument.',
    },
    {
      question: 'How should I care for my instrument?',
      answer:
        'Store in a climate-controlled environment (40-60% humidity). Clean with a soft cloth after playing. Have a luthier check the instrument annually. We provide detailed care instructions with every purchase.',
    },
    {
      question: 'Can I commission a custom instrument?',
      answer:
        "Contact us to discuss your requirements. Custom instruments typically take 6-12 months and pricing depends on specifications. We'll work with you throughout the process.",
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express) via Stripe, as well as bank transfers for larger purchases. Contact us for payment plan options on higher-priced instruments.',
    },
    {
      question: 'How are instruments packaged for shipping?',
      answer:
        'Each instrument is placed in a high-quality case, wrapped in protective foam, and shipped in a double-walled cardboard box. All shipments are fully insured against shipping damage.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="font-serif text-4xl lg:text-5xl text-foreground text-balance">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                We&apos;re here to help you find the perfect instrument. Below are answers to common
                questions about our process, shipping, and care.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border/60 rounded-lg px-6 bg-card/50 hover:bg-card transition-colors"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-accent py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
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
              <h2 className="font-serif text-3xl text-foreground">Still have questions?</h2>
              <p className="text-muted-foreground text-pretty">
                We&apos;re always happy to discuss our instruments and process in more detail. Reach
                out and we&apos;ll get back to you promptly.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground cursor-pointer"
                >
                  Contact Us
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

'use client'

import { useTranslations } from 'next-intl'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  quote: string
  originalQuote?: string
  originalLanguage?: string
  name: string
  instrument: string
  location: string
  rating: number
}

export function Testimonials() {
  const t = useTranslations('testimonials')

  // Testimonial data is kept static as these are real reviews
  const testimonials: Testimonial[] = [
    {
      originalQuote:
        'Contrabasul pe care l-am cumpărat de la Paul Șimon mi-a depășit așteptările. Este nu doar un instrument deosebit de frumos, ci și unul cu o sonoritate plină, caldă și expresivă. M-a impresionat răbdarea și deschiderea cu care am fost ghidat în alegerea instrumentului potrivit pentru mine. O experiență minunată! Recomand cu încredere!',
      originalLanguage: 'Romanian',
      quote:
        "The double bass I bought from Paul Simon exceeded my expectations. It's not just a beautifully crafted instrument, but one with a full, warm, and expressive sound. I was impressed by the patience and openness with which I was guided in choosing the right instrument. A wonderful experience!",
      name: 'Lucian Orcinschi',
      instrument: 'Double Bass',
      location: 'Romania',
      rating: 5,
    },
    {
      quote:
        'We bought a great violin for our son. He got to choose the best one from a range of high quality violins. Paul is a great person, very supportive and skilled string instruments maker. We highly recommend his instruments, like incredible cellos and double basses along the violins.',
      name: 'Radu Onofrei',
      instrument: 'Violin',
      location: 'Romania',
      rating: 5,
    },
    {
      quote:
        "It was great to have tried out Paul's viola and violins. Paul's viola is amazing. I tried it on for a few mins and immediately I know this is the best one for me. The tone is warm and balanced. This is my first viola and I thank Paul again for offering me his beautiful piece of work.",
      name: 'Leo Shum',
      instrument: 'Viola',
      location: 'International',
      rating: 5,
    },
    {
      originalQuote:
        'Its perfect. The work is so good. Every thing is excellent. Je suis ravi du travail effectué. Tout est parfait. Quel talent! Le son est magnifique.',
      originalLanguage: 'English & French',
      quote:
        "It's perfect. The work is so good. Everything is excellent. I am delighted with the work done. Everything is perfect. What talent! The sound is magnificent.",
      name: 'C Picot',
      instrument: 'String Instrument',
      location: 'France',
      rating: 5,
    },
    {
      originalQuote:
        'Im Rahmen unserer Rumänienreise eröffnete uns Paul Simon sehr unkompliziert die Möglichkeit, sein Atelier in Reghin zu besuchen. Wir konnten viel über die handwerkliche Herstellung der wunderschönen Instrumente mit ihren so einzigartigen Holzmasserungen erfahren. Nochmal Danke an Paul Simon und seinen Sohn für diese tolle Erfahrung!',
      originalLanguage: 'German',
      quote:
        'During our trip to Romania, Paul Simon gave us the opportunity to visit his studio in Reghin. We learned a lot about the handcrafted production of these beautiful instruments with their unique wood grain. Thanks again to Paul Simon and his son for this wonderful experience!',
      name: 'Harp Z',
      instrument: 'Workshop Visit',
      location: 'Germany',
      rating: 5,
    },
  ]

  return (
    <section className="border-t border-border/60 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground text-balance">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">{t('subtitle')}</p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        {/* Second row - 2 cards centered */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mt-6 lg:mt-8">
          {testimonials.slice(3, 5).map((testimonial, index) => (
            <TestimonialCard key={index + 3} testimonial={testimonial} />
          ))}
        </div>

        {/* Google Reviews Attribution */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            {t('source')}:{' '}
            <a
              href="https://maps.app.goo.gl/NqV7kbScxHWPSG8X6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Google Reviews
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-card/50 border border-border/60 rounded-lg p-6 lg:p-8 space-y-4 hover:bg-card hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </div>

      {/* Quote */}
      <div className="flex-1 space-y-3">
        <Quote className="h-6 w-6 text-accent/40" />

        {/* Original language quote if available */}
        {testimonial.originalQuote && (
          <blockquote className="text-muted-foreground/80 text-sm leading-relaxed text-pretty italic border-l-2 border-accent/30 pl-4">
            &ldquo;{testimonial.originalQuote}&rdquo;
            <span className="block text-xs text-muted-foreground/60 mt-1 not-italic">
              Original ({testimonial.originalLanguage})
            </span>
          </blockquote>
        )}

        {/* English quote */}
        <blockquote
          className={`text-muted-foreground leading-relaxed text-pretty ${testimonial.originalQuote ? 'text-sm' : 'italic'}`}
        >
          {testimonial.originalQuote ? (
            <>
              <span className="text-xs text-muted-foreground/60 block mb-1">
                English translation:
              </span>
              &ldquo;{testimonial.quote}&rdquo;
            </>
          ) : (
            <>&ldquo;{testimonial.quote}&rdquo;</>
          )}
        </blockquote>
      </div>

      {/* Attribution */}
      <div className="pt-4 border-t border-border/40">
        <p className="font-medium text-foreground">{testimonial.name}</p>
        <p className="text-sm text-accent">{testimonial.instrument}</p>
        <p className="text-sm text-muted-foreground/80">{testimonial.location}</p>
      </div>
    </div>
  )
}

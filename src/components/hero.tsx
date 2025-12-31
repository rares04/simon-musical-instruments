'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-block">
              <span className="text-xs lg:text-sm uppercase tracking-wider text-muted-foreground font-medium">
                Reghin, Transylvania · {t('established')}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-balance text-foreground">
              {t('title')}
            </h1>

            <div className="space-y-4">
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
                {t('quote')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground group cursor-pointer w-full sm:w-auto shadow-sm"
                >
                  {t('cta')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/#story">
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer w-full sm:w-auto border-border/60 hover:bg-muted/50 bg-transparent"
                >
                  {t('learnStory')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image - Paul at work */}
          <div className="relative">
            {/* Decorative offset background */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-lg bg-accent/20 hidden sm:block" />
            <div className="absolute -bottom-2 -right-2 w-full h-full rounded-lg border-2 border-accent/30 hidden sm:block" />

            <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-lg overflow-hidden shadow-xl shadow-accent/10 border border-border/40">
              <Image
                src="/gallery/gallery-1.jpg"
                alt="Paul Simon crafting a violin in his workshop"
                fill
                className="object-cover"
                priority
              />
              {/* Subtle warm vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

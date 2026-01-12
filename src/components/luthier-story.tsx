'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { TreeDeciduous, Brush, Globe } from 'lucide-react'

export function LuthierStory() {
  const t = useTranslations('story')

  return (
    <section id="story" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image - Ecaterina at work */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative offset background */}
            <div className="absolute -bottom-4 -left-4 w-full h-full rounded-lg bg-accent/20 hidden sm:block" />
            <div className="absolute -bottom-2 -left-2 w-full h-full rounded-lg border-2 border-accent/30 hidden sm:block" />

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl shadow-accent/10 border border-border/40">
              <Image
                src="/gallery/gallery-3.jpg"
                alt="Ecaterina Simon applying varnish to a violin"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/10 pointer-events-none" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl lg:text-5xl text-foreground text-balance leading-tight">
                {t('title')}
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty">
                {t('subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TreeDeciduous className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-foreground">{t('heritage.title')}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {t('heritage.description')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Brush className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-foreground">{t('materials.title')}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {t('materials.description')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-foreground">{t('clientele.title')}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    {t('clientele.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Invitation quote */}
            <div className="pt-4 border-t border-border/50">
              <p className="font-serif text-xl lg:text-2xl text-foreground italic">
                {t('invitation')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

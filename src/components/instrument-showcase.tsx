'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Music, Music2, Music3, Music4 } from 'lucide-react'

const categories = [
  {
    id: 'violin',
    translationKey: 'violin',
    icon: Music,
    filterParam: 'Violin',
  },
  {
    id: 'viola',
    translationKey: 'viola',
    icon: Music2,
    filterParam: 'Viola',
  },
  {
    id: 'cello',
    translationKey: 'cello',
    icon: Music3,
    filterParam: 'Cello',
  },
  {
    id: 'contrabass',
    translationKey: 'contrabass',
    icon: Music4,
    filterParam: 'Contrabass',
  },
] as const

export function InstrumentShowcase() {
  const t = useTranslations('instruments')
  const tCategories = useTranslations('instrumentCategories')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section id="instruments" className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="text-center space-y-4 mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl lg:text-5xl text-foreground text-balance leading-tight">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto text-pretty leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon
            const isHovered = hoveredCard === category.id

            return (
              <Link
                key={category.id}
                href={`/gallery?type=${category.filterParam}`}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative block cursor-pointer"
              >
                {/* Card Container with 3D transform */}
                <div
                  className="relative h-[320px] rounded-xl overflow-hidden border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30"
                  style={{
                    transform: isHovered
                      ? 'perspective(1000px) rotateY(2deg)'
                      : 'perspective(1000px) rotateY(0deg)',
                  }}
                >
                  {/* Animated gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 50%, rgba(212, 157, 88, 0.08) 0%, transparent 70%)',
                    }}
                  />

                  {/* Decorative corner accent - grows on hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-30 group-hover:opacity-50 transition-all duration-700">
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-r-[60px] border-t-accent/20 border-r-transparent group-hover:border-t-[80px] group-hover:border-r-[80px] transition-all duration-700" />
                  </div>

                  {/* Content container with parallax effect */}
                  <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                    {/* Icon with glow effect */}
                    <div className="mb-6 relative">
                      {/* Glow ring */}
                      <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-[2] transition-all duration-700" />

                      {/* Icon */}
                      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20 text-accent group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>

                    {/* Text content with staggered animation */}
                    <div className="space-y-3">
                      {/* Category name - slides up */}
                      <h3 className="font-serif text-2xl lg:text-3xl text-foreground font-semibold group-hover:text-accent transition-all duration-500 transform group-hover:-translate-y-1">
                        {t(category.translationKey)}
                      </h3>

                      {/* Subtitle - fades in */}
                      <p className="text-sm uppercase tracking-widest text-accent font-medium opacity-60 group-hover:opacity-100 transition-all duration-500 delay-75">
                        {tCategories(`${category.id}.subtitle`)}
                      </p>

                      {/* Divider line - grows from center */}
                      <div className="flex justify-center py-2">
                        <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent w-0 group-hover:w-24 transition-all duration-700 delay-100" />
                      </div>

                      {/* Description - slides in from bottom */}
                      <p className="text-muted-foreground text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                        {tCategories(`${category.id}.description`)}
                      </p>
                    </div>

                    {/* "Explore" text - appears at bottom */}
                    <div className="absolute bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                      <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                        {tCategories('exploreCollection')} →
                      </span>
                    </div>
                  </div>

                  {/* Animated border shimmer effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(212, 157, 88, 0.15), transparent)',
                        animation: isHovered ? 'shimmer 2s infinite' : 'none',
                      }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Global keyframes for shimmer animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `,
        }}
      />
    </section>
  )
}

'use client'

import { useTranslations } from 'next-intl'
import { Mail, MapPin, Phone, Instagram } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/language-switcher'

// WhatsApp icon (lucide-react doesn't have one)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer id="contact" className="border-t border-border/60 bg-primary/5">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-serif text-xl text-foreground">Simon Musical Instruments</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md text-pretty">
              {t('tagline')}
            </p>
            <p className="text-xs text-muted-foreground italic">&quot;{t('quote')}&quot;</p>

            {/* Social Media Links */}
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/simon_musicalinstruments/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href="https://wa.me/40744960722"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                aria-label="Contact us on WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span className="text-sm">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground">
              {t('contact')}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Strada 1 Decembrie 1918, nr. 8<br />
                  Reghin, 545300
                  <br />
                  Romania
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:paul.simon@simoninstruments.com">paul.simon@simoninstruments.com</a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors cursor-pointer">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+40744960722">+40 744 960 722</a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground">
              {t('explore')}
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/gallery"
                className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {t('shopInstruments')}
              </Link>
              <Link
                href="/#story"
                className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {t('ourStory')}
              </Link>
              <Link
                href="/faq"
                className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
              >
                {t('contact')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="footer" />
              <span className="text-xs">{t('madeIn')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

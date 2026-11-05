'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'

const EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2297.182700509798!2d24.716556180426746!3d46.78803265679634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474a37a96979b5f7%3A0x62dde59b74d861!2sPaul%20Simon%20-%20Musical%20Instruments!5e0!3m2!1sen!2sro!4v1770140892439!5m2!1sen!2sro'
const MAPS_URL = 'https://maps.app.goo.gl/X7xWDstAb8NBT6eTA'

/**
 * Google Maps loads only after a click: the embed sends the visitor's IP to Google and can set
 * cookies, which the site has no consent for. The privacy policy describes this behaviour.
 */
export function MapEmbed({ title }: { title: string }) {
  const t = useTranslations('contact.mapConsent')
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        src={EMBED_URL}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    )
  }

  return (
    <div className="flex h-[450px] flex-col items-center justify-center gap-4 bg-muted/40 px-6 text-center">
      <MapPin className="h-8 w-8 text-accent" aria-hidden="true" />
      <p className="max-w-md text-sm text-muted-foreground">
        {t('notice')}{' '}
        <Link href="/privacy#cookies" className="text-accent underline underline-offset-2">
          {t('privacy')}
        </Link>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => setLoaded(true)} className="cursor-pointer">
          {t('load')}
        </Button>
        <Button asChild variant="outline">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            {t('open')}
          </a>
        </Button>
      </div>
    </div>
  )
}

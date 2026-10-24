'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
      language?: string
      theme?: 'auto' | 'light' | 'dark'
    },
  ) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise: Promise<void> | null = null
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('Turnstile failed to load'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

/** True when the page must collect a Turnstile token before submitting. */
export const turnstileRequired = Boolean(SITE_KEY)

/**
 * Cloudflare Turnstile bot check. Calls `onToken` with a token when solved and with null when it
 * expires or fails. Renders nothing when no site key is configured (local development).
 * Change `resetKey` to force a fresh challenge (e.g. after the server rejected a token).
 */
export function TurnstileWidget({
  onToken,
  resetKey = 0,
}: {
  onToken: (token: string | null) => void
  resetKey?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken
  const locale = useLocale()
  const t = useTranslations('common')
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          callback: (token) => {
            setUnavailable(false)
            onTokenRef.current(token)
          },
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => {
            onTokenRef.current(null)
            setUnavailable(true)
          },
          language: locale,
          theme: 'light',
        })
      })
      .catch(() => {
        onTokenRef.current(null)
        setUnavailable(true)
      })
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [locale])

  useEffect(() => {
    if (resetKey && widgetId.current && window.turnstile) {
      onTokenRef.current(null)
      window.turnstile.reset(widgetId.current)
    }
  }, [resetKey])

  if (!SITE_KEY) return null
  return (
    <div>
      <div ref={ref} className="min-h-[65px]" />
      {unavailable && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {t('captchaUnavailable')}
        </p>
      )}
    </div>
  )
}

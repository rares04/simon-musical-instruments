'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { Play, Pause } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Instrument } from '@/payload-types'
import { getMediaUrlForSrc, getMediaSrc, getMediaUrl } from '@/lib/media-utils'

type InstrumentCardWithAudioProps = {
  instrument: Instrument
}

// Global audio manager to ensure only one audio plays at a time
let currentlyPlayingAudio: HTMLAudioElement | null = null
let currentlyPlayingCallback: (() => void) | null = null

export function InstrumentCardWithAudio({ instrument }: InstrumentCardWithAudioProps) {
  const t = useTranslations('instruments')
  const isSold = instrument.status === 'sold'
  const imageUrl = getMediaUrlForSrc(instrument.mainImage)
  const audioUrl = getMediaUrl(instrument.audioSample)
  const formattedAudioUrl = audioUrl ? getMediaSrc(audioUrl) : null

  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return t('available')
      case 'in-build':
        return t('inBuild')
      case 'reserved':
        return t('reserved')
      case 'sold':
        return t('sold')
      default:
        return status
    }
  }

  const getTypeLabel = (type: string | null | undefined) => {
    if (!type) return ''
    switch (type) {
      case 'violin':
        return t('violin')
      case 'viola':
        return t('viola')
      case 'cello':
        return t('cello')
      case 'contrabass':
        return t('contrabass')
      default:
        return type
    }
  }

  // Stable callback for when this card's audio stops
  const handleStop = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        if (currentlyPlayingAudio === audioRef.current) {
          currentlyPlayingAudio = null
          currentlyPlayingCallback = null
        }
      }
    }
  }, [])

  // Stop audio when mouse leaves the card
  useEffect(() => {
    if (!isHovered && isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (currentlyPlayingAudio === audioRef.current) {
        currentlyPlayingAudio = null
        currentlyPlayingCallback = null
      }
    }
  }, [isHovered, isPlaying])

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!formattedAudioUrl) return

    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio(formattedAudioUrl)
      audio.volume = 0.7
      audioRef.current = audio

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        if (currentlyPlayingAudio === audio) {
          currentlyPlayingAudio = null
          currentlyPlayingCallback = null
        }
      })

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e)
        setIsPlaying(false)
      })
    }

    const audio = audioRef.current

    if (isPlaying) {
      // Pause this audio
      audio.pause()
      setIsPlaying(false)
      if (currentlyPlayingAudio === audio) {
        currentlyPlayingAudio = null
        currentlyPlayingCallback = null
      }
    } else {
      // Stop any currently playing audio from other cards
      if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
        currentlyPlayingAudio.pause()
        if (currentlyPlayingCallback) {
          currentlyPlayingCallback()
        }
      }

      // Play this audio
      audio.play().catch((error) => {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
      currentlyPlayingAudio = audio
      currentlyPlayingCallback = handleStop
    }
  }

  const statusLabel = getStatusLabel(instrument.status)
  const typeLabel = getTypeLabel(instrument.instrumentType)

  return (
    <Link
      href={`/gallery/${instrument.slug || instrument.id}`}
      className="group block transition-transform hover:scale-[1.02] cursor-pointer"
      aria-label={`View details for ${instrument.title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className={`space-y-4 ${isSold ? 'opacity-60' : ''}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={instrument.title}
              fill
              className={`object-cover transition-all duration-500 ${isSold ? 'grayscale' : 'group-hover:scale-105'}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">{t('noImage')}</span>
            </div>
          )}

          {/* Audio Play Button Overlay - Only show if audio exists */}
          {formattedAudioUrl && (
            <button
              onClick={handlePlayClick}
              className={`absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-background hover:scale-110 ${
                isHovered || isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
              title={isPlaying ? 'Pause audio preview' : 'Play audio preview'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-accent" />
              ) : (
                <Play className="h-5 w-5 text-accent ml-0.5" />
              )}
            </button>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {isSold ? (
              <Badge
                variant="secondary"
                className="bg-muted-foreground/80 text-background backdrop-blur-sm"
              >
                {statusLabel}
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="bg-accent text-accent-foreground backdrop-blur-sm"
              >
                {statusLabel}
              </Badge>
            )}
          </div>
        </div>

        {/* Instrument Details */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold text-foreground leading-tight text-balance">
              {instrument.title}
            </h3>
            <p className="text-base font-medium text-foreground whitespace-nowrap">
              €{instrument.price.toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {[instrument.specs?.bodyWood, instrument.specs?.topWood].filter(Boolean).join(' / ') ||
              t('handcraftedInstrument')}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{typeLabel}</span>
            {instrument.model && (
              <>
                <span>•</span>
                <span>{instrument.model}</span>
              </>
            )}
            <span>•</span>
            <span>{instrument.year || new Date(instrument.createdAt).getFullYear()}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

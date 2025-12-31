import type { Media } from '@/payload-types'

/**
 * Gets the URL from a Payload Media object
 * Works for both images and audio files
 *
 * @param media - Payload Media object, ID number, or null/undefined
 * @returns The media URL string or null if not available
 */
export function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'number') return null
  return media.url || null
}

/**
 * Gets a properly formatted media URL for use in src attributes
 * Handles both full URLs (S3) and relative paths
 * Works for both images and audio files
 *
 * @param url - Raw URL from Payload media object
 * @returns Formatted URL ready for use in src attributes
 */
export function getMediaSrc(url: string | null): string | null {
  if (!url) return null

  // If it's already a full URL (http/https) or absolute path, use it as-is
  if (url.startsWith('http') || url.startsWith('/')) {
    return url
  }

  // For relative paths, proxy through Payload's media API
  // This handles cases where files might be served locally during development
  return `/api/media/file/${url}`
}

/**
 * Convenience function to get a media URL and format it for use in src attributes
 * Combines getMediaUrl and getMediaSrc for common use cases
 *
 * @param media - Payload Media object, ID number, or null/undefined
 * @returns Formatted URL ready for use in src attributes, or null if not available
 */
export function getMediaUrlForSrc(media: number | Media | null | undefined): string | null {
  const url = getMediaUrl(media)
  return getMediaSrc(url)
}

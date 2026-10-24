import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, publicReadOptOut } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  // Public reads stay public with admin 2FA on (see src/access).
  custom: publicReadOptOut,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Disable local storage - files go to S3/Supabase Storage
    disableLocalStorage: true,
    // Explicit allowlist: photos, audio demos and short videos. No SVG, XML, HTML or other types.
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/aac',
      'audio/wav',
      'audio/x-wav',
      'audio/ogg',
      'video/mp4',
    ],
  },
}

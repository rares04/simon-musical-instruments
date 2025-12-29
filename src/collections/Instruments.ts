import type { CollectionConfig } from 'payload'
import { autoTranslateInstrument } from '@/hooks/autoTranslate'

export const Instruments: CollectionConfig = {
  slug: 'instruments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'instrumentType', 'status', 'price', 'createdAt'],
    listSearchableFields: ['title', 'slug'],
  },
  hooks: {
    afterChange: [autoTranslateInstrument],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const roles = (user as { roles?: string[] } | null)?.roles
      return Boolean(roles?.includes('admin'))
    },
    update: ({ req: { user } }) => {
      const roles = (user as { roles?: string[] } | null)?.roles
      return Boolean(roles?.includes('admin'))
    },
    delete: ({ req: { user } }) => {
      const roles = (user as { roles?: string[] } | null)?.roles
      return Boolean(roles?.includes('admin'))
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.title) {
              return siblingData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'instrumentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Violin', value: 'violin' },
        { label: 'Viola', value: 'viola' },
        { label: 'Cello', value: 'cello' },
        { label: 'Contrabass', value: 'contrabass' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'In Build', value: 'in-build' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Sold', value: 'sold' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Price in EUR (€)',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 1900,
      max: 2100,
      admin: {
        position: 'sidebar',
        description: 'Year crafted',
      },
    },
    {
      name: 'luthierNotes',
      type: 'textarea',
      label: "Luthier's Notes",
      localized: true,
      admin: {
        description: 'Detailed description of the instrument for product pages',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery Images',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'audioSample',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'audio' },
      },
      admin: {
        description: 'Upload an audio demo (MP3 recommended)',
      },
    },
    {
      name: 'specs',
      type: 'group',
      label: 'Specifications',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'bodyWood',
              type: 'text',
              label: 'Body Wood',
              admin: { width: '50%' },
            },
            {
              name: 'topWood',
              type: 'text',
              label: 'Top Wood',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'neckWood',
              type: 'text',
              label: 'Neck Wood',
              admin: { width: '50%' },
            },
            {
              name: 'fingerboardWood',
              type: 'text',
              label: 'Fingerboard',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'varnish',
              type: 'text',
              label: 'Varnish',
              admin: { width: '50%' },
            },
            {
              name: 'strings',
              type: 'text',
              label: 'Strings',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'bodyLength',
          type: 'text',
          label: 'Body Length',
          admin: {
            description: 'e.g., 356mm for violin, 755mm for cello',
          },
        },
      ],
    },
  ],
}

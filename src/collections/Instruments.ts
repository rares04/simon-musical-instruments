import type { CollectionConfig } from 'payload'

export const Instruments: CollectionConfig = {
  slug: 'instruments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'price', 'createdAt'],
    listSearchableFields: ['title', 'slug'],
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
        description: 'Price in USD',
      },
    },
    {
      name: 'description',
      type: 'richText',
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
      label: 'Luthier Specifications',
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
              name: 'fretboardWood',
              type: 'text',
              label: 'Fretboard Wood',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'scaleLength',
              type: 'text',
              label: 'Scale Length',
              admin: {
                width: '50%',
                description: 'e.g., 25.5"',
              },
            },
            {
              name: 'radius',
              type: 'text',
              label: 'Fretboard Radius',
              admin: {
                width: '50%',
                description: 'e.g., 12"',
              },
            },
          ],
        },
        {
          name: 'pickups',
          type: 'text',
          label: 'Pickups',
          admin: {
            description: 'e.g., Seymour Duncan JB/Jazz Set',
          },
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (lbs)',
          min: 0,
        },
      ],
    },
  ],
}

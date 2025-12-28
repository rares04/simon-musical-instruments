import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => {
          const roles = (user as { roles?: string[] } | null)?.roles
          return Boolean(roles?.includes('admin'))
        },
      },
    },
  ],
}

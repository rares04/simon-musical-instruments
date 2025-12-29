import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'provider', 'roles', 'createdAt'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'image',
      type: 'text',
      label: 'Profile Image URL',
      admin: {
        description: 'Avatar URL from OAuth provider',
      },
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Email/Password', value: 'credentials' },
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Apple', value: 'apple' },
      ],
      defaultValue: 'credentials',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'providerId',
      type: 'text',
      label: 'OAuth Provider ID',
      admin: {
        position: 'sidebar',
        description: 'Unique ID from the OAuth provider',
        readOnly: true,
      },
      index: true,
    },
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
      admin: {
        position: 'sidebar',
      },
      access: {
        update: ({ req: { user } }) => {
          const roles = (user as { roles?: string[] } | null)?.roles
          return Boolean(roles?.includes('admin'))
        },
      },
    },
    // Shipping address for faster checkout
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Default Shipping Address',
      admin: {
        condition: (data) => data?.provider !== undefined, // Only show for saved users
      },
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'street2',
          type: 'text',
          label: 'Apt/Suite',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State/Province',
        },
        {
          name: 'postalCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    // Saved addresses for quick checkout
    {
      name: 'savedAddresses',
      type: 'array',
      label: 'Saved Addresses',
      admin: {
        description: 'Multiple addresses for flexible shipping options',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., Home, Work, Studio',
          },
        },
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'apartment',
          type: 'text',
          label: 'Apt/Suite (Optional)',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'state',
              type: 'text',
              required: true,
              label: 'State/Province',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'zip',
              type: 'text',
              required: true,
              label: 'Postal Code',
              admin: { width: '50%' },
            },
            {
              name: 'country',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          label: 'Set as Default',
          defaultValue: false,
        },
      ],
    },
  ],
}

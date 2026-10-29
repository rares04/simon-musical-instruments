import type { CollectionConfig } from 'payload'
import {
  adminOnlyApiLogin,
  ensureFirstUserIsAdmin,
  hasAdminRole,
  isAdmin,
  isAdminField,
  isAdminOrSelf,
  serverOnlyField,
} from '@/access'
import { decryptTotpSecretAfterRead, encryptTotpSecretBeforeChange } from '@/lib/totp-secret'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'provider', 'emailVerified', 'roles', 'createdAt'],
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    // Payload's defaults, made explicit. Setting 0 would drop the lockout columns (schema change).
    maxLoginAttempts: 5,
    lockTime: 600_000,
  },
  access: {
    admin: ({ req: { user } }) => hasAdminRole(user),
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    // Admin 2FA (payload-totp, see payload.config.ts): the authenticator secret is encrypted at rest.
    afterRead: [decryptTotpSecretAfterRead],
    beforeChange: [ensureFirstUserIsAdmin, encryptTotpSecretBeforeChange],
    beforeLogin: [adminOnlyApiLogin],
  },
  fields: [
    // Overrides the built-in auth email field: only admins may set or change it over the API.
    {
      name: 'email',
      type: 'email',
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    // Email verification fields
    {
      name: 'emailVerified',
      type: 'checkbox',
      label: 'Email Verified',
      defaultValue: false,
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
        description: 'Whether the user has verified their email address',
      },
    },
    {
      name: 'otp',
      type: 'text',
      label: 'OTP Code',
      access: {
        read: serverOnlyField,
        create: serverOnlyField,
        update: serverOnlyField,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'One-time password for email verification',
        condition: (data) => Boolean(data?.otp),
      },
    },
    {
      name: 'otpExpiry',
      type: 'date',
      label: 'OTP Expiry',
      access: {
        read: serverOnlyField,
        create: serverOnlyField,
        update: serverOnlyField,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'When the OTP expires',
        condition: (data) => Boolean(data?.otpExpiry),
      },
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
        // { label: 'Facebook', value: 'facebook' }, // Not implemented for now
        // { label: 'Apple', value: 'apple' }, // Not implemented for now
      ],
      defaultValue: 'credentials',
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'providerId',
      type: 'text',
      label: 'OAuth Provider ID',
      access: {
        create: isAdminField,
        update: isAdminField,
      },
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
        create: isAdminField,
        update: isAdminField,
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

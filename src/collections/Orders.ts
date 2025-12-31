import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { sendEmail } from '@/lib/resend'
import { ShippingNotificationEmail } from '@/lib/emails'

// Hook to send shipping notification when status changes to 'shipped' (delivery orders only)
const sendShippingNotification: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Only run on update, not create
  if (operation !== 'update') return doc

  // Only send for delivery orders, not pickup
  if (doc.deliveryMethod === 'pickup') return doc

  // Check if status changed to 'shipped'
  if (previousDoc?.status !== 'shipped' && doc.status === 'shipped') {
    const customerEmail = doc.contactInfo?.email
    const customerName =
      `${doc.contactInfo?.firstName || ''} ${doc.contactInfo?.lastName || ''}`.trim()

    if (customerEmail) {
      await sendEmail({
        to: customerEmail,
        subject: `Your Order ${doc.orderNumber} Has Shipped!`,
        react: ShippingNotificationEmail({
          orderNumber: doc.orderNumber,
          customerName: customerName || 'Valued Customer',
          items:
            doc.items?.map((item: { title: string }) => ({
              title: item.title,
            })) || [],
          trackingNumber: doc.trackingNumber || undefined,
          trackingUrl: doc.trackingUrl || undefined,
          estimatedDelivery: doc.estimatedDelivery || undefined,
          shippingAddress: {
            street: doc.shippingAddress?.street || '',
            apartment: doc.shippingAddress?.apartment || '',
            city: doc.shippingAddress?.city || '',
            state: doc.shippingAddress?.state || '',
            zip: doc.shippingAddress?.zip || '',
            country: doc.shippingAddress?.country || '',
          },
        }),
      })
    }
  }

  return doc
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'paymentMethod', 'total', 'createdAt'],
    group: 'Shop',
  },
  hooks: {
    afterChange: [sendShippingNotification],
  },
  access: {
    // Admins can do everything
    read: ({ req: { user } }) => {
      if (!user) return false
      const roles = (user as { roles?: string[] })?.roles
      if (roles?.includes('admin')) return true
      // Customers can only read their own orders
      return {
        customer: { equals: user.id },
      }
    },
    create: () => true, // API creates orders
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
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Linked user account (if logged in during purchase)',
      },
    },
    {
      name: 'guestEmail',
      type: 'email',
      admin: {
        description: 'Email for guest checkouts',
        condition: (data) => !data?.customer,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending_payment',
      options: [
        { label: 'Pending Payment', value: 'pending_payment' },
        { label: 'Paid', value: 'paid' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Payment Information
    {
      name: 'paymentMethod',
      type: 'select',
      defaultValue: 'bank_transfer',
      options: [
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Cash (Pickup)', value: 'cash' },
        { label: 'Card (Stripe)', value: 'card' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How the customer will pay',
      },
    },
    {
      name: 'paymentReference',
      type: 'text',
      admin: {
        description: 'Bank transfer reference, transaction ID, or other payment identifier',
        condition: (data) => data?.status !== 'pending_payment',
      },
    },
    // Shipping/Tracking Information
    {
      name: 'deliveryMethod',
      type: 'select',
      required: true,
      defaultValue: 'delivery',
      options: [
        { label: 'Door-to-Door Delivery', value: 'delivery' },
        { label: 'Pickup from Atelier', value: 'pickup' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How the customer will receive their instrument',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        description: 'Carrier tracking number',
        condition: (data) =>
          data?.deliveryMethod === 'delivery' &&
          ['processing', 'shipped', 'delivered'].includes(data?.status),
      },
    },
    {
      name: 'trackingUrl',
      type: 'text',
      admin: {
        description: 'Full tracking URL (optional)',
        condition: (data) =>
          data?.deliveryMethod === 'delivery' &&
          ['processing', 'shipped', 'delivered'].includes(data?.status),
      },
    },
    {
      name: 'estimatedDelivery',
      type: 'text',
      admin: {
        description: 'Estimated delivery date (e.g., "January 15-17, 2025")',
        condition: (data) =>
          data?.deliveryMethod === 'delivery' &&
          ['processing', 'shipped', 'delivered'].includes(data?.status),
      },
    },
    {
      name: 'pickupDate',
      type: 'text',
      admin: {
        description: 'Scheduled pickup date/time (e.g., "January 15, 2025 at 10:00 AM")',
        condition: (data) =>
          data?.deliveryMethod === 'pickup' &&
          ['processing', 'shipped', 'delivered'].includes(data?.status),
      },
    },
    {
      name: 'shippedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) =>
          data?.deliveryMethod === 'delivery' && ['shipped', 'delivered'].includes(data?.status),
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'instrument',
          type: 'relationship',
          relationTo: 'instruments',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Snapshot of instrument title at time of purchase',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price at time of purchase (EUR)',
          },
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      admin: {
        description: 'Only required for delivery orders (not pickup)',
        condition: (data) => data?.deliveryMethod !== 'pickup',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'apartment',
          type: 'text',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              admin: { width: '50%' },
            },
            {
              name: 'state',
              type: 'text',
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
              admin: { width: '50%' },
            },
            {
              name: 'country',
              type: 'text',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    /**
     * STRIPE DISABLED: paymentIntentId is now optional.
     * When Stripe payments are re-enabled, this field stores the Stripe PaymentIntent ID.
     * For bank transfer orders, this field will be empty.
     */
    {
      name: 'paymentIntentId',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Stripe PaymentIntent ID (empty for bank transfer orders)',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Sum of item prices (EUR)',
      },
    },
    {
      name: 'shipping',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Shipping cost (EUR) - typically 0 as delivery is included in price',
      },
    },
    {
      name: 'insurance',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Insurance cost (EUR) - typically 0 as insurance is included in price',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total amount (EUR)',
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.status !== 'pending_payment',
      },
    },
    {
      name: 'customerRemarks',
      type: 'textarea',
      admin: {
        description: 'Customer notes, special requests, or personalization wishes',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the order',
      },
    },
  ],
}

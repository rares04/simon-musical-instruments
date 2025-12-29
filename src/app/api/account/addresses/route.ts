import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

type SavedAddress = NonNullable<User['savedAddresses']>[number]

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const payload = await getPayload({ config })

    // Get current user
    const user = await payload.findByID({
      collection: 'users',
      id: session.user.id,
      depth: 0,
    })

    const currentAddresses = (user.savedAddresses || []) as SavedAddress[]

    // If this is set as default, unset others
    if (body.isDefault) {
      currentAddresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Add new address
    const updatedAddresses = [...currentAddresses, { ...body, id: Date.now().toString() }]

    // Update user
    await payload.update({
      collection: 'users',
      id: session.user.id,
      data: {
        savedAddresses: updatedAddresses,
      },
    })

    return NextResponse.json({
      success: true,
      addresses: updatedAddresses,
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...addressData } = await req.json()
    const payload = await getPayload({ config })

    // Get current user
    const user = await payload.findByID({
      collection: 'users',
      id: session.user.id,
      depth: 0,
    })

    let updatedAddresses = (user.savedAddresses || []) as SavedAddress[]

    // If setting this as default, unset others
    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    }

    // Update the specific address
    updatedAddresses = updatedAddresses.map((addr) =>
      addr.id === id ? { ...addr, ...addressData } : addr,
    )

    // Update user
    await payload.update({
      collection: 'users',
      id: session.user.id,
      data: {
        savedAddresses: updatedAddresses,
      },
    })

    return NextResponse.json({
      success: true,
      addresses: updatedAddresses,
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Get current user
    const user = await payload.findByID({
      collection: 'users',
      id: session.user.id,
      depth: 0,
    })

    // Remove address
    const updatedAddresses = (user.savedAddresses || []).filter(
      (addr) => addr.id !== addressId,
    )

    // Update user
    await payload.update({
      collection: 'users',
      id: session.user.id,
      data: {
        savedAddresses: updatedAddresses,
      },
    })

    return NextResponse.json({
      success: true,
      addresses: updatedAddresses,
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { customerOrdersWhere } from '@/lib/order-access'
import ReactPDF from '@react-pdf/renderer'
import { InvoicePDF } from '@/lib/pdf/invoice-generator'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const ownOrders = await customerOrdersWhere(payload, session.user.id)
    if (!ownOrders || !/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Only orders this customer may see; anything else looks like "not found".
    const { docs } = await payload.find({
      collection: 'orders',
      where: { and: [{ id: { equals: Number(id) } }, ownOrders] },
      limit: 1,
      depth: 2,
    })
    const order = docs[0]
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Generate PDF - call the component as a function since it returns a Document
    const pdfStream = await ReactPDF.renderToStream(InvoicePDF({ order }))

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk))
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
        // Per-customer document: never let a shared cache (CDN, proxy) store it.
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}

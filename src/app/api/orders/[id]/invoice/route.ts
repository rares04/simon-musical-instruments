import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ReactPDF from '@react-pdf/renderer'
import { InvoicePDF } from '@/lib/pdf/invoice-generator'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Fetch order
    const order = await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
    })

    // Verify user has access to this order
    const customerId = typeof order.customer === 'object' ? order.customer?.id : order.customer
    if (customerId !== Number(session.user.id) && order.guestEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}

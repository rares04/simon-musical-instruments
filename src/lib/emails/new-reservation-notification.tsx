import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

interface OrderItem {
  title: string
  price: number
}

interface NewReservationNotificationEmailProps {
  reservationNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  total: number
  deliveryMethod: 'delivery' | 'pickup'
  shippingAddress?: {
    street: string
    apartment?: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export function NewReservationNotificationEmail({
  reservationNumber,
  customerName,
  customerEmail,
  customerPhone,
  items,
  total,
  deliveryMethod,
  shippingAddress,
}: NewReservationNotificationEmailProps) {
  const isPickup = deliveryMethod === 'pickup'
  const previewText = `New Reservation - ${reservationNumber} from ${customerName}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>🎻 New Reservation</Text>
          </Section>

          {/* Alert Box */}
          <Section style={alertBox}>
            <Heading style={alertHeading}>New instrument reservation received!</Heading>
            <Text style={alertText}>Please contact the customer within 1-2 business days.</Text>
          </Section>

          {/* Reservation Number */}
          <Section style={orderNumberSection}>
            <Text style={orderNumberLabel}>Reservation Number</Text>
            <Text style={orderNumberValue}>{reservationNumber}</Text>
          </Section>

          <Hr style={divider} />

          {/* Customer Information */}
          <Section style={customerSection}>
            <Heading as="h2" style={sectionHeading}>
              Customer Details
            </Heading>
            <Row style={detailRow}>
              <Column style={detailLabel}>Name:</Column>
              <Column style={detailValue}>{customerName}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Email:</Column>
              <Column style={detailValue}>
                <Link href={`mailto:${customerEmail}`} style={link}>
                  {customerEmail}
                </Link>
              </Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Phone:</Column>
              <Column style={detailValue}>
                <Link href={`tel:${customerPhone}`} style={link}>
                  {customerPhone}
                </Link>
              </Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>Delivery:</Column>
              <Column style={detailValue}>
                {isPickup ? 'Pickup from Atelier' : 'Door-to-Door Delivery'}
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Delivery Address (if applicable) */}
          {!isPickup && shippingAddress && (
            <>
              <Section style={addressSection}>
                <Heading as="h2" style={sectionHeading}>
                  Delivery Address
                </Heading>
                <Text style={addressText}>
                  {shippingAddress.street}
                  {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                  <br />
                  {shippingAddress.country}
                </Text>
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Reserved Items */}
          <Section style={itemsSection}>
            <Heading as="h2" style={sectionHeading}>
              Reserved Instruments
            </Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemTitle}>{item.title}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>€{item.price.toLocaleString()}</Text>
                </Column>
              </Row>
            ))}
            <Hr style={dividerLight} />
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>€{total.toLocaleString()}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Action Required */}
          <Section style={actionSection}>
            <Heading as="h2" style={sectionHeading}>
              Action Required
            </Heading>
            <Text style={paragraph}>
              <strong>1.</strong> Contact the customer via email or phone to confirm their
              reservation.
            </Text>
            <Text style={paragraph}>
              <strong>2.</strong> Provide bank transfer details or arrange payment method.
            </Text>
            <Text style={paragraph}>
              <strong>3.</strong> Once payment is confirmed, update the order status in the admin
              panel.
            </Text>
          </Section>

          {/* Quick Actions */}
          <Section style={quickActionsSection}>
            <Row>
              <Column align="center">
                <Link href={`mailto:${customerEmail}`} style={actionButton}>
                  📧 Email Customer
                </Link>
              </Column>
              <Column align="center">
                <Link href={`tel:${customerPhone}`} style={actionButton}>
                  📞 Call Customer
                </Link>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from Simon Musical Instruments
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const logo = {
  fontSize: '28px',
  fontWeight: '600' as const,
  color: '#333',
  margin: '0',
}

const alertBox = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
}

const alertHeading = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#856404',
  margin: '0 0 8px',
}

const alertText = {
  fontSize: '14px',
  color: '#856404',
  margin: '0',
}

const orderNumberSection = {
  backgroundColor: '#fff',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '8px',
  border: '1px solid #ddd',
}

const orderNumberLabel = {
  fontSize: '12px',
  color: '#666',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}

const orderNumberValue = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#333',
  fontFamily: 'monospace',
  margin: '0',
}

const divider = {
  borderColor: '#ddd',
  margin: '24px 0',
}

const dividerLight = {
  borderColor: '#eee',
  margin: '12px 0',
}

const customerSection = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #ddd',
}

const sectionHeading = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#333',
  margin: '0 0 16px',
}

const detailRow = {
  padding: '8px 0',
}

const detailLabel = {
  fontSize: '14px',
  color: '#666',
  width: '80px',
}

const detailValue = {
  fontSize: '14px',
  color: '#333',
  fontWeight: '500' as const,
}

const addressSection = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #ddd',
}

const addressText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333',
  margin: '0',
}

const itemsSection = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #ddd',
}

const itemRow = {
  padding: '10px 0',
}

const itemTitle = {
  fontSize: '15px',
  color: '#333',
  margin: '0',
}

const itemPrice = {
  fontSize: '15px',
  fontWeight: '600' as const,
  color: '#333',
  margin: '0',
}

const totalRow = {
  padding: '12px 0 0',
}

const totalLabel = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#333',
  margin: '0',
}

const totalValue = {
  fontSize: '20px',
  fontWeight: '700' as const,
  color: '#2e7d32',
  margin: '0',
}

const actionSection = {
  backgroundColor: '#e8f5e9',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #c8e6c9',
}

const paragraph = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333',
  margin: '0 0 12px',
}

const quickActionsSection = {
  padding: '20px 0',
}

const actionButton = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500' as const,
  display: 'inline-block',
}

const link = {
  color: '#1976d2',
  textDecoration: 'none',
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0 0',
}

const footerText = {
  fontSize: '12px',
  color: '#999',
  margin: '0',
}

export default NewReservationNotificationEmail

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

interface ShippingItem {
  title: string
}

interface ShippingNotificationEmailProps {
  orderNumber: string
  customerName: string
  items: ShippingItem[]
  trackingNumber?: string
  trackingUrl?: string
  estimatedDelivery?: string
  shippingAddress: {
    street: string
    apartment?: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export function ShippingNotificationEmail({
  orderNumber,
  customerName,
  items,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  shippingAddress,
}: ShippingNotificationEmailProps) {
  const previewText = `Your order ${orderNumber} has shipped!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Simon Musical Instruments</Text>
            <Text style={tagline}>Handcrafted in Reghin, Transylvania</Text>
          </Section>

          {/* Shipping Announcement */}
          <Section style={announcementSection}>
            <Text style={icon}>📦</Text>
            <Heading style={heading}>Your Order Has Shipped!</Heading>
            <Text style={paragraph}>Dear {customerName},</Text>
            <Text style={paragraph}>
              Great news! Your handcrafted instrument has been carefully packaged and is on its way
              to you.
            </Text>
          </Section>

          {/* Order & Tracking Info */}
          <Section style={infoSection}>
            <Row>
              <Column style={infoColumn}>
                <Text style={infoLabel}>Order Number</Text>
                <Text style={infoValue}>{orderNumber}</Text>
              </Column>
              {trackingNumber && (
                <Column style={infoColumn}>
                  <Text style={infoLabel}>Tracking Number</Text>
                  <Text style={infoValue}>{trackingNumber}</Text>
                </Column>
              )}
            </Row>
            {estimatedDelivery && (
              <Row style={estimatedRow}>
                <Column>
                  <Text style={infoLabel}>Estimated Delivery</Text>
                  <Text style={estimatedValue}>{estimatedDelivery}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Track Button */}
          {trackingUrl && (
            <Section style={buttonSection}>
              <Link href={trackingUrl} style={trackButton}>
                Track Your Package
              </Link>
            </Section>
          )}

          <Hr style={divider} />

          {/* Items Shipped */}
          <Section style={itemsSection}>
            <Heading as="h2" style={sectionHeading}>
              What&apos;s in Your Shipment
            </Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                • {item.title}
              </Text>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Shipping Address */}
          <Section style={addressSection}>
            <Heading as="h2" style={sectionHeading}>
              Shipping To
            </Heading>
            <Text style={addressText}>
              {customerName}
              <br />
              {shippingAddress.street}
              {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Important Notes */}
          <Section style={notesSection}>
            <Heading as="h2" style={sectionHeading}>
              Important Information
            </Heading>
            <Text style={paragraph}>
              <strong>Signature Required</strong> — A signature will be required upon delivery to
              ensure your instrument arrives safely.
            </Text>
            <Text style={paragraph}>
              <strong>Inspection</strong> — Please inspect the packaging upon delivery. If
              there&apos;s any visible damage, note it with the carrier before signing.
            </Text>
            <Text style={paragraph}>
              <strong>Climate Acclimation</strong> — Allow your instrument to acclimate to room
              temperature for 24 hours before opening the case, especially in cold weather.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Contact Information */}
          <Section style={contactSection}>
            <Text style={contactHeading}>Questions about your shipment?</Text>
            <Text style={contactText}>
              Email:{' '}
              <Link href="mailto:paul.simon@simoninstruments.com" style={link}>
                paul.simon@simoninstruments.com
              </Link>
            </Text>
            <Text style={contactText}>
              Phone:{' '}
              <Link href="tel:+40744960722" style={link}>
                +40 744 960 722
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Simon Musical Instruments
              <br />
              Strada 1 Decembrie 1918, nr. 8
              <br />
              Reghin, 545300, Romania
            </Text>
            <Text style={footerSubtext}>Crafted with care since 1998</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#faf9f7',
  fontFamily: '"Georgia", "Times New Roman", serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  padding: '20px 0 30px',
}

const logo = {
  fontSize: '24px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0',
}

const tagline = {
  fontSize: '12px',
  color: '#8b8578',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '8px 0 0',
}

const announcementSection = {
  textAlign: 'center' as const,
  padding: '0 0 20px',
}

const icon = {
  fontSize: '48px',
  margin: '0 0 16px',
}

const heading = {
  fontSize: '28px',
  fontWeight: '400' as const,
  color: '#3d3528',
  textAlign: 'center' as const,
  margin: '0 0 20px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#5a5347',
  margin: '0 0 16px',
}

const infoSection = {
  backgroundColor: '#f0ebe3',
  padding: '24px',
  borderRadius: '4px',
  margin: '20px 0',
}

const infoColumn = {
  padding: '0 12px',
}

const infoLabel = {
  fontSize: '12px',
  color: '#8b8578',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
}

const infoValue = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#3d3528',
  fontFamily: 'monospace',
  margin: '0',
}

const estimatedRow = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '1px solid #e0d9ce',
}

const estimatedValue = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#6b5c4c',
  margin: '0',
}

const buttonSection = {
  textAlign: 'center' as const,
  padding: '10px 0 20px',
}

const trackButton = {
  backgroundColor: '#3d3528',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600' as const,
  display: 'inline-block',
}

const divider = {
  borderColor: '#e0d9ce',
  margin: '30px 0',
}

const itemsSection = {
  padding: '0',
}

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0 0 16px',
}

const itemText = {
  fontSize: '16px',
  color: '#5a5347',
  margin: '0 0 8px',
}

const addressSection = {
  padding: '0',
}

const addressText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#5a5347',
  margin: '0',
}

const notesSection = {
  padding: '0',
}

const contactSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const contactHeading = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0 0 12px',
}

const contactText = {
  fontSize: '14px',
  color: '#5a5347',
  margin: '0 0 8px',
}

const link = {
  color: '#6b5c4c',
  textDecoration: 'underline',
}

const footer = {
  textAlign: 'center' as const,
  padding: '30px 0 0',
}

const footerText = {
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#8b8578',
  margin: '0 0 8px',
}

const footerSubtext = {
  fontSize: '11px',
  color: '#a9a095',
  margin: '0',
}

export default ShippingNotificationEmail

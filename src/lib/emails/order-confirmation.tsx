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

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  insurance: number
  total: number
  shippingAddress: {
    street: string
    apartment?: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  shipping,
  insurance,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  const previewText = `Order Confirmed - ${orderNumber}`

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

          {/* Confirmation Message */}
          <Section style={confirmationSection}>
            <Heading style={heading}>Order Confirmed</Heading>
            <Text style={paragraph}>Dear {customerName},</Text>
            <Text style={paragraph}>
              Thank you for your purchase. Your handcrafted instrument is being prepared with the
              utmost care.
            </Text>
          </Section>

          {/* Order Number */}
          <Section style={orderNumberSection}>
            <Text style={orderNumberLabel}>Order Number</Text>
            <Text style={orderNumberValue}>{orderNumber}</Text>
          </Section>

          <Hr style={divider} />

          {/* Order Items */}
          <Section style={itemsSection}>
            <Heading as="h2" style={sectionHeading}>
              Your Instruments
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
          </Section>

          <Hr style={divider} />

          {/* Order Summary */}
          <Section style={summarySection}>
            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>Subtotal</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValue}>€{subtotal.toLocaleString()}</Text>
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>Shipping</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValue}>€{shipping.toLocaleString()}</Text>
              </Column>
            </Row>
            <Row style={summaryRow}>
              <Column>
                <Text style={summaryLabel}>Insurance</Text>
              </Column>
              <Column align="right">
                <Text style={summaryValue}>€{insurance.toLocaleString()}</Text>
              </Column>
            </Row>
            <Hr style={dividerLight} />
            <Row style={summaryRow}>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>€{total.toLocaleString()}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Shipping Address */}
          <Section style={addressSection}>
            <Heading as="h2" style={sectionHeading}>
              Shipping Address
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

          {/* Next Steps */}
          <Section style={nextStepsSection}>
            <Heading as="h2" style={sectionHeading}>
              What Happens Next
            </Heading>
            <Text style={paragraph}>
              <strong>1. Preparation</strong> — Your instrument will be carefully inspected and
              professionally packaged with climate protection.
            </Text>
            <Text style={paragraph}>
              <strong>2. Shipping</strong> — We&apos;ll send your tracking information once your
              package is on its way via FedEx with full insurance.
            </Text>
            <Text style={paragraph}>
              <strong>3. Delivery</strong> — Signature confirmation will be required to ensure
              secure delivery.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Contact Information */}
          <Section style={contactSection}>
            <Text style={contactHeading}>Questions about your order?</Text>
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

const confirmationSection = {
  padding: '0 0 20px',
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

const orderNumberSection = {
  backgroundColor: '#f0ebe3',
  padding: '20px',
  textAlign: 'center' as const,
  borderRadius: '4px',
}

const orderNumberLabel = {
  fontSize: '12px',
  color: '#8b8578',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}

const orderNumberValue = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: '#3d3528',
  fontFamily: 'monospace',
  margin: '0',
}

const divider = {
  borderColor: '#e0d9ce',
  margin: '30px 0',
}

const dividerLight = {
  borderColor: '#e0d9ce',
  margin: '15px 0',
}

const itemsSection = {
  padding: '0',
}

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0 0 20px',
}

const itemRow = {
  padding: '10px 0',
}

const itemTitle = {
  fontSize: '16px',
  color: '#3d3528',
  margin: '0',
}

const itemPrice = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#6b5c4c',
  margin: '0',
}

const summarySection = {
  padding: '0',
}

const summaryRow = {
  padding: '6px 0',
}

const summaryLabel = {
  fontSize: '14px',
  color: '#8b8578',
  margin: '0',
}

const summaryValue = {
  fontSize: '14px',
  color: '#5a5347',
  margin: '0',
}

const totalLabel = {
  fontSize: '16px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0',
}

const totalValue = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: '#6b5c4c',
  margin: '0',
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

const nextStepsSection = {
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

export default OrderConfirmationEmail

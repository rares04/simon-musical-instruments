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

interface InquiryItem {
  title: string
  price: number
}

interface InquiryReceivedEmailProps {
  customerName: string
  customerEmail: string
  items: InquiryItem[]
  message?: string
  total: number
}

export function InquiryReceivedEmail({
  customerName,
  customerEmail: _customerEmail,
  items,
  message,
  total,
}: InquiryReceivedEmailProps) {
  const previewText = `Thank you for your inquiry - Simon Musical Instruments`

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
            <Heading style={heading}>Inquiry Received</Heading>
            <Text style={paragraph}>Dear {customerName},</Text>
            <Text style={paragraph}>
              Thank you for your interest in our handcrafted instruments. We have received your
              inquiry and will respond within 1-2 business days.
            </Text>
            <Text style={paragraph}>
              Each of our instruments is a unique work of art, and we&apos;re happy to discuss
              specifications, customization options, or arrange a consultation.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Inquiry Summary */}
          <Section style={summarySection}>
            <Heading as="h2" style={sectionHeading}>
              Your Inquiry
            </Heading>

            {/* Items of Interest */}
            <Text style={subheading}>Instruments of Interest</Text>
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

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Estimated Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>€{total.toLocaleString()}</Text>
              </Column>
            </Row>

            {/* Message if provided */}
            {message && (
              <>
                <Text style={subheading}>Your Message</Text>
                <Section style={messageBox}>
                  <Text style={messageText}>{message}</Text>
                </Section>
              </>
            )}
          </Section>

          <Hr style={divider} />

          {/* What to Expect */}
          <Section style={nextStepsSection}>
            <Heading as="h2" style={sectionHeading}>
              What to Expect
            </Heading>
            <Text style={paragraph}>
              <strong>Personal Response</strong> — Paul or Ecaterina Simon will personally review
              your inquiry and respond with detailed information.
            </Text>
            <Text style={paragraph}>
              <strong>Consultation Available</strong> — We offer phone or video consultations to
              discuss your needs and help you find the perfect instrument.
            </Text>
            <Text style={paragraph}>
              <strong>Custom Options</strong> — If you have specific requirements, we can discuss
              custom builds and personalization.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Contact Information */}
          <Section style={contactSection}>
            <Text style={contactHeading}>Can&apos;t wait to hear back?</Text>
            <Text style={paragraph}>Feel free to reach out directly:</Text>
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

const divider = {
  borderColor: '#e0d9ce',
  margin: '30px 0',
}

const summarySection = {
  padding: '0',
}

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0 0 20px',
}

const subheading = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#6b5c4c',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
}

const itemRow = {
  padding: '8px 0',
}

const itemTitle = {
  fontSize: '16px',
  color: '#3d3528',
  margin: '0',
}

const itemPrice = {
  fontSize: '16px',
  color: '#6b5c4c',
  margin: '0',
}

const totalRow = {
  padding: '16px 0 24px',
  borderTop: '1px solid #e0d9ce',
  marginTop: '12px',
}

const totalLabel = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#3d3528',
  margin: '0',
}

const totalValue = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#6b5c4c',
  margin: '0',
}

const messageBox = {
  backgroundColor: '#f0ebe3',
  padding: '16px',
  borderRadius: '4px',
}

const messageText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#5a5347',
  margin: '0',
  fontStyle: 'italic' as const,
}

const nextStepsSection = {
  padding: '0',
}

const contactSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const contactHeading = {
  fontSize: '16px',
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

export default InquiryReceivedEmail

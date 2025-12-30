import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactFormEmailProps {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export function ContactFormEmail({ name, email, phone, subject, message }: ContactFormEmailProps) {
  const contactPageUrl = 'https://simoninstruments.com/en/contact'

  return (
    <Html>
      <Head />
      <Preview>Mesaj nou de la {name} prin formularul de contact</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Mesaj Nou din Formularul de Contact</Heading>

          <Section style={section}>
            <Text style={label}>Subiect</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>De la</Text>
            <Text style={value}>{name}</Text>
            <Text style={subValue}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
            {phone && <Text style={subValue}>Telefon: {phone}</Text>}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Mesaj</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Acest mesaj a fost trimis prin{' '}
            <Link href={contactPageUrl} style={footerLink}>
              formularul de contact
            </Link>{' '}
            de pe simoninstruments.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f4f0',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '32px 40px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const h1 = {
  color: '#3d3428',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 24px',
}

const section = {
  margin: '20px 0',
}

const label = {
  color: '#6b5c4c',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
}

const value = {
  color: '#3d3428',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
}

const subValue = {
  color: '#6b5c4c',
  fontSize: '14px',
  margin: '4px 0 0',
}

const link = {
  color: '#b87333',
  textDecoration: 'none',
}

const messageStyle = {
  color: '#3d3428',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e8e4dc',
  margin: '24px 0',
}

const footer = {
  color: '#9a8c7a',
  fontSize: '12px',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}

const footerLink = {
  color: '#b87333',
  textDecoration: 'underline',
}

export default ContactFormEmail

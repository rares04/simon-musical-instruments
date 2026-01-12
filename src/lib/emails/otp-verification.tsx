import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface OtpVerificationEmailProps {
  firstName?: string
  otp: string
  expiryMinutes?: number
  locale?: string
}

const translations: Record<string, any> = {
  en: {
    title: 'Verify Your Email',
    preview: 'Your verification code is {otp}',
    greeting: 'Hi {name},',
    intro:
      'Thank you for creating an account with Simon Musical Instruments. To complete your registration, please enter the verification code below:',
    expiry: 'This code will expire in {minutes} minutes.',
    ignore: "If you didn't create an account with us, you can safely ignore this email.",
    team: '— The Simon Musical Instruments Team',
    location: 'Reghin, Transylvania',
  },
  ro: {
    title: 'Verifică-ți adresa de email',
    preview: 'Codul tău de verificare este {otp}',
    greeting: 'Bună {name},',
    intro:
      'Îți mulțumim pentru crearea unui cont la Simon Musical Instruments. Pentru a finaliza înregistrarea, te rugăm să introduci codul de verificare de mai jos:',
    expiry: 'Acest cod va expira în {minutes} minute.',
    ignore: 'Dacă nu ai creat un cont la noi, poți ignora acest email în siguranță.',
    team: '— Echipa Simon Musical Instruments',
    location: 'Reghin, Transilvania',
  },
  de: {
    title: 'E-Mail Verifizieren',
    preview: 'Ihr Verifizierungscode ist {otp}',
    greeting: 'Hallo {name},',
    intro:
      'Vielen Dank für die Erstellung eines Kontos bei Simon Musical Instruments. Um Ihre Registrierung abzuschließen, geben Sie bitte den unten stehenden Verifizierungscode ein:',
    expiry: 'Dieser Code läuft in {minutes} Minuten ab.',
    ignore:
      'Wenn Sie kein Konto bei uns erstellt haben, können Sie diese E-Mail einfach ignorieren.',
    team: '— Das Team von Simon Musical Instruments',
    location: 'Reghin, Siebenbürgen',
  },
  fr: {
    title: 'Vérifiez Votre E-mail',
    preview: 'Votre code de vérification est {otp}',
    greeting: 'Bonjour {name},',
    intro:
      "Merci d'avoir créé un compte chez Simon Musical Instruments. Pour finaliser votre inscription, veuillez saisir le code de vérification ci-dessous :",
    expiry: 'Ce code expirera dans {minutes} minutes.',
    ignore:
      "Si vous n'avez pas créé de compte chez nous, vous pouvez ignorer cet e-mail en toute sécurité.",
    team: "— L'équipe Simon Musical Instruments",
    location: 'Reghin, Transylvanie',
  },
  nl: {
    title: 'E-mail Verifiëren',
    preview: 'Uw verificatiecode is {otp}',
    greeting: 'Hallo {name},',
    intro:
      'Bedankt voor het aanmaken van een account bij Simon Musical Instruments. Om uw registratie te voltooien, voert u de onderstaande verificatiecode in:',
    expiry: 'Deze code verloopt over {minutes} minuten.',
    ignore: 'Als u geen account bij ons heeft aangemaakt, kunt u deze e-mail veilig negeren.',
    team: '— Het Simon Musical Instruments Team',
    location: 'Reghin, Transsylvanië',
  },
  el: {
    title: 'Επαληθεύστε το Email σας',
    preview: 'Ο κωδικός επαλήθευσης είναι {otp}',
    greeting: 'Γεια σας {name},',
    intro:
      'Σας ευχαριστούμε για τη δημιουργία λογαριασμού στη Simon Musical Instruments. Για να ολοκληρώσετε την εγγραφή σας, εισαγάγετε τον παρακάτω κωδικό επαλήθευσης:',
    expiry: 'Αυτός ο κωδικός θα λήξει σε {minutes} λεπτά.',
    ignore:
      'Εάν δεν δημιουργήσατε λογαριασμό σε εμάς, μπορείτε να αγνοήσετε με ασφάλεια αυτό το email.',
    team: '— Η ομάδα της Simon Musical Instruments',
    location: 'Reghin, Τρανσυλβανία',
  },
  ja: {
    title: 'メールアドレスの確認',
    preview: '認証コードは {otp} です',
    greeting: '{name} 様',
    intro:
      'Simon Musical Instrumentsのアカウントを作成いただきありがとうございます。登録を完了するには、以下の認証コードを入力してください。',
    expiry: 'このコードの有効期限は {minutes} 分です。',
    ignore: 'アカウントを作成した覚えがない場合は、このメールを無視してください。',
    team: '— Simon Musical Instruments チーム',
    location: 'ルーマニア、レギン',
  },
  ko: {
    title: '이메일 인증',
    preview: '인증 코드는 {otp} 입니다',
    greeting: '{name}님, 안녕하세요.',
    intro:
      'Simon Musical Instruments 계정을 생성해 주셔서 감사합니다. 가입을 완료하려면 아래 인증 코드를 입력해 주세요.',
    expiry: '이 코드는 {minutes}분 후에 만료됩니다.',
    ignore: '계정을 생성하지 않으셨다면 이 이메일을 무시하셔도 됩니다.',
    team: '— Simon Musical Instruments 팀',
    location: '루마니아 레긴',
  },
}

export function OtpVerificationEmail({
  firstName = 'there',
  otp,
  expiryMinutes = 10,
  locale = 'en',
}: OtpVerificationEmailProps) {
  // Use English if locale not found
  const t = translations[locale] || translations.en

  // Split OTP into individual digits for display
  const otpDigits = otp.split('')

  return (
    <Html>
      <Head />
      <Preview>{t.preview.replace('{otp}', otp)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{t.title}</Heading>

          <Text style={greeting}>{t.greeting.replace('{name}', firstName)}</Text>

          <Text style={paragraph}>{t.intro}</Text>

          <Section style={codeContainer}>
            <table style={codeTable} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {otpDigits.map((digit, index) => (
                    <td key={index} style={codeCell}>
                      <span style={codeDigit}>{digit}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Section>

          <Text style={expiryText}>{t.expiry.replace('{minutes}', String(expiryMinutes))}</Text>

          <Hr style={hr} />

          <Text style={paragraph}>{t.ignore}</Text>

          <Text style={footer}>
            {t.team}
            <br />
            {t.location}
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
  padding: '40px 48px',
  borderRadius: '8px',
  maxWidth: '480px',
}

const h1 = {
  color: '#3d3428',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const greeting = {
  color: '#3d3428',
  fontSize: '16px',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#6b5c4c',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const codeContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const codeTable = {
  margin: '0 auto',
  borderCollapse: 'separate' as const,
  borderSpacing: '8px',
}

const codeCell = {
  backgroundColor: '#f6f4f0',
  border: '2px solid #e8e4dc',
  borderRadius: '8px',
  width: '48px',
  height: '56px',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
}

const codeDigit = {
  color: '#3d3428',
  fontSize: '28px',
  fontWeight: '700',
  fontFamily: 'monospace, "Courier New", Courier',
  letterSpacing: '0',
}

const expiryText = {
  color: '#b87333',
  fontSize: '14px',
  fontWeight: '500',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const hr = {
  borderColor: '#e8e4dc',
  margin: '24px 0',
}

const footer = {
  color: '#9a8c7a',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}

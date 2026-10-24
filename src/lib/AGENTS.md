# src/lib: auth, integrations, emails, PDF

## Files

| File | What | Notes |
|---|---|---|
| `auth.ts` | Auth.js v5 config: `handlers`, `auth`, `signIn`, `signOut` | Google (`checks: ['nonce']`) + Credentials via `payload.login()`. JWT sessions. `trustHost: true`. Custom pages `/login`, `/register` |
| `auth-guard.ts` | `requireAuth()` redirects to `/login?callbackUrl=/account` | Only used by the account dashboard |
| `cart-context.tsx` | Client cart (React context) | In memory only (K-9) |
| `resend.ts` | Lazy Resend client + `sendEmail({to, subject, react})` → `{success, data \| error}` | Never throws. **Callers must check `success`** |
| `deepl.ts` | `translateText`, `translateTexts` (EN → ro/de/fr/nl/ja/ko/el) | Returns the input unchanged on any error. Failures are silent apart from `console.error` |
| `emails/*.tsx` | React Email templates | See the table in `docs/domain-and-business-logic.md` §8. Only `otp-verification` takes `locale` |
| `pdf/invoice-generator.tsx` | `@react-pdf/renderer` document for the order "invoice" | Hard-coded English. Shows an "Insurance (2%)" label even though insurance is 0. Not a fiscal invoice |
| `media-utils.ts` | `getMediaUrl`, `getMediaSrc`, `getMediaUrlForSrc` | Handles `number \| Media \| null` relationships. Prefixes relative filenames with `/api/media/file/` |
| `order-types.ts` | `OrderStatus` incl. legacy `'pending'` | **Unused.** Delete it, or derive from `payload-types` |
| `utils.ts` | `cn()` (clsx + tailwind-merge) | shadcn helper |

## Auth.js specifics (`auth.ts`)

- **Credentials `authorize`**
  - Refuses accounts that haven't verified their email, then delegates to `payload.login()`.
  - The login page calls `/api/auth/check-verification` and redirects to `/verify-email`.
- **Google `signIn` callback**
  - Finds or creates the Payload user for the Google account, then sets `user.id` to the Payload id
    (as a string).
  - Account-linking rules are under review in the private security audit. Get a review before
    changing them.
- **`jwt` callback** copies `id, firstName, lastName, phone, roles, shippingAddress` into the token
  at sign-in.
- **`session` callback** re-reads the user from Payload **on every call**: one DB query per
  `auth()`/`useSession()`.
- **Identity changes** (email, password, linked providers) are security-sensitive. Any change here
  needs a review against the private audit.
- Type augmentation lives in `src/types/next-auth.d.ts`.

## Rules

- Server-only modules (`auth.ts`, `resend.ts`, `deepl.ts`, `pdf/*`) must never be imported from a
  `'use client'` file. Add `import 'server-only'` when you touch them.
- New third-party clients follow the lazy-singleton pattern in `resend.ts` and `deepl.ts`, so
  `next build` works without secrets.
- New emails:
  - Build on a shared layout. Extracting one is planned.
  - Accept `locale`.
  - Keep copy in a per-locale dictionary, not inline English.
- Business constants (Paul's email, phone, address, reservation limit) belong in one config module,
  not scattered literals.

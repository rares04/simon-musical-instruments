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
| `otp.ts` | Email codes: CSPRNG generation, HMAC storage (`v2:<attempts>:<sends>:<window>:<hmac>`), attempt limit, resend interval, daily cap, compare-and-set updates (`swapOtp`) | Server-only. The code itself is never stored |
| `order-access.ts` | `customerOrdersWhere()`, `toCustomerOrder()` | Server-only. The single rule for which orders a customer may see |
| `session-version.ts` | `passwordFingerprint()` | Stored in the Auth.js token at sign-in and checked in the `jwt` callback: a password change or reset ends every session |
| `safe-redirect.ts` | `safeCallbackPath()` | Use for any redirect target taken from the URL |
| `rate-limit.ts` | In-process per-IP limiter (`limitByIp`, `LIMITS`, `clientIp`) | One replica, so memory is shared. Client IP comes from `X-Real-IP` (Railway's edge sets it) |
| `turnstile.ts` | `verifyTurnstile()` | Fails closed when `TURNSTILE_SECRET_KEY` is set; skipped when it isn't (local dev) |
| `reservations.ts` | Atomic claim/release of instruments, 72 h hold expiry (`scheduleHoldSweep`), `errorSummary()` | Logs `holds:` / `orders:` lines with order numbers only. Log DB errors with `errorSummary()`: their `message` embeds query parameters (customer data) |

## Auth.js specifics (`auth.ts`)

- **Credentials `authorize`**
  - Refuses accounts that haven't verified their email, then delegates to `payload.login()` (Local
    API; REST login is admin-only).
  - The login page calls `/api/auth/check-verification` (with the password) and redirects to
    `/verify-email`. Passwords are never put in URLs.
- **Google `signIn` callback**
  - Finds or creates the Payload user for the Google account, then sets `user.id` to the Payload id
    (as a string).
  - Requires Google's `email_verified`. New Google users are created verified.
  - Linking to an existing account by email: never for admin accounts. It marks the email verified,
    and if the account wasn't verified before, replaces its password with a random one.
  - Get a security review before changing these rules.
- **`jwt` callback** copies `id, firstName, lastName, phone, roles, shippingAddress` into the token
  at sign-in.
- **`session` callback** re-reads the user from Payload **on every call**: one DB query per
  `auth()`/`useSession()`.
- **Identity changes** (email, password, linked providers) are security-sensitive. Any change here
  needs a review against the private audit.
- Type augmentation lives in `src/types/next-auth.d.ts`.

## Rules

- Server-only modules (`auth.ts`, `resend.ts`, `deepl.ts`, `pdf/*`) must never be imported from a
  `'use client'` file. Add `import 'server-only'` when you touch them, **except** in modules that
  collections or `payload.config.ts` import (e.g. `reservations.ts`): Payload's CLI loads those
  outside Next, where `server-only` throws.
- New third-party clients follow the lazy-singleton pattern in `resend.ts` and `deepl.ts`, so
  `next build` works without secrets.
- New emails:
  - Build on a shared layout. Extracting one is planned.
  - Accept `locale`.
  - Keep copy in a per-locale dictionary, not inline English.
- Business constants (Paul's email, phone, address, reservation limit) belong in one config module,
  not scattered literals.

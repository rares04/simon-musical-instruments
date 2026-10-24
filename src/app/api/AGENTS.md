# src/app/api: custom route handlers

These are the storefront's own endpoints. Payload's generated REST lives in
`src/app/(payload)/api`; don't edit those. Next.js matches these more-specific paths before Payload's
`[...slug]` catch-all.

## Rules for every handler

1. **Treat the request body as hostile.**
   - Identity comes from `await auth()` (`@/lib/auth`) and nowhere else.
   - Never use a `userId`, `email`, `price` or `total` sent by the client.
   - Re-derive prices from the DB, as `create-reservation` does.
2. **The Local API skips access control by default.** Either:
   - pass `user` + `overrideAccess: false`, or
   - put ownership into the `where` clause: `{ customer: { equals: session.user.id } }`.
   - How guest orders are matched to accounts is under review in the private audit. Don't copy the
     existing pattern into new routes.
3. **Validate input with a schema** (zod), not ad-hoc checks. Return `400` with field errors.
   Escape any user text that goes into HTML emails (React Email escapes by default; raw HTML strings
   don't).
4. **Protect public endpoints that cause side effects** (email, reservations, OTP) with rate
   limiting and bot protection. See `docs/known-issues.md` K-2.
5. **Multi-write operations run in a transaction.** Create a `req` with `createLocalReq` (or reuse
   one) and pass it to every Payload call. Use conditional updates for availability.
6. **Side effects after a commit** (emails) go through a job with retries, not fire-and-forget
   promises. Check `sendEmail()`'s `{ success }`.
7. Use the error shape `{ error: string }` and the right status code. Log with context: route,
   order number, user id. Never log OTPs, passwords or tokens.

## Inventory

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `health` | GET | none | Static `{status:'ok'}`. Doesn't check the DB |
| `register` | POST | none | Create a credentials user (`emailVerified:false`) |
| `auth/[...nextauth]` | GET/POST | — | Auth.js handlers |
| `auth/send-otp` | POST | none | Generate and email a 6-digit code (10 min) |
| `auth/verify-otp` | POST | none | Check the code and set `emailVerified` |
| `auth/check-verification` | POST | none | Tell the login page whether to redirect to `/verify-email` |
| `account/profile` | GET/PATCH | session | Read and update the session user's profile fields. Identity fields are security-sensitive; see `src/lib/AGENTS.md` |
| `account/addresses` | POST/PATCH/DELETE | session | Manage `savedAddresses` |
| `account/password` | POST | session | **Broken** (K-7). Rewrite to use `payload.login` + `payload.update({password})` |
| `account/orders` | GET | session | The user's orders, depth 2 |
| `account/active-orders` | GET | session | Header bell: non-terminal orders |
| `account/reservation-count` | GET | optional | `pending_payment` count vs the limit (2) |
| `checkout/create-reservation` | POST | optional | Core reservation flow; see `docs/domain-and-business-logic.md` §4 |
| `contact` | POST | none | Email Paul (Romanian template) |
| `orders/[id]/invoice` | GET | session + ownership | PDF "invoice" (not a fiscal invoice) by numeric order id |

## Shared constants that should be centralised

- `RESERVATION_LIMIT = 2`: defined in `create-reservation` and `account/reservation-count`, and
  defaulted in the checkout UI.
- `paul.simon@simoninstruments.com`: hard-coded as a recipient in `contact` and
  `create-reservation`. Use a `NOTIFY_EMAIL` env var or a Payload settings global.

# 0003. Auth.js v5 for storefront auth, alongside Payload auth

- **Status**: Accepted; to be revisited (roadmap Phase 2, Decision 3)
- **Date**: 2025-12-29 (retroactive record)

## Context

Customers wanted "Sign in with Google" plus email/password. Payload 3 has no built-in OAuth
provider, and its auth is designed around the admin panel.

## Decision

- Use **Auth.js (`next-auth@5` beta)** for the storefront:
  - Google provider.
  - Credentials provider that delegates to `payload.login()`.
  - JWT sessions.
- Customers and admins share the Payload `users` collection, with `roles: admin | user`.
- Email verification is a custom 6-digit OTP flow (`/api/auth/send-otp`, `/api/auth/verify-otp`), not
  Payload's `verify`.
- Facebook and Apple providers are coded but disabled.

## Consequences

- **Two session systems** to reason about (`payload-token` and the Auth.js JWT), and one user table
  shared by customers and admins. Admin-panel access therefore depends on getting `access.admin` and
  collection access exactly right.
- Custom route handlers re-implement profile, password and address management on top of the Local
  API.
- Auth.js v5 never left beta. The project moved into maintenance under the Better Auth team in 2025.
  Long-term, plan to consolidate (Payload-native customer auth, or Better Auth).

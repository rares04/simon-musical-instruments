# 0001. Payload CMS 3, embedded in the Next.js app

- **Status**: Accepted
- **Date**: 2025-12-28 (retroactive record)
- **Deciders**: Rares Astilean

## Context

- The repo began in January–March 2025 as a **Medusa.js** starter: a storefront plus a separate
  backend, with static "presentation pages".
- The shop sells around 20 unique, handmade instruments at a time. The owner needs a simple admin to
  add instruments with photos and audio, and to track a handful of orders.
- A full commerce engine (carts, variants, inventory, a payment-provider abstraction) and a second
  deployable service were more weight than the business needed.

## Decision

- Replace Medusa with **Payload CMS 3**, running inside the same Next.js App Router app (commits
  `b0b126a` → `6e2a1be`).
- Model the commerce entities directly as Payload collections: `instruments`, `orders`, `users`,
  `media`.
- Write storefront pages as React Server Components that query through the Payload Local API.

## Consequences

- **What it gave us**:
  - One deployable and one database.
  - A free, typed admin UI.
  - Localization built in.
  - Generated TypeScript types.
- **What it costs**:
  - Every collection is automatically exposed over REST and GraphQL, so access control must be
    explicit on every collection.
  - The Local API bypasses access by default, so route handlers must enforce ownership themselves.
  - Commerce logic (reservations, stock, order/instrument consistency) is ours to build and test.
- **Follow-ups**:
  - Upgrade off 3.69 (see `docs/roadmap.md` Phase 0).
  - Evaluate Payload v4 once stable.

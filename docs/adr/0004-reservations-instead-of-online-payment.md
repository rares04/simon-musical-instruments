# 0004. Reservation flow instead of online payment

- **Status**: Accepted; revisit (roadmap Phase 2, Decision 1)
- **Date**: 2025-12-30 (retroactive record; commit `648d1e0`)

## Context

- A full Stripe Elements checkout was built first (`create-payment-intent`, `confirm-order`,
  `stripe-payment-form`).
- The owner prefers to talk to every buyer before a €2k–€10k sale. Bank transfer is the norm, and
  buyers often visit the workshop.

## Decision

- **Disable online payment.**
  - Stripe routes return `501`.
  - The Stripe code is kept commented out for later.
- Checkout instead creates an order with `status: pending_payment` (a "reservation"):
  - It marks the instruments `reserved`.
  - It emails the customer and Paul.
  - Payment is arranged personally: bank transfer for delivery, cash for pickup.
- **Limit**: 2 pending reservations per customer.
- Instruments with no price ("price on request", 2026-03) can't be reserved at all. They route to the
  contact form.

## Consequences

- Fits how the business sells, and avoids PCI, chargebacks and fees.
- Reservations are free and unauthenticated, so they need abuse protection and **expiry**; neither
  exists yet.
- Fulfilment is entirely manual. Order status and instrument status drift unless Paul updates both.
- The dead Stripe code and the Stripe-era UI states add maintenance noise.

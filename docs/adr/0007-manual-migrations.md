# 0007. Database migrations applied manually, not on deploy

- **Status**: Accepted; revisit when CI exists
- **Date**: 2026-03-03 (retroactive record; commits `38ebd81` → `c02ab9b`)

## Context

- Payload's Postgres adapter pushes schema automatically in development. Production must use
  migrations.
- Running `payload migrate && next start` as the start command was tried and reverted the same day.
  The reason isn't recorded. Likely causes: the migration step failing, or blocking at boot, on the
  pooled connection.

## Decision

- Developers create migrations with `pnpm payload migrate:create`.
- Someone applies them to production by hand with `pnpm payload migrate`, using the production
  `DATABASE_URL`, **before** merging the code that depends on them.

## Consequences

- No automated guarantee that schema and code match at deploy time.
- The person migrating handles production credentials locally. That is risky, and it combines badly
  with dev-mode schema push if the URL is reused by mistake.
- One migration (`20260303_000000`) was written by hand without a snapshot, so the next generated
  migration re-emits its change. It is harmless.
- **Follow-up**: run `payload migrate` as a gated CI/CD step (or a Railway pre-deploy command) with a
  backup taken first.

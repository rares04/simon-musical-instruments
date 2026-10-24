# Architecture Decision Records

Short records of significant decisions: context, decision, consequences.

- ADRs 0001–0007 were written **retroactively** on 2026-10-24, from git history and code. They
  describe decisions as they were made, not as recommendations. Superseding decisions get a new ADR
  that links back.
- **When to write one:** any change to a framework, vendor, data model, auth, payments, hosting or a
  cross-cutting convention.
- **Format:** copy `0000-template.md`, take the next number, keep it under one page.

| # | Decision | Status |
|---|---|---|
| [0001](0001-payload-cms-embedded-in-nextjs.md) | Payload CMS 3, embedded in the Next.js app (replacing the Medusa starter) | Accepted |
| [0002](0002-supabase-postgres-and-storage.md) | Supabase Postgres + Supabase Storage via the S3 API | Accepted |
| [0003](0003-authjs-for-storefront-auth.md) | Auth.js v5 for storefront auth, alongside Payload auth | Accepted; revisit (see roadmap Phase 2) |
| [0004](0004-reservations-instead-of-online-payment.md) | Reservation flow instead of online payment | Accepted; revisit |
| [0005](0005-railway-hosting-dynamic-rendering.md) | Railway + Railpack hosting; DB pages render dynamically | Accepted; partially superseded by the caching work in the roadmap |
| [0006](0006-eight-locales-with-deepl.md) | 8 locales with next-intl + DeepL auto-translation | Accepted |
| [0007](0007-manual-migrations.md) | Migrations applied manually, not on deploy | Accepted; revisit with CI |

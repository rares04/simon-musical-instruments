# Simon Musical Instruments: Engineering Guide

> Canonical guide for humans and AI agents working in this repo. `CLAUDE.md` is a symlink to this
> file. Subdirectories carry their own `AGENTS.md` (+ `CLAUDE.md` symlink) with local rules.
> Last full audit: **2026-10-24**.

## 1. What this is

The website and reservation shop of **Paul & Ecaterina Simon**, a two-person luthier workshop in
Reghin, Transylvania (Romania's "City of Violins"), founded 2014. Live at
**https://simoninstruments.com**.

- **Sells**: one-of-a-kind, handmade violins, violas, cellos and double basses. Live prices range
  from about €1,700 to €7,500. Some instruments are "price on request".
- **No online payment.** Stripe code exists but is disabled. A customer **reserves** an instrument,
  Paul contacts them within 1–2 business days, and payment happens by bank transfer (delivery) or
  cash (pickup at the atelier).
- **Content operations**: Paul adds instruments himself in the Payload admin (`/admin`), using phone
  photos. He fulfils orders by changing order status in the admin.
- **8 locales**: en (default), ro, de, fr, nl, ja, ko, el. UI strings live in `messages/*.json`.
  Product text is machine-translated by DeepL when an instrument is created.

## 2. Read this before you change anything

1. **Every Payload collection is a public API.** Each collection is served at `/api/<slug>` (REST).
   GraphQL is disabled; keep it that way. Collection `access` functions are the only thing guarding
   that API.
   - Payload's default for any missing access function is "any logged-in user may do it".
   - The admin panel default is "any user in the `users` collection may log in".
   - Every collection must define `create/read/update/delete` explicitly. `users` must also define
     `admin`. Use the shared helpers in `src/access/`.
   - Only admins can get a Payload session over REST (a `beforeLogin` hook). Customers sign in
     through Auth.js only.
   - The Local API (`payload.find` etc.) **bypasses access control** unless you pass
     `overrideAccess: false`.
   - Security hardening is required before new feature work. Findings are tracked privately, not in
     this public repo. Ask the maintainer.
2. **There are two auth systems.**
   - **Payload auth** protects `/admin`, using the `payload-token` cookie.
   - **Auth.js v5 (`next-auth@5 beta`)** handles the storefront session: a JWT cookie, with Google
     OAuth and email/password.
   - Both use the same Payload `users` collection. See `src/lib/AGENTS.md`.
3. **Pushing to `main` deploys to production** (Railway auto-deploy). CI (type-check, lint, unit
   tests, build, migrations, smoke tests) runs on every PR, but it is **not a required check**: there
   is no branch protection, so a red PR can still be merged. Work on a branch, open a PR, and wait
   for green. See `docs/workflow.md`.
4. **Never run `pnpm dev` against the production database.**
   - In development, the Payload Postgres adapter **pushes schema changes directly** to whatever
     database `DATABASE_URL` points at.
   - Production schema changes go through migrations only. See `src/migrations/AGENTS.md`.
5. **Any code that changes an instrument must pass `context: { skipAutoTranslate: true }`**, unless
   you want DeepL to re-translate it.
6. **Money is EUR.** `instruments.price` is nullable: `null` means "price on request" and the
   instrument cannot be reserved. Orders snapshot the title and price at reservation time.
7. **Every user-facing string goes through next-intl, in all 8 locale files.** See
   `messages/AGENTS.md`.
8. **The repo is public on GitHub.** Never commit secrets, customer data, or exploit details.

## 3. Stack

| Layer | Choice | Version (pinned) | Notes |
|---|---|---|---|
| Framework | Next.js App Router | 16.4.3 | React 19.3.1, Turbopack; `src/proxy.ts` (Next 16's name for middleware) handles canonical host + i18n |
| CMS / backend | Payload CMS | 3.92.0 | Embedded in the same Next app; admin at `/admin`, REST at `/api/*` |
| Database | PostgreSQL (Supabase) | `@payloadcms/db-postgres` | Supabase project `eedkygcxohpnjayapcjt`, eu-west-1, via the session pooler |
| Media | Supabase Storage (S3 API) | `@payloadcms/storage-s3` | Bucket `media`. Served through the app at `/api/media/file/*` |
| Storefront auth | Auth.js (next-auth) | 5.0.0-beta.32 | Google + Credentials providers, JWT sessions |
| i18n | next-intl | ^4.6 | `localePrefix: 'always'`, Accept-Language detection |
| UI | Tailwind CSS v4 + shadcn/ui (new-york) + Radix | 4.1 | Tokens in `src/app/(frontend)/globals.css` |
| Email | Resend + React Email | resend ^6.6 | Sends from `paul.simon@simoninstruments.com`, `send.` subdomain |
| Translation | DeepL API | deepl-node ^1.24 | `afterChange` hook on instrument create |
| PDF | @react-pdf/renderer | ^4.3 | "Invoice" download (not a legal fiscal invoice) |
| Payments | Stripe | ^20.1 | **Disabled.** The Stripe API routes were removed; the package is kept for a future online-payment path |
| Runtime | Node 24 | `.nvmrc` 24.22.1 | pnpm 10.29.2; Payload 3.92 needs Node ≥22.23.4 or ≥24.22.1 |
| Hosting | Railway (Railpack builder) | n/a | Region **europe-west4** (next to the database). `railway.toml` for now; Infrastructure-as-Code is in progress. Healthcheck `/api/health` checks the database |
| DNS / registrar / mailbox | Hostinger | n/a | Apex A record points to Railway. `www` is an ALIAS to the same Railway domain and redirects to the apex |

## 4. Repo map

```
src/
  payload.config.ts        Payload config: collections, locales, Postgres, S3 plugin
  proxy.ts                 301 to canonical host, trailing-slash strip, next-intl routing
  access/                  Shared access-control helpers (isAdmin, isAdminOrSelf, …)
  collections/             Users, Media, Instruments, Orders            → AGENTS.md
  hooks/autoTranslate.ts   DeepL afterChange hook for instruments
  migrations/              Payload Postgres migrations (+ JSON snapshots) → AGENTS.md
  app/
    (frontend)/[locale]/   Storefront pages (home, gallery, product, checkout, account, auth) → AGENTS.md
    (payload)/             Payload admin + REST (GraphQL disabled). Generated; do not edit
    api/                   Custom route handlers (checkout, account, auth OTP, contact) → AGENTS.md
  components/              Storefront components + components/ui (shadcn) → AGENTS.md
  lib/                     auth (Auth.js), resend, deepl, emails/, pdf/, cart context → AGENTS.md
  i18n/                    next-intl routing/config/request
  payload-types.ts         Generated. Run `pnpm generate:types`
messages/                  UI translations, one JSON per locale → AGENTS.md
scripts/seed-instruments.ts  Demo seed. Destructive; local only
public/gallery/            Static workshop photos used by home + /photos
docs/                      Architecture, business logic, infra, design system, ADRs, roadmap
```

## 5. Commands

Use the pinned pnpm through Corepack (`corepack enable && corepack prepare pnpm@10.29.2 --activate`).
pnpm 11+ ignores `pnpm.onlyBuiltDependencies` and writes a `pnpm-workspace.yaml`. Do not commit that
file.

| Task | Command |
|---|---|
| Install | `pnpm install --frozen-lockfile` |
| Dev server | `pnpm dev` (port 3000; see `docs/local-development.md` for a local DB) |
| Type-check | `pnpm exec tsc --noEmit` |
| Lint | `pnpm lint` (ESLint CLI; 0 errors, warnings only) |
| Build | `pnpm build` |
| Regenerate types after a schema change | `pnpm generate:types` |
| Regenerate the admin import map after adding admin components | `pnpm generate:importmap` |
| Create a migration | `pnpm payload migrate:create <name>` |
| Apply migrations | `pnpm payload migrate` |
| Tests | `pnpm test:int` (Vitest 4 unit tests) and `pnpm test:e2e` (Playwright smoke tests: needs a migrated database and a running app, see `.github/workflows/ci.yml`) |

## Development workflow (short version)

Branch → PR → CI green → self-review → merge to `main` (**auto-deploys to Railway**) → watch the
deploy → validate live → roll back if broken (redeploy the previous Railway deployment, or
`git revert`). Migrations: backup first, apply before merging code that needs them. The repo is
public: never push secrets. Full version: `docs/workflow.md`.

## 6. Core flows (one line each; details in `docs/domain-and-business-logic.md`)

- **Browse**: `/[locale]/gallery` loads up to 100 instruments server-side and filters client-side by
  type and price. `/[locale]/gallery/[slug-or-id]` is the product page.
- **Reserve**:
  1. Add to cart. The cart is React state only and does not survive a reload.
  2. `/checkout` posts to `POST /api/checkout/create-reservation`.
  3. That creates an `orders` row with `status: pending_payment`, sets each instrument to `reserved`,
     and emails the customer and Paul.
  4. Limit: 2 pending reservations per user or email.
- **Fulfil** (manual, in `/admin`): Paul moves the order through
  `pending_payment → paid → processing → shipped → delivered`. Moving to `shipped` emails tracking
  info (delivery orders only).
  - **Instrument status is not updated automatically when an order changes.** Paul sets it to `sold`
    by hand, or back to `available` after a cancellation.
- **Accounts**:
  - Register with email and password, then confirm with a 6-digit OTP email.
  - Or sign in with Google.
  - `/account` shows orders, profile, addresses and a PDF download.
- **Contact**: `/contact` posts to `POST /api/contact`, which emails Paul in Romanian.

## 7. Conventions

- TypeScript strict. Import alias `@/*` points to `src/*`, and `@payload-config` points to the
  config.
- Prettier: single quotes, no semicolons, trailing commas, width 100.
- Files are kebab-case and components are PascalCase named exports.
- Prefer Server Components. Add `'use client'` only for state, effects or handlers.
  - Several pages are needlessly client-side today, which hurts SEO and performance.
- Use `Link`, `useRouter` and `redirect` from `@/i18n/routing`, not `next/link` or
  `next/navigation`, so the locale prefix is preserved.
- Use shadcn primitives from `@/components/ui`. Style with semantic tokens (`bg-background`,
  `text-accent`, …), never raw colors. See `src/components/AGENTS.md`.
- Commit messages are Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`).
- After a schema change:
  1. `pnpm generate:types`
  2. `pnpm payload migrate:create <name>`
  3. Commit the `.ts` + `.json` + `index.ts` together.

## 8. Environment variables

The authoritative list is in `.env.example`. Required in production: `DATABASE_URL`,
`PAYLOAD_SECRET`, `AUTH_SECRET`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY`,
`S3_SECRET_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`DEEPL_API_KEY`. Stripe keys are only needed if payments are re-enabled.

## 9. Known sharp edges (non-security; full list in `docs/known-issues.md`)

- Database-backed pages are rendered per request (`force-dynamic`, `cache-control: no-store`).
  Optimized images are cached at the Railway edge; the HTML is not.
- Slugs are hand-typed (`Cello-4-4(10)`).
- Production's `payload_migrations` has a leftover `dev` row, so `payload migrate` stops at an
  interactive "data loss will occur, proceed?" prompt until that row is removed (K-26).
- No staging environment. The staging Supabase project is paused. Local dev needs a local Postgres.
- Dependabot and CI audits are on, but a new critical advisory fails CI for every PR until it is
  fixed (`pnpm audit --audit-level=critical`).

## 10. Where to read next

| Doc | What's in it |
|---|---|
| `docs/README.md` | Index and reading order |
| `docs/workflow.md` | Branch → PR → CI → merge = deploy → validate live → rollback; migrations |
| `docs/architecture.md` | System diagram, request lifecycle, rendering, auth, data flow |
| `docs/domain-and-business-logic.md` | Instruments, reservations, orders, emails, roles, state machines |
| `docs/infrastructure-and-operations.md` | Railway, Supabase, DNS, vendors, env vars, deploys, runbooks |
| `docs/local-development.md` | Tested local setup with Postgres |
| `docs/design-system.md` | Brand, tokens, typography, components, imagery, voice |
| `docs/known-issues.md` | Bugs and tech debt, ranked |
| `docs/roadmap.md` | Plan to take the site to a best-in-class level |
| `docs/adr/` | Architecture decision records (retroactive) |
| `docs/reference/payload-cms-rules.md`, `.cursor/rules/` | Generic Payload CMS patterns (template) |

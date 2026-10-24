# Local development

Tested end-to-end on 2026-10-24 (macOS, Node 24.15, Postgres 17).

The steps below were run against an empty local database:

- **Migrate:** all 6 migrations applied cleanly.
- **Start:** `pnpm dev` started without errors.
- **Pages:** `/en`, `/en/gallery`, `/en/faq`, `/en/contact` and `/admin` all returned 200.

> **Do not** point a local `pnpm dev` at the production database.
> - In dev mode, Payload pushes schema changes straight to whatever `DATABASE_URL` points at.
> - The staging Supabase project is paused. A local Postgres is the only safe database.

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node | 22.23.4+ or 24.22.1+ | Payload 3.92 requires it (`engines`); `.nvmrc` pins 24. Node 20 is EOL as of 2026-04-30 |
| pnpm | 10.29.2 via Corepack | `corepack enable && corepack prepare pnpm@10.29.2 --activate`. pnpm ≥11 ignores the `onlyBuiltDependencies` allow-list and creates `pnpm-workspace.yaml`; don't commit that file |
| PostgreSQL | 15+ | Docker, Homebrew or Postgres.app |

`docker-compose.yml` in the repo starts a local Postgres 17 (`docker compose up -d`, then
`DATABASE_URL=postgresql://simon:simon@localhost:5432/simon`). Homebrew or Postgres.app work too.

## 2. Start a database

**Docker**

```bash
docker run -d --name simon-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=simon_local postgres:17
# DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/simon_local
```

**Homebrew** (no Docker)

```bash
brew install postgresql@17 && brew services start postgresql@17
createdb simon_local
# DATABASE_URL=postgres://$(whoami)@127.0.0.1:5432/simon_local
```

## 3. Configure, migrate, run

1. Install dependencies.

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Create your env file.

   ```bash
   cp .env.example .env
   ```

3. Edit `.env`:
   - Set `DATABASE_URL` to your local DB.
   - Set `PAYLOAD_SECRET` and `AUTH_SECRET` to the output of `openssl rand -base64 32`.

4. Create the schema with migrations, not dev push, so your DB matches production.

   ```bash
   pnpm payload migrate
   ```

5. Start the dev server.

   ```bash
   pnpm dev
   ```

6. Open http://localhost:3000/admin and create the first user. Then give that user the `admin` role
   in the sidebar, if it isn't set already.

What works without third-party keys:

| Feature | Needs |
|---|---|
| Browse pages, admin CRUD on text fields | Nothing beyond the DB |
| Image/audio upload | `S3_*` pointing at a reachable bucket. With the current values, **uploads fail** because the staging bucket is gone. Use a personal Supabase project, or a MinIO container plus the S3 vars |
| Emails (OTP, reservation, contact) | `RESEND_API_KEY`. Without it, `sendEmail` logs an error and the request continues. Registration can't be completed, because the OTP never arrives |
| Google login | `GOOGLE_CLIENT_ID/SECRET` with `http://localhost:3000/api/auth/callback/google` as a redirect URI |
| Translations | `DEEPL_API_KEY`. Without it, the hook is skipped |

## 4. Seed data

`pnpm seed` runs `scripts/seed-instruments.ts`.

- It **deletes all orders and all instruments**, then creates 6 demo instruments with 8-locale
  titles and notes.
- It uploads images from `public/seed/`, so it needs working `S3_*` credentials.
- Run it only against a local or throwaway database.
- The script has no environment guard. Adding one is in the roadmap.

## 5. Everyday commands

```bash
pnpm exec tsc --noEmit          # type-check (currently clean)
pnpm lint                       # ESLint (0 errors, warnings only)
pnpm generate:types             # after any collection/field change
pnpm generate:importmap         # after adding admin custom components
pnpm payload migrate:status     # what's applied
pnpm payload migrate:create x   # new migration from schema diff
```

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `ENOTFOUND tenant/user postgres.ognzjmnrelsefcqacroe not found` | `.env` still points at the paused staging Supabase. Use a local DB |
| `payload migrate` hangs on "…data loss will occur. Would you like to proceed?" | A `dev` row (batch −1) in `payload_migrations`: scripts that start Payload in dev mode (seed, `getPayload` in `tsx`) write it. Answer `y` (Payload then ignores that row and runs the pending migrations), or run scripts with `NODE_ENV=production`. Never run against a database you care about without a backup |
| Payload asks "Do you want to push the schema?" or warns about dev push | You're in dev mode against a DB that was migrated. Answer no, and keep using migrations |
| `ERR_PNPM_IGNORED_BUILDS` / new `pnpm-workspace.yaml` | Wrong pnpm major. Switch to 10.29.2 through Corepack and delete the generated file |
| A new migration contains `ALTER COLUMN "price" DROP NOT NULL` | Known: `20260303_000000_make_instrument_price_optional` was written by hand without a JSON snapshot. The statement is harmless (a no-op on an already-nullable column). Keep it in the generated migration; its snapshot fixes the drift |
| Fonts look like the system font | The `next/font` variable names in `[locale]/layout.tsx` no longer match the `@theme` stacks in `globals.css` (see `design-system.md` §3) |

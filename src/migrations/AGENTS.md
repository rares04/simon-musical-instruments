# src/migrations: Payload Postgres migrations

These files are the only sanctioned way to change the production schema.

## Golden rules

1. **Never let dev-mode push touch a shared database.**
   - `@payloadcms/db-postgres` auto-pushes schema when `NODE_ENV !== 'production'`.
   - Run `pnpm dev` only against a local or throwaway DB. See `docs/local-development.md`.
2. **Generate, don't hand-write.** Use `pnpm payload migrate:create <snake_name>`. It writes:
   - `<timestamp>_<name>.ts` (up and down SQL),
   - `<timestamp>_<name>.json` (a schema snapshot, used to diff the next migration),
   - an entry in `index.ts`.

   Commit all three together.
3. **If you must hand-write a migration** (data backfills, for example):
   - Create it with `migrate:create` anyway, so the snapshot stays in sync.
   - Then edit the `up`/`down` bodies.
   - Keep `down` reversible, or explicitly a no-op with a comment saying why.
4. **Migrations are immutable once applied to production.** Fix forward with a new migration.
5. **New tables need row-level security.** A migration that creates a table must also run
   `ALTER TABLE "<table>" ENABLE ROW LEVEL SECURITY;` in `up`. Production keeps RLS on for every
   `public` table, so Supabase's Data API can't read them. Payload's role owns the tables and isn't
   affected.

## Applying to production (manual today; see ADR-0007)

1. Take a backup:
   `pg_dump "$PROD_DATABASE_URL" --no-owner -Fc -f backup-$(date +%F).dump`.
2. Check what's pending:
   `DATABASE_URL="$PROD_DATABASE_URL" NODE_ENV=production pnpm payload migrate:status`.
3. Apply:
   `DATABASE_URL="$PROD_DATABASE_URL" NODE_ENV=production pnpm payload migrate`.
4. Merge and deploy the code that needs the new schema.

Use a shell variable, never a line in `.env`, so the production URL can't leak into a later
`pnpm dev`. Additive migrations (new nullable columns or tables) are safe to apply before deploying.
Destructive ones (drop, rename, `NOT NULL`) need a two-step expand → migrate data → contract.

## History

| Migration | Change |
|---|---|
| `20251228_182218_add_instrument_type_and_year` | Initial full schema (users, media, instruments + locales) |
| `20251228_222955_add_orders_collection` | `orders`, `orders_items` |
| `20251230_160250_add_model_and_string_vibration` | `instruments.model`, `specs.stringVibration` |
| `20251230_161607_add_stock_field` | `instruments.stock` |
| `20260112_184331_add_otp_verification_fields` | `users.emailVerified`, `otp`, `otpExpiry` |
| `20260303_000000_make_instrument_price_optional` | `instruments.price` → nullable. **Hand-written, no `.json` snapshot**, so the next generated migration re-emits `ALTER COLUMN "price" DROP NOT NULL` (harmless; keep it) |

Verified 2026-10-24: all six apply cleanly, in order, to an empty Postgres 17 database.

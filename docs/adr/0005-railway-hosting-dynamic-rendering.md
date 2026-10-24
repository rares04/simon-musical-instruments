# 0005. Railway (Railpack) hosting; DB pages render dynamically

- **Status**: Accepted; the caching part is to be superseded (roadmap Phase 1)
- **Date**: 2025-12-29 (retroactive record; commits `5bedf12`, `2197bb0`, `ea64e60`)
- **Update 2026-10-24**: production moved to europe-west4 (next to the database). The `railway.toml` replacement (`.railway/railway.ts`) is in PR #4. The caching part is unchanged.

## Context

- Payload needs a long-running Node server, not edge functions.
- The first Dockerfile build failed because the build container couldn't reach the database (it is
  private to Railway at build time).

## Decision

- Host on **Railway** with the **Railpack** builder.
  - The Dockerfile, then `nixpacks.toml`, were removed.
  - `railway.toml` sets the start command, a `/api/health` healthcheck and the restart policy.
- Mark every DB-reading page `export const dynamic = 'force-dynamic'`, so `next build` never queries
  the DB.
- Pushes to `main` auto-deploy. There is no CI.

## Consequences

- Simple, cheap, long-running hosting that works well for Payload.
- **Nothing is cached**. Every page view renders and queries Postgres (gallery TTFB ~1.7s).
- `railway.toml` (Config as Code) is deprecated, with a hard cutoff on **2026-12-01**. Migrate to
  `.railway/railway.ts`.
- Four Railway projects ended up linked to the repo. Two still deploy on every push.

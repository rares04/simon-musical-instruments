# Simon Musical Instruments

Website and reservation shop for **Paul & Ecaterina Simon**, makers of handmade violins, violas,
cellos and double basses in Reghin, Transylvania.

**Live:** https://simoninstruments.com · **Admin:** https://simoninstruments.com/admin

Built with Next.js 15 (App Router) and Payload CMS 3, on Postgres and Supabase Storage, hosted on
Railway. The site supports 8 languages (en, ro, de, fr, nl, ja, ko, el).

## Quick start

1. Install dependencies with the pinned pnpm.

   ```bash
   corepack enable && corepack prepare pnpm@10.29.2 --activate
   pnpm install --frozen-lockfile
   ```

2. Start a local Postgres. Never point `pnpm dev` at production.

   ```bash
   docker run -d --name simon-pg -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=simon_local postgres:17
   ```

3. Create your env file.

   ```bash
   cp .env.example .env
   ```

4. Edit `.env`:
   - Set `DATABASE_URL` to `postgres://postgres:postgres@127.0.0.1:5432/simon_local`.
   - Set `PAYLOAD_SECRET` and `AUTH_SECRET` to the output of `openssl rand -base64 32`.

5. Apply migrations and start the dev server.

   ```bash
   pnpm payload migrate
   pnpm dev
   ```

6. Open http://localhost:3000. Create the first admin user at `/admin`.

The full setup, including what works without third-party keys, is in
[docs/local-development.md](docs/local-development.md).

## Documentation

| | |
|---|---|
| [AGENTS.md](AGENTS.md) (= `CLAUDE.md`) | Start here: what it is, rules, stack, commands |
| [docs/](docs/README.md) | Architecture, business logic, infrastructure, design system, known issues, roadmap, ADRs |

## Scripts

| Command | What |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Next.js dev / production build / serve |
| `pnpm exec tsc --noEmit` · `pnpm lint` | Type-check · lint |
| `pnpm generate:types` · `pnpm generate:importmap` | Regenerate Payload types · admin import map |
| `pnpm payload migrate:create <name>` · `pnpm payload migrate` | Create · apply DB migrations |
| `pnpm seed` | **Destructive** demo seed (deletes all orders and instruments). Local only |

## Deploying

Pushing to `main` deploys to production on Railway. There's no CI gate yet, so use branches and pull
requests. See [docs/infrastructure-and-operations.md](docs/infrastructure-and-operations.md).

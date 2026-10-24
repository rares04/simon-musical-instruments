# Development workflow

How a change gets from an idea to production. **Merging to `main` deploys to production.**

## 1. The loop

1. **Branch** off `main`: `<topic>` such as `fix/invoice-link`. Never commit to `main`.
2. **Build and check locally** (recommended, not mandatory):
   `pnpm exec tsc --noEmit && pnpm lint && pnpm build`. See `local-development.md` for a local DB.
3. **Open a PR** against `main`. Use Conventional Commits for the title (`feat:`, `fix:`,
   `chore:`, `docs:`). Say what changed, how you verified it, and any deploy steps (migration,
   env var, vendor setting).
4. **CI must be green** (type-check, lint, unit tests, build, migrate, Playwright smoke tests).
   Fix failures on the branch. Do not merge red.
5. **Self-review** the diff on GitHub before merging: no secrets, no stray files, no unrelated
   changes, the PR description matches what you did. Address bot review comments or say why not.
6. **Merge** (squash or merge commit, keep the history readable). Rebase on `main` first if the
   branch is behind.
7. **Watch the deploy.** Railway builds and deploys `main` automatically. Follow it in the
   Railway dashboard (or `railway logs`) until the new deployment is `SUCCESS` and the
   healthcheck (`/api/health`) passes.
8. **Validate live** at https://simoninstruments.com: open the pages and flows your change
   touches (home, gallery, a product page, and anything you edited). Check the browser console.
   Say so in the PR when done.

## 2. Roll back

If production is broken after a deploy, restore service first, then fix forward.

- **Fastest:** in Railway, redeploy the previous successful deployment of the service.
- **Or:** `git revert <merge-commit>` on a branch, open a PR, merge. This redeploys the old code.
- A revert does not undo a database migration. See below.

## 3. Database migrations

Production schema changes go through migrations only, never through dev-mode schema push.

1. Change the schema, then `pnpm generate:types` and `pnpm payload migrate:create <name>`.
   Commit the `.ts`, `.json` snapshot and `index.ts` together.
2. Prefer **additive** migrations (new nullable column, new table, new index) so the old code
   keeps working while the new migration is applied. Drop or rename in a later release.
3. **Take a backup first** and confirm it can be restored.
4. Apply the migration to production **before** merging the code that needs it, until migrations
   run automatically as a Railway pre-deploy command. Never point `pnpm dev` at the production
   database.
5. Only one person creates a migration at a time. If another migration lands first, regenerate
   yours on top of it.

## 4. Review bots

Free review bots may comment on PRs. Treat them as a second pair of eyes: read the comments,
fix what is right, ignore what is not. A bot approving is not a substitute for CI or your own
review.

## 5. The repo is public

Never commit or paste secrets, tokens, `.env` files, customer data, or details of an exploitable
vulnerability (in commits, PR titles and descriptions, issues, or comments). Report security
findings privately to the maintainer. Use placeholders in `.env.example`.

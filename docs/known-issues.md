# Known issues and tech debt

Ranked backlog from the 2026-10-24 audit.

- **Severity**:
  - **P0**: production risk now.
  - **P1**: visible to customers, or a business correctness problem.
  - **P2**: quality or efficiency.
  - **P3**: hygiene.
- **Evidence tags**:
  - *live*: observed on simoninstruments.com.
  - *source*: read in code or in Payload/Next source.
  - *inferred*: reasoned, not reproduced.

> Security-sensitive findings are deliberately **not** listed here, because the repository is
> public. The maintainer holds a private audit. Item K-2 tracks it.

## P0: fix first

### K-1 · Next.js 15.4.10 has published critical advisories *(source: GitHub Advisory DB)*

- **What's affected**: `next@15.4.10` is inside the affected range of these advisories:
  - [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw): Image Optimization
    RCE on glibc Linux. Fixed in 15.5.28 / 16.4.1.
  - [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4): AVIF RCE in the
    optimizer. Fixed in 15.5.24 / 16.3.3.
  - Several high-severity DoS, SSRF and middleware-bypass advisories from 2026.
- **Why it applies here**:
  - The site uses `next/image` with remote patterns.
  - The lockfile pins `sharp` 0.34.x, and the advisory's workaround requires ≥ 0.35.5.
- **Fix**: upgrade to **Payload 3.92 + Next ≥16.4.3** (16.4.0 is affected too). Payload's peer range
  (`>=15.4.11 <15.5 || >=16.3.3 <17`) doesn't allow the patched 15.5 line, so going to 16 is the
  path. See `roadmap.md` Phase 0.
- **Stopgap** (applied 2026-10-24):
  - pnpm override `"sharp": "0.35.5"`.
  - `images.remotePatterns` is empty. Media is same-origin (`/api/media/file/*`).
  - Still open until the upgrade: a Server Actions DoS advisory with no workaround.
- **Effort**: stopgap ~30 min. Full upgrade ~1–2 days including regression testing.

### K-2 · Security hardening (private audit) *(source)*

- The private audit has several findings in access control, abuse protection and the auth flow.
- **Ship these fixes before any new feature work.**
- **Effort**: ~1–2 days for the critical set.

### K-3 · Railway `railway.toml` stops being honoured on 2026-12-01 *(source: Railway docs)*

- **Impact**: the healthcheck, restart policy and start command in `railway.toml` stop applying.
- **Fix**: migrate to `.railway/railway.ts` (Infrastructure as Code).
- **Effort**: ~1 h.

## P1: customer-visible or business correctness

| ID | Issue | Evidence | Fix | Effort |
|---|---|---|---|---|
| K-4 | **Product content isn't translated in production.** `/ro`, `/ja`, … product pages show English titles and notes inside a translated UI | *live*: `GET /api/instruments/26?locale=ro` returns English | **Confirmed root cause: `DEEPL_API_KEY` isn't set in Railway.** Set it, then backfill all instruments with a one-off script that runs the hook with `triggerAutoTranslate`. Long-term: run translation as a job, with human review for RO | 2 h |
| K-5 | **Reservations never expire, and order and instrument status aren't linked.** An abandoned reservation keeps the instrument "reserved" forever. Cancelling or paying an order doesn't update the instrument | *source* | Add `reservedUntil` and a Payload job (`waitUntil` + sweeper) to release holds. Add an `orders` `afterChange` hook that syncs instrument status (cancelled → available, paid → sold) | 1 day |
| K-6 | **Brand fonts never applied.** Playfair and Inter download but don't render; the site uses the system font | *live*: computed `font-family` is `ui-sans-serif` on `h1` and `body` | In `[locale]/layout.tsx`, rename the next/font variables to `--font-inter` / `--font-playfair`, or point `@theme` at `--font-sans`/`--font-serif` without the circular reference. Remove the unused Noto JP/KR, or load them with the right subsets and wire them up per locale | 30 min |
| K-7 | **Fixed 2026-10-24.** ~~Password change is broken for everyone.~~ `/api/account/password` compares against `user.password`, which Payload never stores or returns (it stores pbkdf2 `hash` + `salt`). It always answers "OAuth account". If it ran, it would set the password to a bcrypt-hash string | *source*: `payload/dist/collections/operations/utilities/update.js` | Verify the current password with `payload.login()`, then `payload.update({ data: { password: newPassword } })` and let Payload hash it. Remove `bcryptjs` | 1 h |
| K-8 | **Double-reservation race.** Two buyers who submit at the same moment can both reserve the same unique instrument. The check and the update aren't atomic, and there's no DB transaction | *source* | Use a conditional update (`UPDATE … WHERE status='available'`) or a row lock inside a Payload transaction (`req`). Reject if 0 rows changed | 2 h |
| K-9 | **The cart isn't persisted.** A reload, a new tab or the OAuth redirect empties it | *source* | Persist to `localStorage` (ids only) and re-validate against the API on load | 1 h |
| K-10 | **Silent email failures.** `/api/contact` returns success even when Resend fails. Reservation emails are fire-and-forget after the response, with no retry | *source* | Check `sendEmail` results. Move sends to a Payload job with retries. Alert on failure | 3 h |
| K-11 | **Mixed-language UI.** Hard-coded English: the "Work in progress" banner, "Click to expand", the audio player caption, the contact pre-fill text, every page `<title>`/description except FAQ, every customer email except OTP | *live* + *source* | Move them to `messages/*.json`. Localize emails by order locale (store `locale` on the order) | 1 day |
| K-12 | **Legal pages missing.** No privacy policy, terms of sale, returns or withdrawal policy, cookie notice, company identification, or ANPC/SAL info. The FAQ promises 14-day returns. The "Invoice" PDF isn't a fiscal invoice | *live*: `/en/privacy`, `/en/terms` return 404 | Legal content from the owner or an accountant. Rename the PDF to "Order summary / Proforma" until fiscal invoicing exists | content-bound |
| K-13 | **`www.simoninstruments.com` doesn't resolve** | *live* | Add a `www` CNAME at Hostinger. The middleware already 301s it | 10 min |

## P2: quality, performance, SEO

| ID | Issue | Evidence | Fix |
|---|---|---|---|
| K-14 | **No caching anywhere.** DB pages are `force-dynamic`, and the other pages turn dynamic through next-intl. Gallery TTFB is ~1.7s, home ~0.5–0.9s | *live* | `setRequestLocale` + `generateStaticParams` for static pages. Tag-based revalidation for instruments (`revalidateTag` in an instruments `afterChange` hook). Cache Components once on Next 16 + Payload support |
| K-15 | **Images are proxied through the app.** About 2s per original, then re-optimized by `/_next/image`. No responsive renditions | *live*: public bucket 0.5s vs app 2.0s | `disablePayloadAccessControl: true` + `generateFileURL` to serve from the public bucket or a CDN. Define `imageSizes` on Media. Consider Supabase image transforms or Cloudflare |
| K-16 | **The Auth.js `session` callback hits the DB on every `auth()`/`useSession()`.** The header also fires 2–3 API calls per page view for logged-in users | *source* | Keep the session lean (id, roles). Fetch profile data only where needed, then cache it |
| K-17 | **Technical SEO is missing.** No `sitemap.xml`, no `robots.txt`, no canonical tags, no Open Graph or Twitter cards, no `Product`/`Offer`/`LocalBusiness` JSON-LD, no favicon at `/favicon.ico`. hreflang exists only as next-intl's HTTP `Link` header, with x-default pointing at the redirecting unprefixed URL. Search Console (2026-10-24) shows Google drops `/en/*` pages as duplicates of the unprefixed URLs | *live* + Search Console | See `docs/seo/technical-spec.md` (Phase B, PR B1) |
| K-18 | **Weak product identity.** Generic titles ("Cello 4/4" ×10), hand-typed slugs (`Cello-4-4(10)`), alt text "Front" | *live* | Per-locale title templates, auto-slug `{type}-{model}-{year}-{distinguisher}` with `previousSlugs` 308s, required descriptive alt. See `docs/seo/technical-spec.md` §2, §6 (PR B2) |
| K-19 | **Pages are client components without need.** `hero`, `footer`, `instrument-showcase` and `photos/page.tsx` are fully client. `/photos` has no metadata | *source* | Make them server components, with client islands only for interactivity |
| K-20 | **No observability.** `@vercel/analytics` is inert on Railway (404). No error tracking. `/api/health` doesn't check the DB | *live* | Cookieless analytics (Plausible, Umami or PostHog), Sentry, and a DB-aware healthcheck |
| K-21 | **No security headers.** No CSP, HSTS, `X-Frame-Options` or `Referrer-Policy`. (`x-powered-by` is off since 2026-10-24) | *live* | `headers()` in `next.config` |

## P3: hygiene

| ID | Issue | Fix |
|---|---|---|
| K-22 | No CI. Tests are stale Payload-template placeholders; the e2e test expects "Payload Blank Template" | GitHub Actions: install → tsc → lint → build → Playwright smoke. Branch protection on `main` |
| K-23 | Two lockfiles (`pnpm-lock.yaml` + `package-lock.json`). No `packageManager` field. Loose `engines.node` | Delete `package-lock.json`. Add `"packageManager": "pnpm@10.29.2"`, `.nvmrc`, `engines.node: ">=22"` |
| K-24 | Dead code: `stripe-payment-form.tsx` (611 lines), `instrument-card.tsx`, `session-provider.tsx`, `lib/order-types.ts`, Facebook/Apple env vars, `public/placeholder*` | Delete. Git history keeps them |
| K-25 | `README.md` was the Payload template; `docker-compose.yml` runs MongoDB | README rewritten (2026-10-24). Replace the compose file with Postgres |
| K-26 | Migration snapshot drift: `20260303_000000_make_instrument_price_optional` has no `.json` snapshot | The next `migrate:create` will re-emit the harmless `DROP NOT NULL`. Keep it |
| K-27 | `src/middleware.ts` hard-codes the canonical host, so staging or preview deploys redirect to production | Read the canonical host from env (`NEXT_PUBLIC_SITE_URL`) |
| K-28 | Business constants are duplicated: the reservation limit (3 places), Paul's email (8+ places), phone and address (5+ places) | A single `src/config/business.ts` (or a Payload `settings` global, editable by Paul) |
| K-29 | Seed script deletes all orders and instruments with no environment guard | Refuse to run unless `DATABASE_URL` is local or `--force` is passed |
| K-30 | Copy contradictions (shipping included vs calculated, pickup hours, returns) | See `domain-and-business-logic.md` §9 |

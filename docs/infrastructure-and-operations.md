# Infrastructure and operations

Observed 2026-10-24 using DNS, HTTP, the GitHub API, the public site, and the Railway CLI and
Supabase CLI (read-only; Railway is logged in as Paul's account). The Resend, Google Cloud and
Hostinger dashboards were **not** accessed. Items marked **(unverified)** need someone with
dashboard access to confirm. Updated later the same day after the region move, the `ideal-caring`
deletion and the new backup job.

## 1. Environments

| Env | URL | App | Database | Media | Status |
|---|---|---|---|---|---|
| **Production** | https://simoninstruments.com (+ `simon-musical-instruments-production-74e3.up.railway.app`) | Railway project `alluring-laughter`, env `production`, service `simon-musical-instruments`, **region `europe-west4-drams3a` (Amsterdam)**, 1 replica, no sleep. Auto-deploy from `main`. Plus cron service `db-backup` and private bucket `simon-backups` (see §6.6) | Supabase `prod-simon-musical-instruments` (`eedkygcxohpnjayapcjt`, eu-west-1, **Free plan**), session pooler `:5432` | Supabase Storage bucket `media` (public read) | Live |
| Staging | — | none confirmed | Supabase `simon-musical-instruments` (`ognzjmnrelsefcqacroe`) | same project | **Paused** (Supabase status `INACTIVE`; its DNS is removed while paused). It may be restorable from the dashboard |
| Local | http://localhost:3000 | `pnpm dev` | Local Postgres (see `local-development.md`) | **Uploads don't work**: the S3 vars point at the paused staging project | Works (tested) |

> **Region.** The app moved from Oregon (us-west2) to Amsterdam on 2026-10-24, next to the
> database in Ireland. Same price. Time to first byte from Romania, median of 7, before → after:
> `/en/gallery` 1.00 → 0.20 s, a product page 0.88 → 0.17 s, `/api/health` 0.49 → 0.10 s, a
> media image 0.74 → 0.25 s.

**Railway projects linked to this repo** (Railway workspace "My Projects", owned by Paul's account):

| Railway project | Deploys | Active | Notes |
|---|---|---|---|
| `lovely-adaptation` | 59 (2025-12-29 → 2026-02-09) | not in Paul's workspace (another account?) | Original production |
| `artistic-wholeness` | 1 (2025-12-29) | not in Paul's workspace (another account?) | Abandoned |
| `alluring-laughter` | 13 (2026-02-09 → now) | **yes: PRODUCTION** | Serves the custom domain. Variables point at the prod Supabase |
| `ideal-caring` | 13 (2026-02-09 → 2026-05-21) | **deleted 2026-10-24** | An idle copy with no variables and no domain that still billed ~$1.90/mo. Deleted with the owner's OK |

**Production variables present** (names only, checked 2026-10-24):

- `AUTH_SECRET`, `AUTH_TRUST_HOST`, `AUTH_URL`, `DATABASE_URL`, `EMAIL_FROM`.
- `GOOGLE_CLIENT_ID/SECRET`, `PAYLOAD_SECRET`, `RESEND_API_KEY`.
- `S3_ACCESS_KEY/BUCKET/ENDPOINT/REGION/SECRET_KEY`.
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

`DEEPL_API_KEY` has been set since 2026-10-24 (DeepL API Free). That fixed K-4: the existing
instruments were backfilled in all 7 languages, and new instruments are translated when they're
created.

## 2. Build and deploy

- **Builder**: Railpack, Railway's default.
  - Node version: Railpack reads `engines.node`, which is currently `^18.20.2 || >=20.9.0`. That
    resolves to whatever Railpack picks; pin it.
  - Package manager: pnpm. `engines.pnpm` is `10.29.2`, and there's no `packageManager` field.
- **Config**: `railway.toml`.
  - Start command `pnpm start`.
  - Healthcheck `/api/health` with a 300s timeout.
  - Restart policy `on_failure` with 10 retries.
- **Deadline:** Railway's "Config as Code" (`railway.toml`/`railway.json`) is deprecated, with a
  **hard cutoff on 2026-12-01**. Replace it with Infrastructure as Code (`.railway/railway.ts`)
  before then. See the Railway docs: https://docs.railway.com/config-as-code
- **Build**: `pnpm build`, i.e. `next build` with an 8 GB old-space limit.
  - The build doesn't need the DB, because DB pages are `force-dynamic`.
- **Migrations are not run on deploy.**
  - They were added to `start` and reverted the same day (2026-03-03, commits `38ebd81` and
    `c02ab9b`).
  - Today someone runs `pnpm payload migrate` by hand against production. Who, and from where, is
    unverified.
  - See `src/migrations/AGENTS.md` for the safe procedure.
- **CI**:
  - None: there's no `.github/workflows`, branch protection is off, and nothing gates lint, types or
    tests.
  - Four GitHub webhooks on `pull_request` point at `trigger.heylua.ai`. These are AI review agents
    on the Lua platform.
- **Lockfiles**: both `pnpm-lock.yaml` and `package-lock.json` are committed. Railpack chooses pnpm
  because of the pnpm lockfile.
  - **Action:** delete `package-lock.json` to avoid drift.
- **Rollback**: redeploy a previous deployment from the Railway dashboard. DB migrations are not
  rolled back automatically.
- **`db-backup` is not auto-deployed.** Railway can't create a push trigger for it, so changes under
  `ops/backup/` go live only through the manual step in `ops/backup/README.md`.

## 3. Domain, DNS and email

**Registrar**: Hostinger.

- Registered 2019-05-24, **expires 2027-05-24**. Turn on auto-renew (unverified).
- Nameservers `ns1/ns2.dns-parking.com` (Hostinger DNS).

| Record | Value | Purpose |
|---|---|---|
| `@ ALIAS` | the Railway target `….up.railway.app` (Hostinger flattens it; resolves to the Railway edge `69.46.46.117`) | Website |
| `www CNAME` | the Railway target for `www` (added 2026-10-24, TTL 300) | `www` is a second Railway custom domain; it 301s to the apex |
| `_railway-verify.www TXT` | `railway-verify=…` | Railway's ownership check for `www`. Keep it |
| `@ MX` | `mx1/mx2.hostinger.com` | Paul's mailbox (Hostinger Mail) |
| `@ TXT` | `v=spf1 include:_spf.mail.hostinger.com ~all` | SPF for the mailbox |
| `@ TXT` | `google-site-verification=…` | Google Search Console domain verification (added 2026-10-24). **Keep forever**: deleting it unverifies Search Console |
| `hostingermail-a/b._domainkey CNAME` | `…dkim.mail.hostinger.com` | DKIM for the Hostinger mailbox |
| `autodiscover CNAME` | `autodiscover.mail.hostinger.com` | Mail client setup |
| `send MX/TXT` | `feedback-smtp.eu-west-1.amazonses.com`, `v=spf1 include:amazonses.com ~all` | Resend return-path (Resend runs on SES eu-west-1) |
| `resend._domainkey TXT` | DKIM public key | Resend DKIM |
| `_dmarc TXT` | `v=DMARC1; p=none` | Monitoring only. Add `rua=` reporting, then move to `quarantine` |
| `CAA` | none | Optional: restrict certificate issuers |

The apex is a Hostinger **ALIAS** (flattened CNAME) to the Railway target, not a hard-coded IP, so
an edge IP change at Railway is followed automatically. `dig` shows an A record only because of the
flattening. `www` was added on 2026-10-24 as a second custom domain on the web service (Hobby allows
2 per service). A full zone snapshot from before that change is kept privately.

Changing the zone: snapshot it first (hPanel → DNS → the record list), change one record, then
check with `dig @ns1.dns-parking.com` that MX, every TXT and the DKIM records are unchanged.
Cloudflare isn't needed for caching, because Railway's own edge CDN is free (see §4).

## 4. Vendors and third parties

| Vendor | Used for | Account / plan | Config / secret | Notes |
|---|---|---|---|---|
| **Railway** | Hosting the Next.js + Payload app, nightly backup job | Paul's account, **Hobby** ($5/mo, includes $5 of usage) | Service variables | ~$8.50/mo from March to October 2026, 99% of it memory. ~$6.60/mo after deleting `ideal-caring`. Target: the $5 floor. The edge CDN is **on** since 2026-10-24 (free; see §6.7) |
| **Supabase** | Postgres + S3-compatible storage | **Free**. No built-in backups; pauses after 7 days without activity (low risk: the site gets traffic every few minutes) | `DATABASE_URL`, `S3_*` | Limits vs use (2026-10-24): DB 500 MB vs ~14 MB (app tables 1.4 MB); storage 1 GB vs 40 MB (84 files); 2 active projects vs 1 (+1 paused). Egress (5 GB) is unmeasured. Pro ($25/mo) isn't needed: our own job backs up the DB **and** media (§6.6) |
| **Hostinger** | Domain, DNS, `paul.simon@` mailbox | Unknown | Dashboard | |
| **Resend** | Transactional email | Unknown. Free tier is 100/day, 3,000/mo | `RESEND_API_KEY`, `EMAIL_FROM` | Domain verified (DKIM present) |
| **DeepL** | Translating instrument title and notes | **API Free** (500k characters/mo) | `DEEPL_API_KEY` | Set in production 2026-10-24. The one-off backfill used ~90k characters; a new instrument uses ~4k. Free allows one glossary, which holds the luthier terms (`docs/seo/translation-glossary.md`) |
| **Google Cloud** | OAuth client for "Sign in with Google" | Unknown project | `GOOGLE_CLIENT_ID/SECRET` | Redirect URI `https://simoninstruments.com/api/auth/callback/google` |
| **Stripe** | Card payments, **disabled** | Test-mode keys, also in production | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Code kept in comments. No live account in use |
| **Better Stack** | Uptime monitors, backup heartbeat | Free | — | Owned by observability. A missed nightly backup alerts after ~26 h |
| **PostHog** | Product analytics | Free, EU cloud | — | Owned by observability |
| **Vercel Analytics** | Nothing (not on Vercel) | — | — | Remove, or replace with a cookieless analytics tool |
| **Google Maps** | Embed + links on contact/footer | — | Embed URL hard-coded | The iframe loads Google cookies; consider a click-to-load placeholder for GDPR |
| **Instagram / WhatsApp** | Footer links | — | — | |
| **Facebook / Apple OAuth** | Not active | — | Vars exist in `.env` | Code commented out |
| **GitHub** | `rares04/simon-musical-instruments` (**public**) | Collaborators: `rares04`, `SimonRaul` | — | No branch protection |
| **Lua (trigger.heylua.ai)** | PR webhooks (review agents) | — | Repo webhooks | |

## 5. Environment variables

| Variable | Required | Used by | Notes |
|---|---|---|---|
| `DATABASE_URL` | yes | Payload Postgres adapter | Supabase **session** pooler (`aws-1-eu-west-1.pooler.supabase.com:5432`, user `postgres.<ref>`) |
| `PAYLOAD_SECRET` | yes | Payload JWT/crypto | ≥32 random chars. Rotating it logs out all admin sessions |
| `AUTH_SECRET` | yes | Auth.js | Rotating it logs out all storefront sessions |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | yes | `@payloadcms/storage-s3` | Supabase → Storage → S3 connection. `forcePathStyle: true` |
| `RESEND_API_KEY` | yes | `src/lib/resend.ts` | Throws on first send if missing |
| `EMAIL_FROM` | recommended | `src/lib/resend.ts` | Default `Paul Simon <paul.simon@simoninstruments.com>` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | yes (Google login) | `src/lib/auth.ts` | |
| `DEEPL_API_KEY` | recommended | `src/lib/deepl.ts`, `src/hooks/autoTranslate.ts` | Without it, translation is skipped silently |
| `BACKUP_DATABASE_URL` | `db-backup` only | `ops/backup/backup.sh` | The read-only `simon_backup` role. The job's `DATABASE_URL` references it |
| `HEARTBEAT_URL` | `db-backup` only | `ops/backup/backup.sh` | Better Stack heartbeat, pinged after a verified run. Treat as a secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | yes | `src/components/turnstile-widget.tsx`, `src/lib/turnstile.ts` | Cloudflare Turnstile bot check on sign-up, contact and reservations. The site key is inlined at **build** time. Without the secret, checks are skipped |
| `TOTP_ENC_KEY` | yes | `src/lib/totp-secret.ts` | Encrypts admins' authenticator secrets (32 random bytes, base64). Not in the database or backups: keep a private copy. Losing or changing it means every admin re-enrols (§6.8) |
| `ADMIN_TOTP_DISABLED` | no | `src/payload.config.ts` | Emergency switch: `true` turns admin 2FA off without removing enrolments (§6.8) |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | no (disabled) | dead code | |
| `NEXTAUTH_URL` / `AUTH_URL` | no | Auth.js | `trustHost: true` derives the URL from the request |

`src/payload.config.ts` falls back to `''` for a missing `PAYLOAD_SECRET`, `DATABASE_URL` or `S3_*`.
A misconfigured deploy boots, then fails at runtime. Validate env at startup instead (see roadmap).

## 6. Runbooks

### 6.1 Deploy a change

1. Branch from `main`, then open a PR.
2. Run `pnpm exec tsc --noEmit && pnpm lint && pnpm build` locally. There is no CI yet.
3. If the schema changed, follow `src/migrations/AGENTS.md` and apply the migration to production
   **before** merging.
4. Merge to `main`. Railway deploys the web service in about 5–7 minutes. `db-backup` is not
   redeployed (see §2).
5. Smoke test: `/en`, `/en/gallery`, a product page, `/admin` login, `/api/health`.

### 6.2 Release a stale reservation (customer never paid)

1. In `/admin` → Shop → Orders, open the order and set its status to `cancelled`. Add a note.
2. In `/admin` → Instruments, open each instrument from that order and set its status back to
   `available`.

Both steps are manual. Nothing links them.

### 6.3 Mark a sale complete

1. Set the order to `paid`, then fill in `paymentReference` and `paidAt`.
2. Set each instrument to `sold`.
3. For delivery, set the order to `processing`, add the tracking details, then set it to `shipped`.
   This sends the shipping email to the customer.

### 6.4 Add an instrument (Paul)

1. Upload the photos and audio to Media. Fill in `alt` with something descriptive, not just
   "Front".
2. Create the instrument **in English**. Leave the price empty for "price on request".
3. Translations to the other 7 locales appear about 10s after saving. DeepL uses formal address and
   the luthier glossary. If DeepL fails, nothing is saved (the English text is never copied in), and
   the instrument stays English in that language until it's backfilled.

To fix one translation, switch the admin locale and edit the text by hand. The hook only runs on
create, so editing the English later doesn't re-translate. To translate missing or out-of-date
languages in bulk, use `scripts/backfill-translations.ts`:

1. `review` writes proposals to a file.
2. A person checks them (a native speaker reviews RO).
3. `apply` writes exactly that file.

The script header has the commands. Hand-written translations are kept. To change the glossary, edit
`docs/seo/translation-glossary.md`, then run the script's `glossary` command (it costs no quota).

### 6.5 Rotate a secret

1. Generate the new value (`openssl rand -base64 32` for app secrets) or rotate it in the vendor
   dashboard.
2. Update the variable on the web service, then redeploy. `db-backup` reads the app's `S3_*`
   through references, so redeploy it as well when those change.
3. Update your local `.env`.
4. Revoke the old value at the vendor.

`TOTP_ENC_KEY` is the exception: changing it makes every stored authenticator secret unreadable. Rotate it only together with a reset of every admin's 2FA (§6.8).

### 6.6 Database backup and restore

Nightly at 00:15 UTC the Railway cron service `db-backup` runs `ops/backup/backup.sh`. Each run:

1. Dumps the `public` schema as the read-only `simon_backup` role.
2. Restores the dump into a throwaway Postgres and checks every table's row count against
   production.
3. Uploads it to the private bucket `simon-backups` and copies new media files.
4. Pings the heartbeat.

Daily dumps are kept 35 days, monthly dumps 400 days. Media and `db/pinned/` are never pruned. Cost
≈ $0.01/mo. Full runbook, including restore and the "accept a planned drop" step:
`ops/backup/README.md`.

- **Before a production migration**: run the job (`railway cron run --service db-backup
  --environment production --yes`), wait for `[backup] done`, and copy that dump to `db/pinned/`.
- **Manual dump from a laptop**: use `pg_dump` 17 (Homebrew `postgresql@17`). The default
  `pg_dump` 14 refuses to dump the PG 17 server.
- Restores have been tested into a local database and inside the job. A restore over the live
  database has **not** been tested; restore into a new database instead, then switch over.

### 6.7 Edge CDN

Railway's edge CDN is on for the web service (enabled 2026-10-24; free). It caches `image/*`
responses (media files, `/_next/image`) for 2 hours. HTML, `/api/*`, `/admin` and anything sent
with `Set-Cookie`, `Cache-Control: private` or `no-store` are never cached. A response header
`x-cache: HIT` means it came from the edge.

- **Replaced a photo but kept its filename?** Run `railway cdn purge all`. Payload normally makes
  filenames unique, so this is rare.
- **Something private got cached?** Make the route send `Cache-Control: private, no-store`, then
  purge.
- **Turn it off:** `railway cdn disable`.
- Railway's HTTP logs still record each visitor's real IP (`srcIp`), and the app sees it, so rate
  limits stay per visitor.

### 6.8 Admin two-factor authentication

Admins sign in to `/admin` with a password and a 6-digit code from an authenticator app (Google
Authenticator, Microsoft Authenticator, 1Password, …). It uses the `payload-totp` plugin. Customers
are not affected: they never get an admin session.

- **Enrol**: `/admin` → your account (top right) → "Authenticator app" → **Setup**. Scan the QR code
  with the app and enter the code it shows. Save the **setup key** (the text under the QR code) in a
  safe place agreed with the maintainer. It is the backup: it lets you add the account to a new
  phone.
- **Sign in**: password first, then the current code. A session that has entered its code stays
  valid for the admin session's lifetime.
- **Wrong codes**: after 5 wrong codes the account is locked for 10 minutes, like wrong passwords.
  Another admin can lift it with **Force Unlock** on the locked user's page.
- **Lost phone, setup key saved**: add the account to the new phone from the setup key. Nothing
  else changes.
- **Lost phone, no setup key**: the maintainer clears that admin's 2FA in the database (script in the
  private ops folder; it's a production write and needs the owner's OK). The admin then signs in
  with the password only and enrols again.
- **Everyone is refused a correct code** (and the logs show `totp: an authenticator secret could not
  be decrypted`): `TOTP_ENC_KEY` is missing or wrong. Restore the right value. If it is lost,
  clear every admin's 2FA as above and re-enrol.
- **Emergency**: set `ADMIN_TOTP_DISABLED=true` on the web service (it redeploys). 2FA is off;
  enrolments stay and work again when the variable is removed.
- **Making it required**: once every admin has enrolled, set `forceSetup: true` on the plugin in
  `payload.config.ts` (a code change). Admins without 2FA are then sent to the setup page after
  signing in.

## 7. Calendar of hard deadlines

| Date | What |
|---|---|
| **ASAP** | Next.js 15.4.10 is affected by published critical advisories (`GHSA-2464-fhr4-w9xw`, `GHSA-2xp9-vwfh-vxw4`). See `known-issues.md` K-1 |
| **2026-12-01** | Railway `railway.toml` stops being honoured. Migrate to `.railway/railway.ts` |
| 2027-04-30 | Node 22 EOL. Target Node 24 LTS |
| **2027-05-24** | Domain renewal at Hostinger |

## 8. Open questions

Answered 2026-10-24:

- Production is `alluring-laughter`. It now runs in EU West.
- `ideal-caring` was an idle, billing copy. Deleted.
- Supabase is on the Free plan, so it has no backups of its own; the nightly job covers that.
- `DEEPL_API_KEY` was missing. It has been set since 2026-10-24, and K-4 is fixed.

Still open (tracked on the coordination board):

1. The paused staging project: Free projects can be restored for 90 days after pausing, and the
   pause date is unknown. Restore it, or delete it and keep using a local Postgres?
2. Supabase egress, Resend plan and usage, Hostinger plan and auto-renew, and the Google Cloud
   project owner need someone with dashboard access.
3. What is the legal entity (SRL/PFA/II, CUI, registration no.)? It's needed for invoices and the
   legal pages. Owner: Paul.

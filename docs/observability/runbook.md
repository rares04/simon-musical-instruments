# Monitoring runbook

What to do when an alert fires. Last updated 2026-10-24.

**Who is on call:** the maintainer. Alerts go to the maintainer by email until an alert channel is
chosen. Paul gets no technical alerts; tell him only when customers are affected for more than about
1 hour.

**Where things are:**
- Uptime and heartbeats: Better Stack, team "Simon Instruments".
- Analytics: PostHog EU (https://eu.posthog.com), project "Simon Instruments". Error alerts are not routed
  to anyone yet (see the tracking plan's open decisions).
- App: Railway project `alluring-laughter`, region europe-west4. Logs: `railway logs`.
- DB: Supabase `eedkygcxohpnjayapcjt` (eu-west-1). Status: https://status.supabase.com.

## First 5 minutes, any "down" alert

1. Open the URL from the alert in a browser. If it loads fine, wait one more check (3 min). Better
   Stack confirms from several regions, so most alerts are real.
2. **Was there a deploy in the last 30 minutes?** (Railway → Deployments, or `git log origin/main`.)
   If yes, roll back first and investigate later:
   - Railway → service → Deployments → previous good deployment → **Redeploy**; or
   - `git revert <sha>` on a branch → PR → merge (main auto-deploys).
3. Tell the maintainer what broke and what you did.

## Per alert

| Alert | What it means | Check | Fix |
|---|---|---|---|
| **Simon gallery (database)** | `/en/gallery` failed, or it loaded without any product links | `/api/health` (it checks the DB). `railway logs` for DB errors. Supabase status | DB down or pooler exhausted: check Supabase. 200 but no products: are all instruments hidden or sold? Check `/admin`. Recent deploy: roll back |
| **Simon health API** | The app process is down, crashing, or can't reach the DB (it returns 503) | Railway deployment status and restarts, memory graph | Crash loop after deploy: roll back. OOM: raise memory (maintainer's OK: it costs money). DB: as above |
| **Simon home page** | `/en` failed or lost its title | Same as health API. If only home fails: a content or i18n error | Roll back if a deploy caused it |
| **Simon admin panel** | `/admin` doesn't return 2xx; Paul can't manage instruments | Browser console on `/admin`. Recent Payload upgrade or import-map change | Roll back; `pnpm generate:importmap` if the admin import map is stale |
| **SSL expires in 14 days** | Railway's Let's Encrypt auto-renewal (normally at 30 days left) hasn't happened | Railway → service → Settings → Domains: certificate status. Hostinger DNS: apex A record still points to Railway | Re-add the custom domain in Railway, or fix DNS (maintainer's OK) |
| **Domain expires in 30 days** | Hostinger renewal (due 2027-05-24) hasn't happened | Hostinger: auto-renew on, card valid | Renew (whoever owns the Hostinger billing) |
| **Heartbeat: Simon nightly DB backup** | No successful `db-backup` run in about 26 h | Railway: `db-backup` cron logs. Supabase reachable? | Run the backup by hand, fix the job before the next night (infra-cost owns it) |

## Error and business alerts

- Error alerts (new or spiking error), with a stack trace and request ID.
- Business alerts: reservation failed, email send failed. Each one is a customer who may not have
  been told anything: contact them directly from the order in `/admin`.
- **Hold sweep failed** (72 h reservation-hold expiry): unpaid reservations past 72 h aren't being released, so
  instruments stay hidden as `reserved`. Check `railway logs` for `holds: sweep failed` and the DB. Fix,
  then confirm the next sweep logs `holds: auto-cancelled N …`. In an emergency, Paul can set the
  instrument back to `available` in `/admin`.
- Web Vitals and funnel dashboards.

## SLOs (targets; reviewed monthly)

| SLO | Target | Measured by |
|---|---|---|
| Availability | ≥ 99.5% / month (about 3.6 h downtime allowed) | Better Stack, health + gallery monitors |
| Server response | p75 TTFB ≤ 800 ms (baseline 2026-10-24: 0.1–0.2 s) | Better Stack response times, later PostHog |
| Page experience | p75 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | PostHog Web Vitals |
| Reservations | ≥ 99% succeed; **every** failure alerts | Business events |
| Email | 100% accepted by Resend; **every** failure alerts | Business events |

Traffic is low, so failures alert one by one instead of by percentage.

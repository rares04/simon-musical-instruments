# Tracking plan

What we measure, and what we never collect. Code: `src/lib/observability/`, `src/instrumentation.ts`,
`src/instrumentation-client.ts`. Last updated 2026-10-24.

Ads conversion tracking (GA4 / Google Ads, once there is a consent banner) builds on these events.

## Rules

1. **No PII, ever.** No email, name, phone, address, free-text message, password or token in an event,
   property, log line or URL. Order numbers and instrument IDs are fine.
2. **No `identify()`** while we run without consent. Events stay anonymous.
3. **Strip query strings** from every URL property (`$current_url`, `$referrer`, `$initial_*`, `$set`,
   `$set_once`) in `before_send`, **except campaign parameters** (`utm_*`, `gclid`, `gbraid`, `wbraid`,
   `fbclid`, `msclkid`), which ads attribution needs. Emails in paths are redacted too.
4. **Autocapture is off** on `/account`, `/checkout`, `/login`, `/register` and `/verify-email`
   (`autocapture.url_ignorelist`). Button and link text there can contain the user's name.
5. **Naming:** `object_verb` in the past tense, snake_case. Amounts are numbers in EUR
   (`price_eur: null` means "price on request").
6. **Every event** carries super-properties `locale` (en/ro/de/fr/nl/ja/ko/el) and `app_version`
   (Railway commit SHA, short).
7. **Session replay and surveys stay off** until consent exists (the consent banner).
8. **Nothing is stored in the browser.** posthog-js runs with `persistence: 'memory'`, so there are no cookies,
   localStorage or sessionStorage. A visitor keeps one ID while navigating inside the app; a new tab or
   reload gets a new ID. When the consent banner ships, switch to normal persistence for visitors who consent
   (`opt_in_capturing()`).
9. **Country, not IP.** PostHog's GeoIP transformation sets `$geoip_country_code` and the IP is discarded
   (project setting). Bot traffic is dropped at ingestion (Filter Bot Events). Verified 2026-10-24:
   test event country=RO, `$ip`=null.

## Client events (posthog-js)

| Event | When | Properties |
|---|---|---|
| `$pageview`, `$pageleave` | Every route change (`capture_pageview: 'history_change'`) | auto |
| `$web_vitals` | Auto (LCP, INP, CLS, FCP) | auto |
| `instrument_viewed` | Product page mounted | `instrument_id`, `instrument_type`, `price_eur`, `price_on_request` |
| `gallery_filtered` | Type or price filter changed | `instrument_type`, `price_band` |
| `cart_item_added` | Add to cart | `instrument_id`, `instrument_type`, `price_eur` |
| `checkout_started` | `/checkout` mounted with items | `item_count`, `total_eur` |
| `reservation_completed` | create-reservation returned 200 | `item_count`, `total_eur`, `delivery_method` (delivery/pickup) |
| `reservation_failed` | create-reservation returned non-200 | `http_status`, `reason` (cart_empty, unavailable, no_price, limit_reached, server_error) |
| `price_request_clicked` | "Price on request" CTA | `instrument_id`, `instrument_type` |
| `contact_clicked` | `mailto:`, `tel:`, WhatsApp or Instagram link | `channel`, `placement` (footer, checkout, success, contact, product) |
| `inquiry_submitted` | `/api/contact` returned 200 | `inquiry_type` |
| `inquiry_failed` | `/api/contact` returned non-200 | `http_status` |
| `account_created` | OTP verified, or first Google sign-in | `method` (email/google) |
| `signed_in` | Sign-in success | `method` |

## Server events (posthog-node)

These are the source of truth for counts and alerting. They use `distinct_id: 'server'` and
`$process_person_profile: false`. They're not joined to visitors.

| Event | Where | Properties |
|---|---|---|
| `reservation_created` | create-reservation, after the order is saved | `order_number`, `item_count`, `total_eur`, `delivery_method` |
| `reservation_rejected` | create-reservation 4xx | `reason` |
| `email_sent` / `email_failed` | `sendEmail()` | `template` (reservation_customer, reservation_paul, shipping, contact, otp), `error_name` |
| `inquiry_received` | `/api/contact` | `inquiry_type` |
| `reservation_hold_expired` | Hold sweep (72 h reservation-hold expiry), once per auto-cancelled order | `order_number`, `item_count`, `age_hours` |
| `instruments_released` | Order cancelled or expired, instruments back to `available` | `order_number`, `instrument_count`, `cause` (expired/cancelled) |

Failures are **also** captured as exceptions in the error tool, so they can alert within 5 minutes.
PostHog's insight alerts check hourly at best, which is too slow. Status:

| Failure | Captured as an exception |
|---|---|
| Uncaught server error (pages, server actions, route handlers that throw) | Yes (`onRequestError`) |
| `sendEmail` failure (any template) | Yes |
| API route that catches its own error and returns 500 (create-reservation, contact, OTP, register, …) | Not yet. Needs a `captureError()` call in each catch (call-site follow-up) |
| Payload REST/admin errors (Payload catches them) | Not yet. Needs `hooks.afterError` in `payload.config.ts` |
| Hold-sweep failure (`holds: sweep failed …`) | Not yet. `captureError({ source: 'job', job: 'holds_sweep' })` in `reservations.ts` |

Until the follow-up lands, those last three are visible only in Railway's logs.

## Funnels and dashboards

- **Reservation funnel:** gallery `$pageview` → `instrument_viewed` → `cart_item_added` →
  `checkout_started` → `reservation_completed`. Breakdowns by `locale`, country (if GeoIP is
  approved: yes) and `instrument_type`.
- **Inquiry funnel:** `instrument_viewed` → `price_request_clicked` or `contact_clicked` →
  `inquiry_submitted`.
- **Health dashboard:** server `reservation_created` vs `reservation_rejected`, `email_failed`
  count, Web Vitals p75 by page, top 404s.
- **Ads conversions (later):** primary `reservation_completed`; secondary
  `inquiry_submitted` and `contact_clicked` (phone/WhatsApp).

## Logger (server)

- JSON lines to stdout, which Railway indexes: `{ level, msg, time, request_id, route, duration_ms, err }`.
- `request_id`: the `x-railway-request-id` header, or else `crypto.randomUUID()`. It's also sent as the
  error-tool tag, so a log line and an error can be matched.
- A deny-list redacts keys before writing: `email`, `name`, `phone`, `address`, `password`, `token`,
  `otp`, `message`, `authorization`, `cookie`. Replace the 54 `console.*` calls gradually, starting
  with checkout, contact, auth and `sendEmail`.

## Hold sweep (72 h reservation-hold expiry)

- Unpaid holds auto-expire after 72 h. The sweep is lazy: it runs on an instruments read or a new
  reservation, at most every 10 min per process.
- **No heartbeat for it.** With no traffic there's no sweep, so a dead-man check would raise false
  alarms. Failures alert as exceptions instead. Weekly check on the dashboard: `reservation_hold_expired`
  count vs orders still `pending_payment` older than 72 h; anything left over means the sweep isn't
  running.
- Its log lines carry order numbers only, never customer emails.

## Open decisions

- ~~Country data~~: decided 2026-10-24, GeoIP country + discarded IP + memory-only persistence.
- ~~Geo precision~~: decided 2026-10-24 (maintainer): keep country, region and city; drop lat/long, postal
  code and accuracy radius (PostHog "Filter Properties" transformation, order 3, after GeoIP and the bot
  filter). This is the Plausible standard.
- Alert channel for error alerts (Slack, email or Discord). Until decided, errors are recorded in PostHog
  but don't page anyone; uptime alerts go by email.

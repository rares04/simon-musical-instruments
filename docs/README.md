# Documentation

Engineering documentation for simoninstruments.com. Start with the root [`AGENTS.md`](../AGENTS.md)
for a ten-minute orientation. Read the rest in this order:

| # | Doc | Read it when |
|---|---|---|
| 1 | [architecture.md](architecture.md) | You need the mental model: how Next.js, Payload, Auth.js, Supabase and Railway fit together |
| 2 | [domain-and-business-logic.md](domain-and-business-logic.md) | You touch instruments, reservations, orders, emails or accounts |
| 3 | [local-development.md](local-development.md) | You want the app running on your machine (tested 2026-10-24) |
| 3b | [workflow.md](workflow.md) | You ship a change: branch, PR, CI, deploy, validate, roll back, migrations |
| 4 | [infrastructure-and-operations.md](infrastructure-and-operations.md) | You deploy, change env vars, touch DNS/email, or handle an incident |
| 5 | [design-system.md](design-system.md) | You build or change UI |
| 6 | [known-issues.md](known-issues.md) | Before planning work. Ranked bugs and tech debt |
| 7 | [roadmap.md](roadmap.md) | You plan what comes next |
| 8 | [adr/](adr/) | You wonder why something is the way it is |
| 9 | [seo/](seo/README.md) | You touch page metadata, URLs, slugs, structured data or content pages. Search strategy (SEO, answer engines, AI search) and the Phase B technical spec |
| — | [reference/payload-cms-rules.md](reference/payload-cms-rules.md) | Generic Payload CMS patterns (from the Payload template; also split in `.cursor/rules/`) |

## Conventions for these docs

- **Observed beats assumed.** Each doc tags claims that came from the live site or from vendor
  dashboards with the date they were checked. Treat anything older than ~3 months as stale.
- **Keep them current.**
  - A PR that changes behaviour described here updates the doc in the same PR.
  - A PR that makes an architectural decision adds an ADR (`docs/adr/NNNN-title.md`; copy the format
    of an existing one).
- **No secrets, customer data or vulnerability details.** The repository is public. Security
  findings are tracked privately by the maintainer.
- Each `AGENTS.md` in a subdirectory has a one-line `CLAUDE.md` (`@AGENTS.md`) next to it. Edit `AGENTS.md`, never `CLAUDE.md`.

## Glossary

| Term | Meaning |
|---|---|
| **Paul** | Paul Simon, luthier and owner; receives all notification emails; operates `/admin` |
| **Ecaterina** | Ecaterina Simon, co-founder; varnishing and finishing |
| **Atelier / workshop** | Strada 1 Decembrie 1918 nr. 8, Reghin 545300, Romania; pickup location |
| **Reservation** | An `orders` row in status `pending_payment`, created from the storefront checkout without payment |
| **Order number** | `SI-<base36 timestamp>-<4 random chars>`; shown to customers; doubles as "invoice number" |
| **Price on request** | Instrument with `price = null`; shows "Ask for price", cannot be added to cart |
| **Model** | The historical pattern the instrument copies (Stradivari Davidoff, Goffriller, Gamba Vivala…) |
| **Locale** | One of `en ro de fr nl ja ko el`; URL prefix is always present (`/en/...`) |

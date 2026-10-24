# Security policy

This repository powers https://simoninstruments.com, the shop of a two-person luthier workshop.
We take reports seriously and appreciate responsible disclosure.

## Reporting a vulnerability

- **Please do not open a public issue or pull request** for security problems.
- Use GitHub's private reporting instead: **Security → Report a vulnerability** on this repository.
- Include:
  - what you found and where (URL, endpoint, file);
  - steps to reproduce;
  - the impact as you see it.
- Please test only against your own accounts and data. Don't access, change or delete other
  people's data, and don't degrade the service (no load or denial-of-service testing).

We aim to acknowledge reports within **3 working days** and to keep you updated until the issue is
resolved. We're happy to credit you once a fix is live, if you'd like.

## Scope

In scope:

- https://simoninstruments.com and its `/api/*` endpoints;
- the admin panel at `/admin`;
- the code in this repository.

Out of scope:

- third-party services we use (Railway, Supabase, Cloudflare, Resend, Google): report those to the
  vendor;
- findings that need physical access to a device, or social engineering of the workshop;
- missing best-practice headers without a demonstrated impact;
- automated scanner output without a working proof of concept.

## Supported versions

Only the current `main` branch (what's deployed) is supported.

## For contributors

- The repository is public. Never commit secrets, customer data, or exploit details. Use neutral
  wording in commits, pull requests and issues for security fixes.
- Security rules for the code live in `AGENTS.md` §2 and in the `AGENTS.md` files under
  `src/collections`, `src/app/api` and `src/lib`.

# 0002. Supabase Postgres and Supabase Storage via the S3 API

- **Status**: Accepted
- **Date**: 2025-12-29 (retroactive record)

## Context

Payload needs a SQL or Mongo database and somewhere to put uploads. Railway's filesystem is
ephemeral, so local uploads would be lost on every deploy.

## Decision

- **Postgres on Supabase** (eu-west-1), through `@payloadcms/db-postgres`, connected via the
  Supavisor **session** pooler on port 5432.
- **Media** in a Supabase Storage bucket `media` through `@payloadcms/storage-s3`, with
  `forcePathStyle: true` and `disableLocalStorage: true` on the Media collection (commit `5580421`).
- Separate Supabase projects for staging and production.

## Consequences

- Managed Postgres and storage, with a free tier.
- **Files are served through Payload** (`/api/media/file/*`), not straight from the public bucket.
  That costs ~1.5s extra per image. See known-issues K-15.
- The staging project is **paused** (Free plan inactivity). Only production is live.
- On the Free plan there are **no backups**. Confirm the plan; see the roadmap.

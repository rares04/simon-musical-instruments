# Nightly backups

The Railway cron service `db-backup` (project `alluring-laughter`) runs `backup.sh` every night at
00:15 UTC. It writes to the private Railway bucket `simon-backups` (region EU West, Amsterdam).

Each run:

1. Dumps the Postgres `public` schema (all Payload data) with `pg_dump` 17, in a read-only
   transaction.
2. Restores the dump into a throwaway Postgres inside the container and checks that every table
   has the same row count as production.
3. Uploads the dump. Fails if `instruments`, `media` or `users` is empty, or if any table lost more
   than 20% of its rows since the last run.
4. Copies new media files from Supabase Storage. It never deletes, so removed photos stay
   recoverable.
5. Prunes daily dumps older than 35 days and monthly dumps older than 400 days, but only if every
   check passed.

A failed run exits non-zero and shows as failed in the Railway cron history.

## Bucket layout

| Path | Contents | Kept |
|---|---|---|
| `db/daily/<UTC stamp>.dump` + `.counts.txt` | Nightly dump (`pg_dump -Fc`) and its row counts | 35 days |
| `db/monthly/<UTC stamp>.dump` | The dump taken on the 1st of each month | 400 days |
| `db/pinned/` | Hand-picked dumps, e.g. before a migration | Forever (never pruned) |
| `db/latest-counts.txt` | Row counts from the last good run (used by the drop check) | Overwritten |
| `media/` | Mirror of the Supabase `media` bucket | Forever |

## Configuration (service variables)

| Variable | Value |
|---|---|
| `DATABASE_URL` | Reference to the app's `DATABASE_URL`. Later, a read-only role with `BYPASSRLS` (owned by security) |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | References to the app's Supabase Storage variables |
| `BACKUP_BUCKET`, `BACKUP_ENDPOINT`, `BACKUP_REGION`, `BACKUP_ACCESS_KEY_ID`, `BACKUP_SECRET_ACCESS_KEY` | References to the bucket's credentials |
| `HEARTBEAT_URL` | Optional. Pinged only after a fully successful run, so a monitor can alert when it goes missing |
| `KEEP_DAILY_DAYS`, `KEEP_MONTHLY_DAYS`, `MAX_DROP_PCT`, `REQUIRED_TABLES` | Optional overrides |

## Run a backup now

Use this before a production migration:

1. Railway dashboard → `db-backup` → Cron → **Run now**, or `railway cron` from the CLI.
2. Wait for `[backup] done` in the logs.
3. Copy that dump to `db/pinned/` if you want to keep it past 35 days.

## Restore

1. Download the dump. In the Railway dashboard: bucket `simon-backups` → `db/daily/` → download.
2. Restore it into a **local** database first and check it:

   ```sh
   createdb simon_restore
   pg_restore -d simon_restore --no-owner --no-privileges --clean --if-exists --exit-on-error <file>.dump
   ```

   `--clean --if-exists` is needed: the dump recreates schema `public`, which every new
   database already has.

3. To restore production (only with Rares's OK, after a fresh backup of the current state):
   1. Put the site in maintenance mode, or stop the Railway service.
   2. Restore into the prod database:

      ```sh
      pg_restore -d "$DATABASE_URL" --no-owner --no-privileges --clean --if-exists <file>.dump
      ```

      Use `pg_restore` 17 (`/opt/homebrew/opt/postgresql@17/bin` on macOS).
   3. Check the row counts against the matching `.counts.txt`.
   4. Start the service and run the smoke test from `docs/infrastructure-and-operations.md`.
4. Media: copy the files from the bucket's `media/` back into the Supabase `media` bucket, keeping
   the same keys.

## Cost

About $0.01/month:

- Storage at $0.015 per GB-month, for ~50 MB.
- About a minute of a small container per night.
- A few MB of egress.

Bucket egress and API operations are free.

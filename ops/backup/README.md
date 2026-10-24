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

## Security

- **Dumps are not encrypted.** They hold customer data and password hashes, and they sit in a
  private bucket (no public access). Anyone who can open that bucket can also read the database
  credentials in the same Railway project, so client-side encryption would add little, and a lost
  key would make every backup useless. Accepted by the owner on 2026-10-24.
- The job reads the database as `simon_backup`: login, `SELECT` only, `BYPASSRLS` (so row-level
  security doesn't hide rows from the dump), read-only transactions. Its URL is
  `BACKUP_DATABASE_URL`, and the job's `DATABASE_URL` references it. The security runbook rotates
  it.
- The job must never print connection strings, keys or rows. Keep `set -x` off.

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
| `DATABASE_URL` | `${{BACKUP_DATABASE_URL}}`: the read-only `simon_backup` role (created and rotated by security) |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` | References to the app's Supabase Storage variables |
| `BACKUP_BUCKET`, `BACKUP_ENDPOINT`, `BACKUP_REGION`, `BACKUP_ACCESS_KEY_ID`, `BACKUP_SECRET_ACCESS_KEY` | References to the bucket's credentials |
| `HEARTBEAT_URL` | Optional. Pinged only after a fully successful run, so a monitor can alert when it goes missing |
| `KEEP_DAILY_DAYS`, `KEEP_MONTHLY_DAYS`, `MAX_DROP_PCT`, `REQUIRED_TABLES` | Optional overrides |

## Run a backup now

Use this before a production migration:

1. Railway dashboard → `db-backup` → Cron → **Run now**, or
   `railway cron run --service db-backup --environment production --yes`.
2. Wait for `[backup] done` in the logs.
3. Copy that dump to `db/pinned/` if you want to keep it past 35 days.

## Deploying changes to this job

`db-backup` has **no push trigger**: Railway can't create one for this repo. Changes under
`ops/backup/` are not deployed automatically, even after they merge. To deploy the current head
of `main`:

```sh
railway service source connect --repo rares04/simon-musical-instruments --branch main \
  --service db-backup --environment production
```

Then run it once (see above) and check the log ends with `[backup] done`.

## Restore

1. Download the dump. In the Railway dashboard: bucket `simon-backups` → `db/daily/` → download.
2. Restore it into a **local** database first and check it:

   ```sh
   createdb simon_restore
   pg_restore -d simon_restore --no-owner --no-privileges --clean --if-exists --exit-on-error <file>.dump
   ```

   `--clean --if-exists` is needed: the dump recreates schema `public`, which every new
   database already has.

3. To restore production (only with Rares's OK). **This step has not been tested yet.** Only the
   local and in-job restores are proven.
   1. Take a fresh backup of the current state first (run the job), even if it is broken.
   2. Prefer restoring into a **new, empty** Supabase project or database. Check it, then point
      `DATABASE_URL` on the web service at it and redeploy. Don't restore over the live database:
      `--clean --if-exists` drops and recreates schema `public`, which can reset the grants and
      row-level security that Supabase and the security hardening rely on.

      ```sh
      pg_restore -d "<new database URL>" --no-owner --no-privileges --clean --if-exists <file>.dump
      ```

      Use `pg_restore` 17 (`/opt/homebrew/opt/postgresql@17/bin` on macOS).
   3. Check the row counts against the matching `.counts.txt`, and re-apply the RLS and grants
      from the security runbook.
   4. Run the smoke test from `docs/infrastructure-and-operations.md`.
4. Media: copy the files from the bucket's `media/` back into the Supabase `media` bucket, keeping
   the same keys.

## When the drop check fails on purpose

The job fails, and skips pruning, when a table lost more than 20% of its rows since the last good
run. If the deletion was intended (for example, Paul removed old instruments), accept the new
counts once. Either:

- Run the job once with `MAX_DROP_PCT=100` set on the service, then remove the variable.
- Or copy the newest `db/daily/<stamp>.counts.txt` over `db/latest-counts.txt` in the bucket.

Until then every night fails, and the heartbeat alert fires.

## Cost

About $0.01/month:

- Storage at $0.015 per GB-month, for ~50 MB.
- About a minute of a small container per night.
- A few MB of egress.

Bucket egress and API operations are free.

#!/bin/sh
# Nightly backup of the production database and media files.
#
# 1. Dump the `public` schema (all Payload data) in a read-only transaction.
# 2. Restore the dump into a throwaway local Postgres and compare row counts with prod.
# 3. Upload the dump to the private Railway bucket and copy any new media files.
# 4. Prune old dumps, but only when every check passed.
#
# Exits non-zero on any failure. Never prints connection strings, keys or row data.
set -eu

: "${DATABASE_URL:?missing}"
: "${S3_BUCKET:?missing}" "${S3_ENDPOINT:?missing}" "${S3_ACCESS_KEY:?missing}" "${S3_SECRET_KEY:?missing}"
: "${BACKUP_BUCKET:?missing}" "${BACKUP_ENDPOINT:?missing}"
: "${BACKUP_ACCESS_KEY_ID:?missing}" "${BACKUP_SECRET_ACCESS_KEY:?missing}"

KEEP_DAILY_DAYS=${KEEP_DAILY_DAYS:-35}
KEEP_MONTHLY_DAYS=${KEEP_MONTHLY_DAYS:-400}
MAX_DROP_PCT=${MAX_DROP_PCT:-20}
REQUIRED_TABLES=${REQUIRED_TABLES:-instruments media users}

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
WORK=$(mktemp -d)
PGDATA_TMP="$WORK/pg"
DEST="dest:$BACKUP_BUCKET"

log() { echo "[backup] $*"; }
fail() { echo "[backup] FAILED: $*" >&2; exit 1; }

cleanup() {
  pg_ctl -D "$PGDATA_TMP" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

# rclone remotes come from env vars, so there is no config file holding keys.
# An empty config file stops rclone warning that none exists.
export RCLONE_CONFIG="$WORK/rclone.conf"
: > "$RCLONE_CONFIG"
export RCLONE_CONFIG_SUPA_TYPE=s3
export RCLONE_CONFIG_SUPA_PROVIDER=Other
export RCLONE_CONFIG_SUPA_ENDPOINT="$S3_ENDPOINT"
export RCLONE_CONFIG_SUPA_REGION="${S3_REGION:-auto}"
export RCLONE_CONFIG_SUPA_ACCESS_KEY_ID="$S3_ACCESS_KEY"
export RCLONE_CONFIG_SUPA_SECRET_ACCESS_KEY="$S3_SECRET_KEY"
export RCLONE_CONFIG_SUPA_FORCE_PATH_STYLE=true
export RCLONE_CONFIG_DEST_TYPE=s3
export RCLONE_CONFIG_DEST_PROVIDER=Other
export RCLONE_CONFIG_DEST_ENDPOINT="$BACKUP_ENDPOINT"
export RCLONE_CONFIG_DEST_REGION="${BACKUP_REGION:-auto}"
export RCLONE_CONFIG_DEST_ACCESS_KEY_ID="$BACKUP_ACCESS_KEY_ID"
export RCLONE_CONFIG_DEST_SECRET_ACCESS_KEY="$BACKUP_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_DEST_FORCE_PATH_STYLE="${BACKUP_FORCE_PATH_STYLE:-false}"
export RCLONE_S3_NO_CHECK_BUCKET=true

COUNT_SQL="select table_name || '|' || (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from public.%I', table_name), false, true, '')))[1]::text from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by 1"

prod_counts() {
  PGOPTIONS='-c default_transaction_read_only=on' psql "$DATABASE_URL" -X -At -v ON_ERROR_STOP=1 -c "$COUNT_SQL"
}

# 1. Dump.
log "dumping public schema"
PGOPTIONS='-c default_transaction_read_only=on' \
  pg_dump "$DATABASE_URL" --schema=public --no-owner --no-privileges -Fc -f "$WORK/db.dump" \
  || fail "pg_dump"
prod_counts > "$WORK/prod-counts.txt" || fail "counting prod rows"
log "dump size $(wc -c < "$WORK/db.dump") bytes, $(wc -l < "$WORK/prod-counts.txt") tables"

# 2. Restore check in a throwaway server (unix socket only, no network).
log "restore check"
initdb -D "$PGDATA_TMP" -U postgres --auth=trust -E UTF8 --locale=C >/dev/null || fail "initdb"
pg_ctl -D "$PGDATA_TMP" -o "-k $WORK -c listen_addresses=''" -w start >/dev/null || fail "starting check server"
createdb -h "$WORK" -U postgres verify || fail "createdb"
# --clean --if-exists: the dump recreates schema "public", which a new database already has.
pg_restore -h "$WORK" -U postgres -d verify --no-owner --no-privileges --clean --if-exists --exit-on-error "$WORK/db.dump" \
  || fail "pg_restore"
psql -h "$WORK" -U postgres -d verify -X -At -v ON_ERROR_STOP=1 -c "$COUNT_SQL" > "$WORK/restore-counts.txt" \
  || fail "counting restored rows"
pg_ctl -D "$PGDATA_TMP" -m fast stop >/dev/null

if ! diff -q "$WORK/prod-counts.txt" "$WORK/restore-counts.txt" >/dev/null; then
  # A write may have landed between the dump and the count. Recount once.
  prod_counts > "$WORK/prod-counts.txt" || fail "recounting prod rows"
  diff "$WORK/prod-counts.txt" "$WORK/restore-counts.txt" >&2 || fail "restored row counts differ from prod"
fi
log "restore check passed: row counts match on all tables"

# The dump restores, so keep it even if the sanity checks below fail.
rclone copyto "$WORK/db.dump" "$DEST/db/daily/$STAMP.dump" || fail "uploading dump"
rclone copyto "$WORK/restore-counts.txt" "$DEST/db/daily/$STAMP.counts.txt" || fail "uploading counts"
if [ "$(date -u +%d)" = "01" ]; then
  rclone copyto "$WORK/db.dump" "$DEST/db/monthly/$STAMP.dump" || fail "uploading monthly dump"
fi
log "uploaded db/daily/$STAMP.dump"

# 3. Sanity checks against an empty or wrong source.
for t in $REQUIRED_TABLES; do
  n=$(awk -F'|' -v t="$t" '$1 == t { print $2 }' "$WORK/restore-counts.txt")
  [ "${n:-0}" -gt 0 ] || fail "table '$t' is empty or missing; not pruning"
done
if rclone cat "$DEST/db/latest-counts.txt" > "$WORK/prev-counts.txt" 2>/dev/null && [ -s "$WORK/prev-counts.txt" ]; then
  awk -F'|' -v max="$MAX_DROP_PCT" '
    NR == FNR { prev[$1] = $2; next }
    ($1 in prev) && prev[$1] >= 5 && $2 < prev[$1] * (100 - max) / 100 {
      printf "[backup] %s dropped from %d to %d rows\n", $1, prev[$1], $2; bad = 1
    }
    END { exit bad }
  ' "$WORK/prev-counts.txt" "$WORK/restore-counts.txt" >&2 \
    || fail "row counts dropped more than ${MAX_DROP_PCT}% since the last run; not pruning"
fi
rclone copyto "$WORK/restore-counts.txt" "$DEST/db/latest-counts.txt" || fail "updating latest counts"

# 4. Media: copy new or changed files only. Never delete, so removed photos stay recoverable.
log "copying media"
if ! rclone copy "supa:$S3_BUCKET" "$DEST/media" -v > "$WORK/media.log" 2>&1; then
  grep -E 'ERROR|Failed' "$WORK/media.log" >&2 || true
  fail "copying media"
fi
log "media files copied this run: $(grep -c ': Copied' "$WORK/media.log" || true)"
grep ': Copied' "$WORK/media.log" | sed -E 's/^.*INFO *: (.*): Copied (.*)$/[backup]   copied: \1 \2/' | head -10 || true
rclone lsf "supa:$S3_BUCKET" --files-only -R > "$WORK/src-raw.txt" || fail "listing source media"
rclone lsf "$DEST/media" --files-only -R > "$WORK/dst-raw.txt" || fail "listing backed-up media"
[ -s "$WORK/src-raw.txt" ] || fail "source media listing is empty"
sort "$WORK/src-raw.txt" > "$WORK/src-media.txt"
sort "$WORK/dst-raw.txt" > "$WORK/dst-media.txt"
missing=$(comm -23 "$WORK/src-media.txt" "$WORK/dst-media.txt" | wc -l)
[ "$missing" -eq 0 ] || fail "$missing media files are missing from the backup"
log "media: $(wc -l < "$WORK/src-media.txt") files in source, all present in backup"

# 5. Prune. db/pinned/ is never touched.
rclone delete "$DEST/db/daily" --min-age "${KEEP_DAILY_DAYS}d" || fail "pruning daily dumps"
rclone delete "$DEST/db/monthly" --min-age "${KEEP_MONTHLY_DAYS}d" || fail "pruning monthly dumps"

if [ -n "${HEARTBEAT_URL:-}" ]; then
  curl -fsS -m 10 --retry 3 "$HEARTBEAT_URL" >/dev/null || fail "heartbeat ping"
fi
log "done"

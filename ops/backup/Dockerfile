# Nightly backup job, run by the Railway cron service `db-backup`.
# The postgres image provides pg_dump/pg_restore and a throwaway server for the restore check.
FROM postgres:17-alpine

RUN apk add --no-cache rclone curl

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod 755 /usr/local/bin/backup.sh

# initdb and postgres refuse to run as root.
USER postgres
WORKDIR /tmp

ENTRYPOINT []
CMD ["/usr/local/bin/backup.sh"]

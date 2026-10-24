import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "instruments" ALTER COLUMN "price" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  CREATE INDEX "instruments_locales_parent_id_idx" ON "instruments_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "instruments_locales_parent_id_idx";
  ALTER TABLE "instruments" ALTER COLUMN "price" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}

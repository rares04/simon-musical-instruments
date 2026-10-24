import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "totp_attempts" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ADD COLUMN "totp_secret" varchar;`)

  // Same lockdown as every other table (Supabase Data API): RLS on, no grants to the API roles.
  // The app connects as the table owner, which RLS doesn't restrict. The roles exist only on Supabase.
  await db.execute(sql`
   ALTER TABLE "totp_attempts" ENABLE ROW LEVEL SECURITY;
   DO $$
   BEGIN
     IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
       REVOKE ALL ON TABLE "totp_attempts" FROM anon;
     END IF;
     IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
       REVOKE ALL ON TABLE "totp_attempts" FROM authenticated;
     END IF;
   END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "totp_attempts" CASCADE;
  ALTER TABLE "users" DROP COLUMN "totp_secret";`)
}

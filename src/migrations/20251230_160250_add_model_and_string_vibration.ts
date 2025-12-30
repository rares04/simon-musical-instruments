import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el');
  CREATE TABLE "users_saved_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"street" varchar NOT NULL,
  	"apartment" varchar,
  	"city" varchar NOT NULL,
  	"state" varchar NOT NULL,
  	"zip" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"is_default" boolean DEFAULT false
  );
  
  CREATE TABLE "instruments_locales" (
  	"title" varchar NOT NULL,
  	"luthier_notes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "instruments" ADD COLUMN "model" varchar;
  ALTER TABLE "instruments" ADD COLUMN "specs_string_vibration" varchar;
  ALTER TABLE "orders" ADD COLUMN "tracking_number" varchar;
  ALTER TABLE "orders" ADD COLUMN "tracking_url" varchar;
  ALTER TABLE "orders" ADD COLUMN "estimated_delivery" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipped_at" timestamp(3) with time zone;
  ALTER TABLE "users_saved_addresses" ADD CONSTRAINT "users_saved_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instruments_locales" ADD CONSTRAINT "instruments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."instruments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_saved_addresses_order_idx" ON "users_saved_addresses" USING btree ("_order");
  CREATE INDEX "users_saved_addresses_parent_id_idx" ON "users_saved_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "instruments_locales_locale_parent_id_unique" ON "instruments_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "instruments" DROP COLUMN "title";
  ALTER TABLE "instruments" DROP COLUMN "luthier_notes";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_saved_addresses" CASCADE;
  DROP TABLE "instruments_locales" CASCADE;
  ALTER TABLE "instruments" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "instruments" ADD COLUMN "luthier_notes" varchar;
  ALTER TABLE "instruments" DROP COLUMN "model";
  ALTER TABLE "instruments" DROP COLUMN "specs_string_vibration";
  ALTER TABLE "orders" DROP COLUMN "tracking_number";
  ALTER TABLE "orders" DROP COLUMN "tracking_url";
  ALTER TABLE "orders" DROP COLUMN "estimated_delivery";
  ALTER TABLE "orders" DROP COLUMN "shipped_at";
  DROP TYPE "public"."_locales";`)
}

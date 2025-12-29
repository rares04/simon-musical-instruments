import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_provider" AS ENUM('credentials', 'google', 'facebook', 'apple');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"instrument_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"price" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"customer_id" integer,
  	"guest_email" varchar,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"contact_info_first_name" varchar NOT NULL,
  	"contact_info_last_name" varchar NOT NULL,
  	"contact_info_email" varchar NOT NULL,
  	"contact_info_phone" varchar NOT NULL,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_apartment" varchar,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_state" varchar NOT NULL,
  	"shipping_address_zip" varchar NOT NULL,
  	"shipping_address_country" varchar NOT NULL,
  	"payment_intent_id" varchar NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"shipping" numeric NOT NULL,
  	"insurance" numeric NOT NULL,
  	"total" numeric NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "first_name" varchar;
  ALTER TABLE "users" ADD COLUMN "last_name" varchar;
  ALTER TABLE "users" ADD COLUMN "image" varchar;
  ALTER TABLE "users" ADD COLUMN "provider" "enum_users_provider" DEFAULT 'credentials';
  ALTER TABLE "users" ADD COLUMN "provider_id" varchar;
  ALTER TABLE "users" ADD COLUMN "shipping_address_street" varchar;
  ALTER TABLE "users" ADD COLUMN "shipping_address_street2" varchar;
  ALTER TABLE "users" ADD COLUMN "shipping_address_city" varchar;
  ALTER TABLE "users" ADD COLUMN "shipping_address_state" varchar;
  ALTER TABLE "users" ADD COLUMN "shipping_address_postal_code" varchar;
  ALTER TABLE "users" ADD COLUMN "shipping_address_country" varchar;
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "orders_id" integer;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_instrument_idx" ON "orders_items" USING btree ("instrument_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE INDEX "orders_payment_intent_id_idx" ON "orders" USING btree ("payment_intent_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_provider_id_idx" ON "users" USING btree ("provider_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_orders_fk";
  
  DROP INDEX "users_provider_id_idx";
  DROP INDEX "payload_locked_documents_rels_orders_id_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "first_name";
  ALTER TABLE "users" DROP COLUMN "last_name";
  ALTER TABLE "users" DROP COLUMN "image";
  ALTER TABLE "users" DROP COLUMN "provider";
  ALTER TABLE "users" DROP COLUMN "provider_id";
  ALTER TABLE "users" DROP COLUMN "shipping_address_street";
  ALTER TABLE "users" DROP COLUMN "shipping_address_street2";
  ALTER TABLE "users" DROP COLUMN "shipping_address_city";
  ALTER TABLE "users" DROP COLUMN "shipping_address_state";
  ALTER TABLE "users" DROP COLUMN "shipping_address_postal_code";
  ALTER TABLE "users" DROP COLUMN "shipping_address_country";
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "orders_id";
  DROP TYPE "public"."enum_users_provider";
  DROP TYPE "public"."enum_orders_status";`)
}

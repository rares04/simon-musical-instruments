import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_payment_method" AS ENUM('bank_transfer', 'cash', 'card', 'other');
  CREATE TYPE "public"."enum_orders_delivery_method" AS ENUM('delivery', 'pickup');
  ALTER TABLE "users" ALTER COLUMN "provider" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "provider" SET DEFAULT 'credentials'::text;
  DROP TYPE "public"."enum_users_provider";
  CREATE TYPE "public"."enum_users_provider" AS ENUM('credentials', 'google');
  ALTER TABLE "users" ALTER COLUMN "provider" SET DEFAULT 'credentials'::"public"."enum_users_provider";
  ALTER TABLE "users" ALTER COLUMN "provider" SET DATA TYPE "public"."enum_users_provider" USING "provider"::"public"."enum_users_provider";
  ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending_payment'::text;
  DROP TYPE "public"."enum_orders_status";
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending_payment'::"public"."enum_orders_status";
  ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."enum_orders_status" USING "status"::"public"."enum_orders_status";
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_street" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_city" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_state" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_zip" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_country" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "payment_intent_id" DROP NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping" SET DEFAULT 0;
  ALTER TABLE "orders" ALTER COLUMN "insurance" SET DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "otp" varchar;
  ALTER TABLE "users" ADD COLUMN "otp_expiry" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN "payment_method" "enum_orders_payment_method" DEFAULT 'bank_transfer';
  ALTER TABLE "orders" ADD COLUMN "payment_reference" varchar;
  ALTER TABLE "orders" ADD COLUMN "delivery_method" "enum_orders_delivery_method" DEFAULT 'delivery' NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "pickup_date" varchar;
  ALTER TABLE "orders" ADD COLUMN "customer_remarks" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_provider" ADD VALUE 'facebook';
  ALTER TYPE "public"."enum_users_provider" ADD VALUE 'apple';
  ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_orders_status";
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_orders_status";
  ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."enum_orders_status" USING "status"::"public"."enum_orders_status";
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_street" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_city" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_state" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_zip" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping_address_country" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "payment_intent_id" SET NOT NULL;
  ALTER TABLE "orders" ALTER COLUMN "shipping" DROP DEFAULT;
  ALTER TABLE "orders" ALTER COLUMN "insurance" DROP DEFAULT;
  ALTER TABLE "users" DROP COLUMN "email_verified";
  ALTER TABLE "users" DROP COLUMN "otp";
  ALTER TABLE "users" DROP COLUMN "otp_expiry";
  ALTER TABLE "orders" DROP COLUMN "payment_method";
  ALTER TABLE "orders" DROP COLUMN "payment_reference";
  ALTER TABLE "orders" DROP COLUMN "delivery_method";
  ALTER TABLE "orders" DROP COLUMN "pickup_date";
  ALTER TABLE "orders" DROP COLUMN "customer_remarks";
  DROP TYPE "public"."enum_orders_payment_method";
  DROP TYPE "public"."enum_orders_delivery_method";`)
}

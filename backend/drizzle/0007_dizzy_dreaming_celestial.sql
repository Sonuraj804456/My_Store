CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "merchants_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "buyers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "buyers" CASCADE;--> statement-breakpoint
ALTER TABLE "stores" DROP CONSTRAINT "stores_user_id_unique";--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender_role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."message_sender_role";--> statement-breakpoint
CREATE TYPE "public"."message_sender_role" AS ENUM('MERCHANT', 'CUSTOMER', 'ADMIN');--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender_role" SET DATA TYPE "public"."message_sender_role" USING "sender_role"::"public"."message_sender_role";--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "merchant_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "customer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "merchant_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "merchant_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_customers_user_id" ON "customers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_customers_email_phone" ON "customers" USING btree ("email","phone");--> statement-breakpoint
CREATE INDEX "idx_merchants_user_id" ON "merchants" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "creator_id";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "buyer_id";--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "buyer_email";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "buyer_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "buyer_email";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "buyer_phone";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "buyer_name";--> statement-breakpoint
ALTER TABLE "payouts" DROP COLUMN "creator_id";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_merchant_id_unique" UNIQUE("merchant_id");--> statement-breakpoint
DROP TYPE "public"."user_role";
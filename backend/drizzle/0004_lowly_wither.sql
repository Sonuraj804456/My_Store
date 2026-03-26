CREATE TYPE "public"."payout_status" AS ENUM('LOCKED', 'ELIGIBLE', 'RELEASED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"creator_id" varchar(255) NOT NULL,
	"order_id" uuid NOT NULL,
	"gross_amount" numeric NOT NULL,
	"commission_amount" numeric NOT NULL,
	"net_amount" numeric NOT NULL,
	"status" "payout_status" DEFAULT 'LOCKED' NOT NULL,
	"eligible_at" timestamp NOT NULL,
	"released_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payouts_order_id_unique" UNIQUE("order_id")
);

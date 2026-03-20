CREATE TYPE "public"."product_type" AS ENUM('PHYSICAL', 'DIGITAL');--> statement-breakpoint
ALTER TYPE "public"."media_type" ADD VALUE 'file';--> statement-breakpoint
CREATE TABLE "digital_downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"token" varchar(128) NOT NULL,
	"max_downloads" integer,
	"download_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "download_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"digital_download_id" uuid NOT NULL,
	"ip_address" varchar(100),
	"user_agent" varchar(1024),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_type" "product_type" DEFAULT 'PHYSICAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "digital_downloads" ADD CONSTRAINT "digital_downloads_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "download_logs" ADD CONSTRAINT "download_logs_digital_download_id_digital_downloads_id_fk" FOREIGN KEY ("digital_download_id") REFERENCES "public"."digital_downloads"("id") ON DELETE cascade ON UPDATE no action;
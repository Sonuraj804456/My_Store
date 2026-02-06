CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'CREATOR', 'BUYER');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "public"."user_role" DEFAULT 'CREATOR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token"),
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "public"."session" ("user_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "public"."account" ("user_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "public"."verification" ("identifier");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "public"."stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" character varying(255) NOT NULL,
	"username" character varying(30) NOT NULL,
	"name" character varying(80) NOT NULL,
	"description" character varying(500),
	"avatar_url" text,
	"banner_url" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_vacation_mode" boolean DEFAULT false NOT NULL,
	"announcement_text" character varying(200),
	"announcement_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "stores_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "stores_username_unique" UNIQUE("username")
);

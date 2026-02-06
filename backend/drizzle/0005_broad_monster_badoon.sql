CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"username" varchar(30) NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(500),
	"avatar_url" text,
	"banner_url" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_vacation_mode" boolean DEFAULT false NOT NULL,
	"announcement_text" varchar(200),
	"announcement_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "stores_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "stores_username_unique" UNIQUE("username")
);

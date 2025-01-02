CREATE TABLE "actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"owner_login" text NOT NULL,
	"type" text NOT NULL,
	"color" text,
	"icon_svg" text,
	"stars" integer DEFAULT 0,
	"is_verified_owner" boolean DEFAULT false,
	"categories" jsonb,
	"external_uses_path_prefix" text,
	"global_relay_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "action_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"inputs" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"nodes" jsonb,
	"edges" jsonb,
	"yaml_content" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"user_id" text NOT NULL
);

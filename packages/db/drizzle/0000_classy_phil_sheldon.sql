CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" varchar(128) NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"owner_id" varchar(128),
	"name" varchar(128),
	"expires" timestamp (3),
	CONSTRAINT "api_keys_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" varchar(128) NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(64) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"source_id" integer NOT NULL,
	"destination_id" integer NOT NULL,
	"delay" integer,
	"retry_count" integer,
	"retry_delay" integer,
	"retry_type" varchar,
	"flux_config" json,
	CONSTRAINT "connections_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "connections_source_id_destination_id_unique" UNIQUE("source_id","destination_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" varchar(128) NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(64) NOT NULL,
	"url" varchar(128) NOT NULL,
	"websocket_connection" boolean DEFAULT false NOT NULL,
	CONSTRAINT "destinations_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" varchar(128) NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(64) NOT NULL,
	"tool" varchar,
	"config" json,
	CONSTRAINT "integrations_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"email" varchar(128) NOT NULL,
	"role" varchar,
	"organization_id" integer NOT NULL,
	CONSTRAINT "organization_invites_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"customer_id" varchar(128) NOT NULL,
	"organization_id" integer NOT NULL,
	"role" varchar,
	CONSTRAINT "organization_members_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"personal" boolean DEFAULT false NOT NULL,
	"plan" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organizations_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" varchar(128) NOT NULL,
	"public_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar(64) NOT NULL,
	"url" varchar(128),
	"integration_id" integer,
	CONSTRAINT "sources_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "con_workspace_id_idx" ON "connections" ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dst_workspace_id_idx" ON "destinations" ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "itg_workspace_id_idx" ON "integrations" ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "itg_name_idx" ON "integrations" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "organization_invites" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_id_idx" ON "organization_members" ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_id_idx" ON "organization_members" ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "src_workspace_id_idx" ON "sources" ("workspace_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connections" ADD CONSTRAINT "connections_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connections" ADD CONSTRAINT "connections_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sources" ADD CONSTRAINT "sources_integration_id_integrations_id_fk" FOREIGN KEY ("integration_id") REFERENCES "integrations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

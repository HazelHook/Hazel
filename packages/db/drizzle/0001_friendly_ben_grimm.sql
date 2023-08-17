CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL,
	"profile_image" varchar
);

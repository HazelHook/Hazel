import type { Config } from "drizzle-kit"

export default {
	schema: "./src/drizzle/schema/index.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: "postgresql://postgres:wowgamingKEKW@db.ptigbydnxtgzgiocsrin.supabase.co:5432/postgres",
	},
} satisfies Config

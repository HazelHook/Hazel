import type { Config } from "drizzle-kit"

export default ({
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DIRECT_DATABASE_URL!,
	},
} satisfies Config)

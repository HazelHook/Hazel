import type { Config } from "drizzle-kit"

export default ({
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	driver: "mysql2",
	dbCredentials: {
		uri: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/hazel?ssl={"rejectUnauthorized":true}`,
	},
} satisfies Config)

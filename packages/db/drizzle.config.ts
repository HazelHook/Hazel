import type { Config } from "drizzle-kit"

export default {
	schema: "./src/schema.ts",
	connectionString:
		'mysql://idba9dft9xnfbpeh7p4m:pscale_pw_FlEj2UL0OWeic5wDE6dx5UhvESh8JhYzC3OfOxlmE8C@aws.connect.psdb.cloud/hazel?ssl={"rejectUnauthorized":true}',
} satisfies Config

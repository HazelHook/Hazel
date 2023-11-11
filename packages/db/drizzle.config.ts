import type { Config } from "drizzle-kit"

export default {
	schema: "./src/schema/index.ts",
	out: "./drizzle",
	driver: "mysql2",
	dbCredentials: {
		uri: 'mysql://fnsc05mswgc4v2wljff3:pscale_pw_Fqzt5XwlNKL02sVcr7wKBjm4j7XJaLVt9kC4Ky05fRN@aws.connect.psdb.cloud/hazel?ssl={"rejectUnauthorized":true}',
	},
} satisfies Config

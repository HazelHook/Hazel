import { connectDB } from "db/src/index"

export default connectDB({
	databaseUrl: process.env.LIBSQL_DB_URL as string,
	authToken: process.env.LIBSQL_DB_AUTH_TOKEN as string,
})

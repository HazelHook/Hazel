import { connectDB } from "@hazel/db/src/drizzle"

const db = connectDB({
	connectionString: process.env.DB_CONNECTION_STRING as string,
})

export default db

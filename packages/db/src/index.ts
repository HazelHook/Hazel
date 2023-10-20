import { connectDB } from "./drizzle"

export const db = connectDB({
	connectionString: process.env.DB_CONNECTION_STRING as string,
})

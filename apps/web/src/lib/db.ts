import { connectDB } from "@hazel/db/src/drizzle"

const db = connectDB({
	username: process.env.DATABASE_USERNAME as string,
	host: process.env.DATABASE_HOST as string,
	password: process.env.DATABASE_PASSWORD as string,
})

export default db

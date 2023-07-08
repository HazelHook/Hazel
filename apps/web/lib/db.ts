import { connectDB } from "db/src/drizzle"

export default connectDB({
	host: process.env.PLANETSCALE_DB_HOST as string,
	username: process.env.PLANETSCALE_DB_USERNAME as string,
	password: process.env.PLANETSCALE_DB_PASSWORD as string,
})

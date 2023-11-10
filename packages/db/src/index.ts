import { connectDB } from "./orm"

export * from "./orm"
export * from "./schema"

export * from "drizzle-orm"

export { default } from "./orm"

export const db = connectDB({
	username: process.env.DATABASE_USERNAME as string,
	host: process.env.DATABASE_HOST as string,
	password: process.env.DATABASE_PASSWORD as string,
})

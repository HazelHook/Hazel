import { connectDB } from "./orm"

import * as schema from "./schema"

export * from "./schema/types"

export * from "./orm"

export * from "drizzle-orm"

export { default } from "./orm"

export const db = connectDB({
	connectionString: process.env.DATABASE_URL as string,
})

export { schema }

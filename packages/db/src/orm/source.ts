import { eq } from "drizzle-orm"

import { DB } from ".."
import { InsertSource, source } from "../schema"

export async function getSource({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.select().from(source).where(eq(source.publicId, publicId)).get()
}

export async function createSource({
	data,
	db,
}: {
	data: InsertSource
	db: DB
}) {
	return await db.insert(source).values(data).returning({ id: source.id, publicId: source.publicId }).get()
}

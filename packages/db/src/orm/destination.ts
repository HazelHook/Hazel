import { eq } from "drizzle-orm"

import { DB } from ".."
import { destination, InsertDestination } from "../schema"

export async function getDestination({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.select().from(destination).where(eq(destination.publicId, publicId)).get()
}

export async function createDestination({
	data,
	db,
}: {
	data: InsertDestination
	db: DB
}) {
	return await db.insert(destination).values(data).returning({ id: destination.id }).get()
}

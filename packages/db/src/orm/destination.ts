import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { DB } from ".."
import { destination, InsertDestination } from "../schema"

export async function getDestination({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.select().from(destination).where(eq(destination.publicId, publicId))
}

export async function getDestinations({
	customerId,
	db,
}: {
	customerId: string
	db: DB
}) {
	return await db.query.destination.findMany({
		where: eq(destination.customerId, customerId),
		with: {
			connections: {
				with: {
					source: true,
				},
			},
		},
	})
}

export async function createDestination({
	data,
	db,
}: {
	data: Omit<InsertDestination, "publicId">
	db: DB
}) {
	const publicId = `src_${nanoid(17)}`
	const res = await db.insert(destination).values({ ...data, publicId })

	return { res, publicId }
}

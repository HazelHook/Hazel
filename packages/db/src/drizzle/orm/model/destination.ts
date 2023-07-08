import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { DB } from ".."
import { destination, InsertDestination } from "../schema"
import { generatePublicId } from "../schema/common"

export async function getDestination({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.query.destination.findFirst({ where: eq(destination.publicId, publicId) })
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
	const publicId = generatePublicId("dst")
	const res = await db.insert(destination).values({ ...data, publicId })

	return { res, publicId }
}

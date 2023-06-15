import { eq } from "drizzle-orm"

import { DB } from ".."
import { InsertSource, source } from "../schema"
import { nanoid } from "nanoid"

export async function getSource({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.query.source.findFirst({
		where: eq(source.publicId, publicId),
		with: {
			connections: {
				with: {
					destination: true,
				},
			},
		},
	})
}

export async function createSource({
	data,
	db,
}: {
	data: Omit<InsertSource, "publicId">
	db: DB
}) {
	return await db
		.insert(source)
		.values({ ...data, publicId: `src_${nanoid(17)}` })
		.returning({ id: source.id, publicId: source.publicId })
		.get()
}

export async function getSources({
	customerId,
	db,
}: {
	customerId: string
	db: DB
}) {
	return await db.query.source.findMany({
		where: eq(source.customerId, customerId),
		with: {
			connections: {
				with: {
					destination: true,
				},
			},
		},
	})
}

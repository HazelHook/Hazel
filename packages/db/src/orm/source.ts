import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { DB } from ".."
import { InsertSource, source } from "../schema"

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
	const publicId = `src_${nanoid(17)}`
	const res = await db.insert(source).values({ ...data, publicId })

	return { res, publicId }
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

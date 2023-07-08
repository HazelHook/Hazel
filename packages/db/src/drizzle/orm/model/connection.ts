import { eq } from "drizzle-orm"

import { DB } from "../.."
import { connection, InsertConnection } from "../../schema"
import { generatePublicId } from "../../schema/common"

export async function getConnection({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.query.connection.findFirst({
		where: eq(connection.publicId, publicId),
		with: {
			destination: true,
			source: true,
		},
	})
}

type GetConnectionsQuery = {
	db: DB
} & (
	| {
			customerId: string
			sourceId?: never
			destinationId?: never
	  }
	| {
			customerId?: never
			sourceId: number
			destinationId?: never
	  }
	| {
			customerId?: never
			sourceId?: never
			destinationId: number
	  }
)

export async function getConnections({ db, customerId, destinationId, sourceId }: GetConnectionsQuery) {
	const where = (() => {
		if (customerId) return eq(connection.customerId, customerId)
		if (destinationId) return eq(connection.destinationId, destinationId)
		if (sourceId) return eq(connection.sourceId, sourceId)
	})()

	return await db.query.connection.findMany({
		where,
		with: {
			source: true,
			destination: true,
		},
	})
}

export async function createConnection({
	data,
	db,
}: {
	data: Omit<InsertConnection, "publicId">
	db: DB
}) {
	const publicId = generatePublicId("con")

	const res = await db.insert(connection).values({ ...data, publicId })

	return { res, publicId }
}

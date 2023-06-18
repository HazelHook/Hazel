import { eq } from "drizzle-orm"

import { DB } from ".."
import { connection, InsertConnection } from "../schema"
import { nanoid } from "nanoid"

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

export async function getConnections({
	customerId,
	db,
}: {
	customerId: string
	db: DB
}) {
	return await db.query.connection.findMany({
		where: eq(connection.customerId, customerId),
		with: {
			source: true,
			destination: true,
		},
	})
}

export async function getConnectionsForSource({
	sourceId,
	db,
}: {
	sourceId: number
	db: DB
}) {
	return await db.query.connection.findMany({
		where: eq(connection.sourceId, sourceId),
		with: {
			destination: true,
			source: true,
		},
	})
}

export async function getConnectionsForDestionations({
	destinationId,
	db,
}: {
	destinationId: number
	db: DB
}) {
	return await db.query.connection.findMany({
		where: eq(connection.destinationId, destinationId),
		with: {
			destination: true,
			source: true,
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
	const publicId = `con_${nanoid(17)}`

	const res = await db.insert(connection).values({ ...data, publicId })

	return { res, publicId }
}

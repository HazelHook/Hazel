import { eq } from "drizzle-orm"

import { DB } from ".."
import { connection, InsertConnection } from "../schema"

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

export const createConnection = async ({
	data,
	db,
}: {
	data: InsertConnection
	db: DB
}) => {
	return db.insert(connection).values(data).returning({ id: connection.id, publicId: connection.publicId }).get()
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
	})
}

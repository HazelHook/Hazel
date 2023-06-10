import { DB } from ".."
import { InsertConnection, connection } from "../schema"

export async function getConnection({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.query.connection.findFirst({
		where: (connection, { eq }) => eq(connection.publicId, publicId),
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
	return db.insert(connection).values(data).returning({ id: connection.id }).get()
}

import { Db } from ".."
import { connection, ConnectionInsertData } from "../schema"

export async function getConnection({
	publicId,
	db,
}: {
	publicId: string
	db: Db
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
	data: ConnectionInsertData
	db: Db
}) => {
	return db.insert(connection).values(data)
}

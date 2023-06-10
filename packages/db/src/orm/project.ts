import { sql } from "drizzle-orm"
import { LibSQLDatabase } from "drizzle-orm/libsql"

import { connection, project } from "../schema"

export async function getProject({
	publicId,
	db,
}: {
	publicId: string
	db: LibSQLDatabase
}) {
	return await db.select().from(project).where(sql`${project.publicId} = ${publicId}`).get()
}

export async function getConnection({
	publicId,
	db,
}: {
	publicId: string
	db: LibSQLDatabase
}) {
	return await db.select().from(connection).where(sql`${connection.publicId} = ${publicId}`).get()
}

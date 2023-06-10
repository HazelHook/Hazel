import { sql } from "drizzle-orm"

import { ProjectInsertData, project } from "../schema"
import { Db } from ".."

export async function getProject({
	publicId,
	db,
}: {
	publicId: string
	db: Db
}) {
	return await db.select().from(project).where(sql`${project.publicId} = ${publicId}`).get()
}

export const createProject = async ({ data, db }: { data: ProjectInsertData; db: Db }) => {
	return db.insert(project).values(data)
}

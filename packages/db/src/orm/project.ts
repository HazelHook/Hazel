import { eq, sql } from "drizzle-orm"

import { DB } from ".."
import { InsertProject, project } from "../schema"

export async function getProject({
	publicId,
	db,
}: {
	publicId: string
	db: DB
}) {
	return await db.select().from(project).where(sql`${project.publicId} = ${publicId}`).get()
}

export async function getProjects({
	customerId,
	db,
}: {
	customerId: string
	db: DB
}) {
	return await db.query.project.findMany({
		where: eq(project.customerId, customerId),
	})
}

export async function createProject({
	data,
	db,
}: {
	data: InsertProject
	db: DB
}) {
	return await db.insert(project).values(data).returning({ id: project.id, publicId: project.publicId }).get()
}

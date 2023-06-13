import { eq, sql } from "drizzle-orm"

import { DB } from ".."
import { InsertProject, project } from "../schema"

export async function getProject({
	publicId,
	db,
}: {
	publicId: string
	db: DB
	with?: {
		connection: {
			destination?: boolean
			source?: boolean
		}
	}
}) {
	return await db.query.project.findFirst({
		where: eq(project.publicId, publicId),
		with: {
			connection: {
				with: {
					source: true,
					destination: true,
				},
			},
		},
	})
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

export async function getFullProjects({
	customerId,
	db,
	include,
}: {
	customerId: string
	db: DB
	include?: {
		connection: {
			destination?: boolean
			source?: boolean
		}
	}
}) {
	return await db.query.project.findMany({
		where: eq(project.customerId, customerId),
		with: {
			connection: {
				with: {
					source: undefined,
					destination: true,
				},
			},
		},
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

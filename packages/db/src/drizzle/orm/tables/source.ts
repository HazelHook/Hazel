import { DrizzleTable } from "../db-table"

import * as schema from "../../schema"
import { and, eq, isNull } from "drizzle-orm"
import { generatePublicId } from "../../schema/common"
import { DB, OptionalExceptFor } from ".."
import { EntityLogic } from "."

const sourceLogic = (db: DB) =>
	({
		table: new DrizzleTable("source", schema.source, db),
		getOne: async ({
			publicId,
			includeDeleted,
		}: {
			publicId: string
			includeDeleted?: boolean
		}) => {
			let filter
			if (!includeDeleted) {
				filter = and(eq(schema.source.publicId, publicId), isNull(schema.source.deletedAt))
			} else {
				filter = eq(schema.source.publicId, publicId)
			}

			return db.query.source.findFirst({
				where: filter,
				with: {
					connections: {
						with: {
							destination: true,
						},
					},
					integration: true,
				},
			})
		},
		getMany: async ({
			workspaceId,
			includeDeleted,
		}: {
			workspaceId: string
			includeDeleted?: boolean
		}) => {
			let filter
			if (!includeDeleted) {
				filter = and(eq(schema.source.workspaceId, workspaceId), isNull(schema.source.deletedAt))
			} else {
				filter = eq(schema.source.workspaceId, workspaceId)
			}

			return await db.query.source.findMany({
				where: filter,
				with: {
					connections: {
						with: {
							destination: true,
						},
					},
					integration: true,
				},
			})
		},
		create: async (data: Omit<schema.InsertSource, "publicId">) => {
			const publicId = generatePublicId("src")
			const res = await db.insert(schema.source).values({
				...data,
				publicId,
			})

			return { publicId }
		},
		update: async (data: OptionalExceptFor<schema.InsertSource, "publicId">) => {
			const { publicId, ...rest } = data
			const res = await db.update(schema.source).set(rest).where(eq(schema.source.publicId, publicId))

			return { publicId }
		},
		markAsDeleted: async ({ publicId }: { publicId: string }) => {
			const res = await db
				.update(schema.source)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(schema.source.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default sourceLogic
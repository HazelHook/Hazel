import { DrizzleTable } from "../db-table"

import * as schema from "../../schema"
import { and, eq, isNull } from "drizzle-orm"
import { generatePublicId } from "../../schema/common"
import { DB, OptionalExceptFor } from ".."
import { EntityLogic } from "."

const connectionLogic = (db: DB) =>
	({
		table: new DrizzleTable("connection", schema.connection, db),
		getOne: async ({
			publicId,
			includeDeleted,
		}: {
			publicId: string
			includeDeleted?: boolean
		}) => {
			let filter
			if (!includeDeleted) {
				filter = and(eq(schema.connection.publicId, publicId), isNull(schema.connection.deletedAt))
			} else {
				filter = eq(schema.connection.publicId, publicId)
			}

			return await db.query.connection.findFirst({
				where: filter,
				with: {
					destination: true,
					source: true,
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
				filter = and(eq(schema.connection.workspaceId, workspaceId), isNull(schema.connection.deletedAt))
			} else {
				filter = eq(schema.connection.workspaceId, workspaceId)
			}

			return await db.query.connection.findMany({
				where: filter,
				with: {
					destination: true,
					source: true,
				},
			})
		},
		create: async (data: Omit<schema.InsertConnection, "publicId">) => {
			const publicId = generatePublicId("con")
			const res = await db.insert(schema.connection).values({
				...data,
				publicId,
			})
			return { publicId }
		},
		update: async (data: OptionalExceptFor<schema.InsertConnection, "publicId">) => {
			const { publicId, ...rest } = data
			const res = await db.update(schema.connection).set(rest).where(eq(schema.connection.publicId, publicId))
			return { publicId }
		},
		markAsDeleted: async ({ publicId }: { publicId: string }) => {
			const res = await db
				.update(schema.connection)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(schema.connection.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default connectionLogic

import { and, eq, isNull } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"

const destinationLogic = (db: DB) =>
	({
		table: new DrizzleTable("destination", schema.destination, db),
		getOne: async ({
			publicId,
			includeDeleted,
		}: {
			publicId: string
			includeDeleted?: boolean
		}) => {
			let filter
			if (!includeDeleted) {
				filter = and(eq(schema.destination.publicId, publicId), isNull(schema.destination.deletedAt))
			} else {
				filter = eq(schema.destination.publicId, publicId)
			}

			return await db.query.destination.findFirst({
				where: filter,
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
				filter = and(eq(schema.destination.workspaceId, workspaceId), isNull(schema.destination.deletedAt))
			} else {
				filter = eq(schema.destination.workspaceId, workspaceId)
			}

			return await db.query.destination.findMany({
				where: filter,
				with: {
					connections: {
						with: {
							source: true,
						},
					},
				},
			})
		},
		create: async (data: Omit<schema.InsertDestination, "publicId">) => {
			const publicId = generatePublicId("dst")
			const res = await db.insert(schema.destination).values({
				...data,
				publicId,
			})

			return { publicId }
		},
		update: async (data: OptionalExceptFor<schema.InsertDestination, "publicId">) => {
			const { publicId, ...rest } = data
			const res = await db.update(schema.destination).set(rest).where(eq(schema.destination.publicId, publicId))

			return { publicId }
		},
		markAsDeleted: async ({ publicId }: { publicId: string }) => {
			const res = await db
				.update(schema.destination)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(schema.destination.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default destinationLogic

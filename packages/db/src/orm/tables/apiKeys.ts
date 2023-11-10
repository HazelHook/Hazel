import { and, eq, isNull } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"

const apiKeysLogic = (db: DB) =>
	({
		table: new DrizzleTable("apiKeys", schema.apiKeys, db),
		getOne: async ({ publicId }: { publicId: string }) => {
			return await db.query.apiKeys.findFirst({
				where: and(eq(schema.apiKeys.publicId, publicId), isNull(schema.apiKeys.deletedAt)),
			})
		},
		getMany: async ({
			workspaceId,
			includeDeleted = false,
		}: {
			workspaceId: string
			includeDeleted?: boolean
		}) => {
			let filter
			if (!includeDeleted) {
				filter = and(eq(schema.apiKeys.workspaceId, workspaceId), isNull(schema.apiKeys.deletedAt))
			} else {
				filter = eq(schema.apiKeys.workspaceId, workspaceId)
			}

			return await db.query.apiKeys.findMany({
				where: filter,
			})
		},
		create: async (data: Omit<schema.InsertApiKey, "publicId">) => {
			const publicId = generatePublicId("sk")
			const res = await db.insert(schema.apiKeys).values({
				...data,
				publicId,
			})
			return { res, publicId }
		},
		update: async (data: OptionalExceptFor<Omit<schema.InsertApiKey, "customerId">, "publicId">) => {
			const res = await db.update(schema.apiKeys).set(data).where(eq(schema.apiKeys.publicId, data.publicId))
			return { publicId: data.publicId }
		},
		markAsDeleted: async ({ publicId }: { publicId: string }) => {
			const res = await db
				.update(schema.apiKeys)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(schema.apiKeys.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default apiKeysLogic

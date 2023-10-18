import { and, eq, isNull } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"

const integrationLogic = (db: DB) =>
	({
		table: new DrizzleTable("integration", schema.integration, db),
		getOne: async ({
			publicId,
			includeDeleted = false,
		}: {
			publicId: string
			includeDeleted?: boolean
		}) => {
			let filter
			if (!includeDeleted) {
				filter = and(eq(schema.integration.publicId, publicId), isNull(schema.integration.deletedAt))
			} else {
				filter = eq(schema.integration.publicId, publicId)
			}

			return await db.query.integration.findFirst({
				where: filter,
				with: {
					source: true,
				},
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
				filter = and(eq(schema.integration.workspaceId, workspaceId), isNull(schema.integration.deletedAt))
			} else {
				filter = eq(schema.integration.workspaceId, workspaceId)
			}

			return await db.query.integration.findMany({
				where: filter,
				with: {
					source: true,
				},
			})
		},
		create: async (data: Omit<schema.InsertIntegration, "publicId">) => {
			const publicId = generatePublicId("itg")
			const res = await db.insert(schema.integration).values({
				...data,
				publicId,
			})
			return { publicId }
		},
		update: async (data: OptionalExceptFor<Omit<schema.InsertIntegration, "workspaceId">, "publicId">) => {
			const res = await db.update(schema.integration).set(data).where(eq(schema.integration.publicId, data.publicId))
			return { publicId: data.publicId }
		},
		markAsDeleted: async ({ publicId }: { publicId: string }) => {
			const res = await db
				.update(schema.integration)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(schema.integration.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default integrationLogic

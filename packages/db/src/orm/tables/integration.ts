import { eq } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"

const integrationLogic = (db: DB) =>
	({
		table: new DrizzleTable("integration", schema.integration, db),
		getOne: async ({ publicId }: { publicId: string }) => {
			return await db.query.integration.findFirst({
				where: eq(schema.integration.publicId, publicId),
				with: {
					source: true,
				},
			})
		},
		getMany: async ({ workspaceId }: { workspaceId: string }) => {
			return await db.query.integration.findMany({
				where: eq(schema.integration.workspaceId, workspaceId),
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
			const res = await db
				.update(schema.integration)
				.set(data)
				.where(eq(schema.integration.publicId, data.publicId))
			return { publicId: data.publicId }
		},
		delete: async ({ publicId }: { publicId: string }) => {
			const res = await db.delete(schema.integration).where(eq(schema.integration.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default integrationLogic

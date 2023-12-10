import { eq } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"
import { InsertConnection } from "../../schema/types"

const connectionLogic = (db: DB) =>
	({
		table: new DrizzleTable("connection", schema.connection, db),
		getOne: async ({ publicId }: { publicId: string }) => {
			return await db.query.connection.findFirst({
				where: eq(schema.connection.publicId, publicId),
				with: {
					destination: true,
					source: {
						with: {
							integration: true,
						},
					},
				},
			})
		},
		getMany: async ({ workspaceId }: { workspaceId: string }) => {
			return await db.query.connection.findMany({
				where: eq(schema.connection.workspaceId, workspaceId),
				with: {
					destination: true,
					source: {
						with: {
							integration: true,
						},
					},
				},
			})
		},
		create: async (data: Omit<InsertConnection, "publicId">) => {
			const publicId = generatePublicId("con")
			const res = await db.insert(schema.connection).values({
				...data,
				publicId,
			})
			return { publicId }
		},
		update: async (data: OptionalExceptFor<InsertConnection, "publicId">) => {
			const { publicId, ...rest } = data
			const res = await db.update(schema.connection).set(rest).where(eq(schema.connection.publicId, publicId))
			return { publicId }
		},
		delete: async ({ publicId }: { publicId: string }) => {
			const res = await db.delete(schema.connection).where(eq(schema.connection.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default connectionLogic

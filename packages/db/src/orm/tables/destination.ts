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
		}: {
			publicId: string
		}) => {
			return await db.query.destination.findFirst({
				where: eq(schema.destination.publicId, publicId),
			})
		},
		getMany: async ({
			workspaceId,
		}: {
			workspaceId: string
		}) => {
			return await db.query.destination.findMany({
				where: eq(schema.destination.workspaceId, workspaceId),
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
		delete: async ({ publicId }: { publicId: string }) => {
			const res = await db.delete(schema.destination)

			.where(eq(schema.destination.publicId, publicId))
			return { publicId }
		},
	}) satisfies EntityLogic

export default destinationLogic

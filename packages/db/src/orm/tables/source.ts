import { and, eq } from "drizzle-orm"

import { BaseFilters } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { TrxType } from "../../utils"
import { DrizzleTable } from "../db-table"

type WithInput = NonNullable<Parameters<DB["query"]["source"]["findFirst"]>[0]>["with"]

const sourceLogic = (db: DB) => ({
	table: new DrizzleTable("source", schema.source, db),
	getOne: async <T extends WithInput>({ publicId, where }: BaseFilters<T>, tx?: TrxType) => {
		const client = tx || db

		return client.query.source.findFirst({
			where: and(eq(schema.source.publicId, publicId), where),
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
	}: {
		workspaceId: string
	}) => {
		return await db.query.source.findMany({
			where: eq(schema.source.workspaceId, workspaceId),
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
	delete: async ({ publicId }: { publicId: string }) => {
		const res = await db.delete(schema.source)

		.where(eq(schema.source.publicId, publicId))
		return { publicId }
	},
})

export default sourceLogic

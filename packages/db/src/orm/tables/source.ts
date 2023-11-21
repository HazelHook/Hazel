import { DBQueryConfig, ExtractTablesWithRelations, SQL, WithSubquery, and, eq, isNull } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"
import { TrxType } from "../../utils"

type Test<T> = {
	publicId: string
	where?: SQL
	include?: T
}

type WithInput = NonNullable<Parameters<DB["query"]["source"]["findFirst"]>[0]>["with"]

const sourceLogic = (db: DB) =>
	({
		table: new DrizzleTable("source", schema.source, db),
		getOne: async <T extends WithInput>({ publicId, where }: Test<T>, tx?: TrxType) => {
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
	}) satisfies EntityLogic

export default sourceLogic

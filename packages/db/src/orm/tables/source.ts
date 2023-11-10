import { SQL, WithSubquery, and, eq, isNull } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"
import { TrxType } from "../../utils"

type Test = {
	publicId: string
	where?: SQL
	include?: any
}

const sourceLogic = (db: DB) =>
	({
		table: new DrizzleTable("source", schema.source, db),
		getOne: async (
			{
				publicId,
				where,
				include = {
					connections: {
						with: {
							destination: true,
						},
					},
					integration: true,
				},
			}: Test,
			tx?: TrxType,
		) => {
			const client = tx || db

			return client.query.source.findFirst({
				where: and(eq(schema.source.publicId, publicId), isNull(schema.source.deletedAt), where),
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
			const filter = and(eq(schema.source.workspaceId, workspaceId), isNull(schema.source.deletedAt))

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

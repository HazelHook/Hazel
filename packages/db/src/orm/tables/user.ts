import { and, eq, isNull } from "drizzle-orm"

import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { DrizzleTable } from "../db-table"

const userLogic = (db: DB) => ({
	table: new DrizzleTable("user", schema.user, db),
	getOne: async ({ id }: { id: string }) => {
		return await db.query.user.findFirst({
			where: eq(schema.user.id, id),
		})
	},
	getOneWithMemberShips: async ({
		id,
		membershipId,
	}: {
		id: string
		membershipId: string
	}) => {
		return await db.query.user.findFirst({
			where: eq(schema.user.id, id),
			with: {
				memberships: {
					where: and(
						eq(schema.organizationMembers.publicId, membershipId),
						isNull(schema.organizationMembers.deletedAt),
					),
					with: {
						organization: true,
					},
				},
			},
		})
	},
	create: async (data: schema.InsertUser) => {
		const res = await db
			.insert(schema.user)
			.values({
				...data,
			})
			.onDuplicateKeyUpdate({
				set: data,
			})

		return { id: data.id }
	},
	update: async (data: OptionalExceptFor<schema.InsertUser, "id">) => {
		const { id, ...rest } = data
		const res = await db.update(schema.user).set(rest).where(eq(schema.user.id, id))

		return { id }
	},
})

export default userLogic

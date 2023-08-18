import { DrizzleTable } from "../db-table"

import * as schema from "../../schema"
import { and, eq, isNull } from "drizzle-orm"
import { DB } from ".."

const userLogic = (db: DB) => ({
	table: new DrizzleTable("user", schema.user, db),
	getOne: async ({
		id,
	}: {
		id: string
	}) => {
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
			.onConflictDoUpdate({
				target: schema.user.id,
				set: data,
			})

		return { id: data.id }
	},
})

export default userLogic

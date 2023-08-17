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
	getOneWithMemberShip: async ({
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
})

export default userLogic

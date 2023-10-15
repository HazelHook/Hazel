import { DataTable } from "./data-table"
import { columns } from "./columns"
import db from "@//lib/db"
import { auth } from "@//lib/auth"
import { Container } from "@//components/ui/container"
import { createOrganizationInvite } from "@//server/actions/organization-invite"
import { sql } from "drizzle-orm"
import { OrganizationMember } from "db/src/drizzle"
import { User } from "@supabase/supabase-js"

interface MemberListPageProps {
	params: {
		org: string
	}
	searchParams: {
		limit: number
		page: number
	}
}

export type AugmentedMember = OrganizationMember & { user?: User }

async function augmentMemberships(memberships: OrganizationMember[]): Promise<AugmentedMember[]> {
	const userIds = memberships.map((m) => m.userId)

	const rawSql = sql`
	SELECT *
	FROM auth.users
	WHERE id IN (${userIds})
`

	const users = (await db.db.execute<Record<string, User[]>>(rawSql)) as any as User[]

	return memberships.reduce((acc: AugmentedMember[], membership: AugmentedMember) => {
		const userData = users.find((user) => user.id === membership.userId)
		if (userData) {
			const augmented = { ...membership, user: userData } as AugmentedMember
			acc.push(augmented)
		} else {
			acc.push(membership as any)
		}
		return acc
	}, [])
}

const MemberListPage = async ({ params, searchParams }: MemberListPageProps) => {
	const { organization } = await auth()

	const memberships = await db.organization.memberships.getMany({ orgId: organization.id })

	const augmentedMemberships = await augmentMemberships(memberships)

	const limit = searchParams.limit || 10
	const offset = searchParams.page ? searchParams.page * limit : 0

	return (
		<Container>
			<DataTable
				columns={columns}
				orgId={organization.id}
				data={augmentedMemberships}
				createInviteAction={createOrganizationInvite}
			/>
		</Container>
	)
}

export default MemberListPage

// export const runtime = "edge"
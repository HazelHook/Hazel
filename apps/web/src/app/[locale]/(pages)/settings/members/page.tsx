import { OrganizationMember, User, sql } from "@hazel/db"
import { Container } from "@hazel/ui/container"

import { createOrganizationInvite } from "@/server/actions/organization-invite"
import { auth } from "@/lib/auth"
import { db } from "@hazel/db"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getSupabaseServerClient } from "@hazel/supabase/clients"

interface MemberListPageProps {
	params: {
		org: string
	}
	searchParams: {
		limit: number
		page: number
	}
}

export type MmeberListPageData = OrganizationMember & { user: User }

const MemberListPage = async ({ searchParams }: MemberListPageProps) => {
	const { organization } = await auth()

	const memberships = await db.organization.memberships.getMany({
		orgId: organization.id,
	})

	const limit = searchParams.limit || 10
	const offset = searchParams.page ? searchParams.page * limit : 0

	return (
		<Container>
			<DataTable
				columns={columns}
				orgId={organization.id}
				data={memberships}
				createInviteAction={createOrganizationInvite}
			/>
		</Container>
	)
}

export default MemberListPage

// export const runtime = "edge"

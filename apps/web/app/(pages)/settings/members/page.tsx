import { redirect } from "next/navigation"
import { DataTable } from "./dataTable"
import { columns } from "./columns"
import db from "@/lib/db"
import { auth } from "@/lib/auth"
import { Container } from "@/components/ui/container"
import { createOrganizationInvite } from "../_actions"

interface MemberListPageProps {
	params: {
		org: string
	}
	searchParams: {
		limit: number
		page: number
	}
}

const MemberListPage = async ({ params, searchParams }: MemberListPageProps) => {
	const { organization } = await auth()
	// TODO: DIFFERENT ORGS + PAGINATION
	if (params.org === "personal") {
		redirect("/app/personal")
	}

	const memberships = await db.organization.memberships.getMany({ orgId: organization.id })

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

export const runtime = "edge"

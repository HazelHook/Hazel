import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { Container } from "@/components/ui/container"
import { TableWrapper } from "./_components/TableWrapper"
import { createOrganizationInvite, revokeOrganizationInvite } from "@/server/actions/organization-invite"

const MemberListPage = async ({ params, searchParams }: any) => {
	const { organization } = await auth()

	if (params.org === "personal") {
		redirect("/app/personal")
	}

	const invites = await db.organization.invite.getMany({ orgId: organization.id })
	const limit = searchParams.limit || 10
	const offset = searchParams.page ? searchParams.page * limit : 0

	return (
		<Container>
			<TableWrapper
				revokeAction={revokeOrganizationInvite}
				inviteAction={createOrganizationInvite}
				orgId={organization.id}
				invites={invites}
			/>
		</Container>
	)
}

export default MemberListPage

// export const runtime = "edge"

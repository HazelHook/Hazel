import { deleteOrganzationAction } from "@/server/actions/organization"
import { auth } from "@/lib/auth"

import { Container } from "@hazel/ui/container"
import { PageHeader } from "@hazel/ui/page-header"

import { DeleteOrganizationDialog } from "./dialog"

const DangerPage = async () => {
	const { workspaceId, organization, userId } = await auth()

	const isAllowedToDelete = organization.ownerId === userId

	return (
		<Container>
			<PageHeader title="Danger Zone" subtitle="Be careful most things here can't be reverted" />

			<div>
				<DeleteOrganizationDialog
					organizationId={workspaceId}
					deleteAction={deleteOrganzationAction}
					isAllowedToDelete={isAllowedToDelete}
				/>
			</div>
		</Container>
	)
}

// export const runtime = "edge"

export default DangerPage

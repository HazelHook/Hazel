import { Container } from "@//components/ui/container"

import { auth } from "@//lib/auth"
import { DeleteOrganizationDialog } from "./dialog"
import { deleteOrganzationAction } from "@//server/actions/organization"
import { PageHeader } from "@//components/ui/page-header"

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

export default DangerPage

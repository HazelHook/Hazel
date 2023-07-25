import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { auth } from "@/lib/auth"
import { DeleteOrganizationDialog } from "./dialog"
import { deleteOrganzationAction } from "@/server/actions/organization"

const DangerPage = async () => {
	const { workspaceId, organization, userId } = await auth()

	const isAllowedToDelete = organization.ownerId === userId

	return (
		<Container>
			<div>
				<h1 className="text-3xl font-bold">Danger Zone</h1>
				<p className="text-lg">Be careful most things here can't be reverted</p>
			</div>

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

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@hazel/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hazel/ui/dialog"

import type { deleteOrganzationAction } from "@/server/actions/organization"
import { useAction } from "@/server/client"

interface OrganizationDeleteDialogProps {
	isAllowedToDelete: boolean
	organizationId: string
	deleteAction: typeof deleteOrganzationAction
}

export const DeleteOrganizationDialog = ({
	organizationId,
	deleteAction,
	isAllowedToDelete,
}: OrganizationDeleteDialogProps) => {
	const router = useRouter()

	const handleDeletion = useAction(deleteAction, {
		onSuccess: () => {
			router.refresh()
			router.push("/")
		},
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive" disabled={isAllowedToDelete}>
					Delete Organization
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="mb-4">
					<DialogTitle>Are you sure you want to delete the organization?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the organization and remove all data from our
						servers.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Cancel</Button>
					</DialogClose>

					<Button variant="destructive" onClick={() => handleDeletion.mutate({ publicId: organizationId })}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

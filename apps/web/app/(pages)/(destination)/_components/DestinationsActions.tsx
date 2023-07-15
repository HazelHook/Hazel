import { deleteDestinationAction, updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"
import { UpdateIntegrationForm } from "@/app/(pages)/(integration)/_components/UpdateIntegrationForm"
import type {
	deleteIntegrationAction,
	updateIntegrationAction,
} from "@/app/(pages)/(integration)/integrations/_actions"
import { DeleteDustbinIcon } from "@/components/icons/pika/deleteDustbin"
import { EditPencilIcon } from "@/components/icons/pika/editPencil"
import { Button } from "@/components/ui/button"
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
import { useAction } from "@/server/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const DestinationsActions = ({
	updateAction,
	deleteAction,
	data,
}: {
	data: DestinationsDataRowType
	updateAction: typeof updateDestinationAction
	deleteAction: typeof deleteDestinationAction
}) => {
	const router = useRouter()

	const deleteIntegration = useAction(deleteAction, {
		onSuccess() {
			router.refresh()
		},
	})

	return (
		<div className="flex justify-end">
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="ghost">
						<EditPencilIcon className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-sm">
					{/* <UpdateIntegrationForm
						data={data}
						integration={INTEGRATIONS[tool]}
						onClose={() => {}}
						updateAction={updateAction}
					/> */}
				</DialogContent>
			</Dialog>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="ghost" disabled={data.connections.length > 0} onClick={(e) => e.stopPropagation()}>
						<DeleteDustbinIcon className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Are you sure you want to delete this Destination?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently delete this destination forever?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button>Cancel</Button>
						</DialogClose>
						<Button
							type="submit"
							onClick={() => {
								toast.promise(deleteIntegration.mutateAsync(data.publicId), {
									loading: "Deleting Destination...",
									success: "Destination Successfully Deleted",
									error: "There was an error deleting your Destination. Please try again or contact us.",
								})
							}}
							variant="destructive"
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

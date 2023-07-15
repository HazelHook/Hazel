import { useRouter } from "next/navigation"
import { TRPC_ERROR_CODE_NUMBER, TRPCResponse } from "@trpc/server/rpc"
import { toast } from "sonner"
import { typeToFlattenedError } from "zod"

import { useAction } from "@/server/client"
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
import { DeleteDustbinIcon } from "@/components/icons/pika/deleteDustbin"
import { EditPencilIcon } from "@/components/icons/pika/editPencil"
import { deleteDestinationAction, updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { UpdateDestinationForm } from "@/app/(pages)/(destination)/_components/UpdateDestinationForm"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"

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
					<UpdateDestinationForm data={data} updateAction={updateAction} />
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

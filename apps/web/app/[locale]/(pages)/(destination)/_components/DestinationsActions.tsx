import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useAction } from "@/server/client"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { DestinationsDataRowType } from "@/app/[locale]/(pages)/(destination)/destinations/page"
import type { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"

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
			<Link href={`/destination/${data.publicId}/settings`} className={buttonVariants({ variant: "ghost" })}>
				<EditPencilIcon className="h-4 w-4" />
			</Link>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="ghost" disabled={data.connections.length > 0}>
						<DeleteDustbinIcon className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Are you sure you want to delete this Destination?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently delete this destination
							forever?
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

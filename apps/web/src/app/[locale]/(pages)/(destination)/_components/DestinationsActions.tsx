import Link from "next/link"
import { useRouter } from "next/navigation"

import type { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"
import { DestinationsDataRowType } from "@/app/[locale]/(pages)/(destination)/destinations/page"

import { useAction } from "@hazel/server/actions/client"
import { Button, buttonVariants } from "@hazel/ui/button"
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
import { toast } from "sonner"
import { IconEdit } from "@tabler/icons-react"
import { Icons } from "@/components/icons"

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
				<IconEdit className="h-4 w-4" />
			</Link>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="ghost" disabled={data.connections.length > 0}>
						<Icons.Delete className="h-4 w-4" />
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

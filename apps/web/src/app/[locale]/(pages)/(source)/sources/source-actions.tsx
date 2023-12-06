import Link from "next/link"
import { useRouter } from "next/navigation"

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
import { Column } from "./columns"
import { deleteSourceAction } from "@/server/actions/source"
import { IconEdit } from "@tabler/icons-react"
import { Icons } from "@/components/icons"

export const SourceActions = ({
	deleteAction,
	data,
}: {
	data: Column
	deleteAction: typeof deleteSourceAction
}) => {
	const router = useRouter()

	const deleteIntegration = useAction(deleteAction, {
		onSuccess() {
			router.refresh()
		},
	})

	return (
		<div className="flex justify-end">
			<Link href={`/source/${data.publicId}/settings`} className={buttonVariants({ variant: "ghost" })}>
				<IconEdit className="h-4 w-4" />
			</Link>

			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="ghost"
						onClick={(e) => {
							e.stopPropagation()
						}}
						disabled={data.connections.length > 0}
					>
						<Icons.Delete className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Are you sure you want to delete this Source?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently delete this source
							forever?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								onClick={(e) => {
									e.stopPropagation()
								}}
							>
								Cancel
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button
								type="submit"
								onClick={(e) => {
									e.stopPropagation()
									toast.promise(deleteIntegration.mutateAsync(data.publicId), {
										loading: "Deleting Source...",
										success: "Source Successfully Deleted",
										error: "There was an error deleting your Source. Please try again or contact us.",
									})
								}}
								variant="destructive"
							>
								Delete
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

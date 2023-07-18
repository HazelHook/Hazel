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
import type { deleteConnectionAction, pauseConnectionAction } from "@conn/_actions"
import Link from "next/link"
import { ConnectionDataRowType } from "@conn/connections/page"
import { ClockIcon } from "@/components/icons/pika/clock"
import { PlayBigIcon } from "@/components/icons/pika/playBig"

export const ConnectionActions = ({
	deleteAction,
	pauseAction,
	data,
}: {
	data: ConnectionDataRowType
	deleteAction: typeof deleteConnectionAction
	pauseAction: typeof pauseConnectionAction
}) => {
	const router = useRouter()

	const handleDelete = useAction(deleteAction, {
		onSuccess() {
			router.refresh()
		},
	})

	const handlePause = useAction(pauseAction, {
		onSuccess() {
			router.refresh()
		},
	})

	return (
		<div className="flex justify-end">
			<Link href={`/connection/${data.publicId}/settings`} className={buttonVariants({ variant: "ghost" })}>
				<EditPencilIcon className="h-4 w-4" />
			</Link>
			<Button
				onClick={() =>
					handlePause.mutate({
						publicId: data.publicId,
						enabled: !data.enabled,
					})
				}
				variant="ghost"
			>
				{data.enabled ? <ClockIcon className="h-4 w-4" /> : <PlayBigIcon className="h-4 w-4" />}
			</Button>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="ghost">
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
								toast.promise(handleDelete.mutateAsync(data.publicId), {
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

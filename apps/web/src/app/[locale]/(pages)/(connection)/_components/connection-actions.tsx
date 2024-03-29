import Link from "next/link"
import { useRouter } from "next/navigation"

import type { deleteConnectionAction, pauseConnectionAction } from "@/server/actions/connections"
import { ConnectionDataRowType } from "@/app/[locale]/(pages)/(connection)/connections/page"

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@hazel/ui/tooltip"
import { toast } from "sonner"
import { IconClock, IconEdit, IconPlayerPlay, IconTrash } from "@tabler/icons-react"

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
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={`/connection/${data.publicId}/settings`}
						className={buttonVariants({ variant: "ghost" })}
					>
						<IconEdit className="h-4 w-4" />
					</Link>
				</TooltipTrigger>
				<TooltipContent>Edit Connection</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						onClick={() =>
							toast.promise(
								handlePause.mutateAsync({
									publicId: data.publicId,
									enabled: !data.enabled,
								}),
								{
									loading: data.enabled ? "Pausing Connection..." : "Enabling Connection",
									success: data.enabled
										? "Connection Successfully Paused..."
										: "Connection Successfully Enabled",
									error: "There was an error changing the status of your Connection	. Please try again or contact us.",
								},
							)
						}
						variant="ghost"
					>
						{data.enabled ? <IconClock className="h-4 w-4" /> : <IconPlayerPlay className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>{data.enabled ? "Pause Connection" : "Resume Connection"}</TooltipContent>
			</Tooltip>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="destructive_ghost">
						<IconTrash className="h-4 w-4" />
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

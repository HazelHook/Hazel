import { UpdateIntegrationForm } from "@/app/(pages)/(integration)/_components/UpdateIntegrationForm"
import type { deleteIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
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
import { INTEGRATIONS } from "db/src/drizzle/integrations/data"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const IntegrationsActions = ({
	deleteAction,
	tool,
	numOfSources,
	integrationId,
}: {
	tool: keyof typeof INTEGRATIONS
	numOfSources: number
	integrationId: string
	deleteAction: typeof deleteIntegrationAction
}) => {
	const router = useRouter()

	const deleteIntegration = useAction(deleteAction, {
		onSuccess(data) {
			router.refresh()
		}, // TODO
		onError(error) {}, // TODO
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
					<UpdateIntegrationForm integration={INTEGRATIONS[tool]} onClose={() => {}} />
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button
							type="submit"
							onClick={() => {
								toast.promise(async () => {}, {
									loading: "Update Integration...",
									success: "Integration Successfully Updated",
									error: "There was an error updating your Integration. Please try again or contact us.",
								})
							}}
						>
							Update
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="ghost" disabled={numOfSources > 0}>
						<DeleteDustbinIcon className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Are you sure you want to delete this Integration?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently delete this integration forever?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button>Cancel</Button>
						</DialogClose>
						<Button
							type="submit"
							onClick={() => {
								toast.promise(deleteIntegration.mutateAsync(integrationId), {
									loading: "Deleting Integration...",
									success: "Integration Successfully Integrated",
									error: "There was an error deleting your Integration. Please try again or contact us.",
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

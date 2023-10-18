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
import { INTEGRATIONS } from "db/src/drizzle/integrations/data"
import { Integration } from "db/src/drizzle/schema"
import { toast } from "sonner"

import type { deleteIntegrationAction, updateIntegrationAction } from "@/server/actions/integrations"
import { useAction } from "@/server/client"
import { UpdateIntegrationForm } from "@/components/forms/integration/UpdateIntegrationForm"
import { DeleteDustbinIcon } from "@/components/icons/pika/deleteDustbin"
import { EditPencilIcon } from "@/components/icons/pika/editPencil"

export const IntegrationsActions = ({
	updateAction,
	deleteAction,
	tool,
	numOfSources,
	integrationId,
	data,
}: {
	data: Integration
	tool: keyof typeof INTEGRATIONS
	numOfSources: number
	integrationId: string
	updateAction: typeof updateIntegrationAction
	deleteAction: typeof deleteIntegrationAction
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
					<UpdateIntegrationForm
						data={data}
						integration={INTEGRATIONS[tool]}
						onClose={() => {}}
						updateAction={updateAction}
					/>
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

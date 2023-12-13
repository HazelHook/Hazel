"use client"

import { regenerateOrganizationSecretAction } from "@/server/actions/organization"
import { useAction } from "@hazel/server/actions/client"
import { router } from "@hazel/server/actions/trpc"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@hazel/ui/alert-dialog"
import { Button } from "@hazel/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type ApiKeyConfirmationProps = {
	regenerateAction: typeof regenerateOrganizationSecretAction
}

export const ApiKeyConfirmation = ({ regenerateAction }: ApiKeyConfirmationProps) => {
	const router = useRouter()

	const action = useAction(regenerateAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Regenerate</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						Your old key is not going to function anymore. Please only do this if in doubt you might have
						exposed your Key somewhere.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() =>
							toast.promise(action.mutateAsync(), {
								success: "Sucessfully Regenerated Secret",
								loading: "Regenerating Secret",
								error: "There was an error regenerating your Secret please try again.",
							})
						}
					>
						Regenerate
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

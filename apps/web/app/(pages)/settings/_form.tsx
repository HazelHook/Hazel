"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import type { createApiKeyAction } from "./_actions"

export const ApiKeyForm = ({
	createAction,
	customerId,
}: {
	createAction: typeof createApiKeyAction
	customerId: string
}) => {
	const router = useRouter()

	const createSource = useAction(createAction, {
		onSuccess(data) {
			router.refresh()
		},
	})

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Create New</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new API Key</DialogTitle>
				</DialogHeader>
				<DialogClose asChild>
					<Button
						onClick={() =>
							toast.promise(
								createSource.mutateAsync({
									customerId,
								}),
								{
									loading: "Creating new API Key...",
									success: "Successfully created new Api Key",
									error: "There was an error creating api key. Please try again or contact us.",
								},
							)
						}
					>
						Create
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	)
}

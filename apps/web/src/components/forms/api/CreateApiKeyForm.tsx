"use client"

import { useRouter } from "next/navigation"
import AutoForm from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"

import type { createApiKeyAction } from "@/server/actions/api-keys"
import { useAction } from "@hazel/server/actions/client"

import { createApiKeySchema } from "@/lib/schemas/api-key"

interface CreateApiKeyFormProps {
	createAction: typeof createApiKeyAction
	workspaceId: string
	onSuccess?: () => void
}

export const CreateApiKeyForm = ({ createAction, workspaceId, onSuccess }: CreateApiKeyFormProps) => {
	const router = useRouter()

	const createKey = useAction(createAction, {
		onSuccess: () => {
			onSuccess?.()
			router.refresh()
		},
	})

	return (
		<AutoForm
			formSchema={createApiKeySchema}
			toastValues={{
				loading: "Creating new API Key...",
				success: "Successfully created new Api Key",
				error: "There was an error creating api key. Please try again or contact us.",
			}}
			onSubmit={async (data) => {
				await createKey.mutateAsync({ ...data, workspaceId })
			}}
		>
			<Button type="submit" disabled={createKey.status === "loading"} loading={createKey.status === "loading"}>
				Create
			</Button>
		</AutoForm>
	)
}

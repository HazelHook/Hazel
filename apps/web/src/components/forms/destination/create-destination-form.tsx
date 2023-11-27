"use client"

import { useRouter } from "next/navigation"

import type { createDestinationAction } from "@/server/actions/destination"
import { createDestinationSchema } from "@/lib/schemas/destination"

import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"

interface CreateDestinationFormProps {
	action: typeof createDestinationAction
	shouldRedirect?: boolean
	onSuccess?: (id: string) => void
}

export function CreateDestinationForm({ onSuccess, action, shouldRedirect = true }: CreateDestinationFormProps) {
	const router = useRouter()

	const createSource = useAction(action, {
		onSuccess(data) {
			router.refresh()
			if (shouldRedirect) {
				router.push(`/destination/${data.id}/`)
			}

			onSuccess?.(data.id)
		},
	})

	return (
		<AutoForm
			onSubmit={async (data) => {
				await createSource.mutateAsync(data)
			}}
			formSchema={createDestinationSchema}
			fieldConfig={{
				name: {
					description: "A name to identify your destination.",
					inputProps: {
						placeholder: "Destination Name",
					},
				},
				url: {
					description: "HTTP endpoint of your backend or api",
					inputProps: {
						placeholder: "e.g brand.domain/webhook",
					},
				},
			}}
		>
			<Button
				type="submit"
				disabled={createSource.status === "loading"}
				loading={createSource.status === "loading"}
			>
				Create
			</Button>
		</AutoForm>
	)
}

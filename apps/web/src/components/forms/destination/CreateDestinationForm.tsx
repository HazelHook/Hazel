"use client"

import { useRouter } from "next/navigation"
import AutoForm from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"

import type { createDestinationAction } from "@/server/actions/destination"
import { useAction } from "@/server/client"
import { createDestinationSchema } from "@/lib/schemas/destination"

interface CreateDestinationFormProps {
	action: typeof createDestinationAction
	shouldRedirect?: boolean
	onClose?: (id: string) => void
}

export function CreateDestinationForm({ onClose, action, shouldRedirect = true }: CreateDestinationFormProps) {
	const router = useRouter()

	const createSource = useAction(action, {
		onSuccess(data) {
			router.refresh()
			if (shouldRedirect) {
				router.push(`/destination/${data.id}/`)
			}

			onClose?.(data.id)
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

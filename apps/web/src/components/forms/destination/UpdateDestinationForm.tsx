"use client"

import { useRouter } from "next/navigation"
import { Destination } from "@hazel/db/src/drizzle/schema"
import AutoForm from "@hazel/ui/auto-form"
import { LoadingButton } from "@hazel/ui/loading-button"

import type { updateDestinationAction } from "@/server/actions/destination"
import { useAction } from "@hazel/server/actions/client"

import { updateDestinationSchema } from "@/lib/schemas/destination"

export const UpdateDestinationForm = ({
	destination,
	updateAction,
	onClose,
	isModal,
}: {
	destination: Destination
	updateAction: typeof updateDestinationAction
	isModal?: boolean
	onClose?: (id: string) => void
}) => {
	const router = useRouter()

	const updateDestination = useAction(updateAction, {
		onSuccess() {
			onClose?.(destination.publicId)

			if (isModal) {
				router.back()
			}

			router.refresh()
		},
	})

	return (
		<AutoForm
			onSubmit={async (values) => {
				await updateDestination.mutateAsync({
					...values,
					publicId: destination.publicId,
				})
			}}
			toastValues={{
				loading: "Update Destination...",
				success: "Destination Successfully Updated",
				error: "There was an error updating your Destination. Please try again or contact us.",
			}}
			defaultValues={destination}
			formSchema={updateDestinationSchema}
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
			<LoadingButton type="submit" loading={updateDestination.status === "loading"}>
				Create
			</LoadingButton>
		</AutoForm>
	)
}

"use client"

import { useRouter } from "next/navigation"

import { updateSourceAction } from "@/server/actions/source"
import { updateSourceSchema } from "@/lib/schemas/source"

import { Integration, Source } from "@hazel/db/schema"
import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"

interface UpdateSourceFormProps {
	source: Source
	action: typeof updateSourceAction
	integrations: Integration[]
	shouldRedirect?: boolean
	onSuccess?: (id: string) => void
}

export function UpdateSourceForm({ onSuccess, source, action, integrations }: UpdateSourceFormProps) {
	const router = useRouter()

	const updateSource = useAction(action, {
		onSuccess(data) {
			router.refresh()

			onSuccess?.(data.id)
		},
	})

	return (
		<AutoForm
			defaultValues={{ ...source }}
			onSubmit={async (data) => {
				await updateSource.mutateAsync({
					...(data as any),
					publicId: source.publicId,
				})
			}}
			formSchema={updateSourceSchema.omit({ publicId: true, integrationId: true })}
			fieldConfig={{
				name: {
					description: "A name to identify your sources.",
					inputProps: {
						placeholder: "Source Name",
					},
				},
			}}
		>
			<Button
				type="submit"
				disabled={updateSource.status === "loading"}
				loading={updateSource.status === "loading"}
			>
				Update
			</Button>
		</AutoForm>
	)
}

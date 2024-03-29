"use client"

import { notFound } from "next/navigation"

import { createIntegrationAction } from "@/server/actions/integrations"

import { createZodIntegrationSchema, IntegrationTool } from "@hazel/integrations/web"
import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { LoadingButton } from "@hazel/ui/loading-button"

export const NewIntegrationForm = ({
	integration: { config, slug },
	onSuccess,
}: {
	integration: IntegrationTool
	onSuccess?: (id: string) => void
}) => {
	if (!config) return notFound()

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			onSuccess?.(data.id)
		},
	})

	const schema = createZodIntegrationSchema(config)

	// <LabeledSeparator label="Configuration" className="pt-4" />

	return (
		<AutoForm
			className="w-full"
			formSchema={schema}
			fieldConfig={config.schema}
			onSubmit={async (data) => createIntegration.mutateAsync({ config: data, tool: slug })}
		>
			<LoadingButton type="submit" loading={createIntegration.status === "loading"}>
				Create Integration
			</LoadingButton>
		</AutoForm>
	)
}

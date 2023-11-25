"use client"

import { notFound, useRouter } from "next/navigation"
import { createZodIntegrationSchema, IntegrationTool } from "@hazel/integrations/web"

import { createIntegrationAction } from "@/server/actions/integrations"
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
			// router.refresh()
		},
	})

	const schema = createZodIntegrationSchema(config)

	// <LabeledSeparator label="Configuration" className="pt-4" />

	return (
		<AutoForm
			className="w-full"
			formSchema={schema}
			fieldConfig={config.schema as any}
			onSubmit={async (data) => createIntegration.mutateAsync({ config: data, tool: slug })}
		>
			<LoadingButton type="submit" loading={createIntegration.status === "loading"}>
				Create Integration
			</LoadingButton>
		</AutoForm>
	)
}

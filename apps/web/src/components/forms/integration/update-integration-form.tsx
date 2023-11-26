"use client"

import { notFound, useRouter } from "next/navigation"
import { createZodIntegrationSchema, IntegrationTool } from "@hazel/integrations/web"
import { Integration } from "@hazel/db/schema"

import { updateIntegrationAction } from "@/server/actions/integrations"
import { useAction } from "@hazel/server/actions/client"

import { AutoForm } from "@hazel/ui/auto-form"
import { LoadingButton } from "@hazel/ui/loading-button"

export const UpdateIntegrationForm = ({
	data,
	integration,
	updateAction,
	onSuccess,
}: {
	data: Integration
	integration: IntegrationTool
	updateAction: typeof updateIntegrationAction
	onSuccess?: (id: string) => void
}) => {
	const { config, slug } = integration
	const router = useRouter()

	if (!config) {
		return notFound()
	}

	const schema = createZodIntegrationSchema(integration.config!)

	const updateIntegration = useAction(updateAction, {
		onSuccess() {
			onSuccess?.(data.publicId)
			router.refresh()
		},
	})

	return (
		<AutoForm
			className="w-full"
			formSchema={schema}
			defaultValues={data.config}
			fieldConfig={config.schema}
			onSubmit={async (data) =>
				await updateIntegration.mutateAsync({ publicId: data.publicId, tool: slug, config: data })
			}
			toastValues={{
				loading: "Update Integration...",
				success: "Integration Successfully Updated",
				error: "There was an error updating your Integration. Please try again or contact us.",
			}}
		>
			<LoadingButton type="submit" loading={updateIntegration.status === "loading"}>
				Update
			</LoadingButton>
		</AutoForm>
	)
}

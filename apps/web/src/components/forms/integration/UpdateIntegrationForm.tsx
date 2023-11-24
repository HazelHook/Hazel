"use client"

import { notFound, useRouter } from "next/navigation"
import { createZodIntegrationSchema, IntegrationTool } from "@hazel/integrations/web"
import { Integration } from "@hazel/db/schema"
import { Button } from "@hazel/ui/button"
import { Form } from "@hazel/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { updateIntegrationAction } from "@/server/actions/integrations"
import { useAction } from "@hazel/server/actions/client"

import { LabeledSeparator } from "@/components/labeled-separator"
import { IntegrationToolField } from "@/app/[locale]/(pages)/(integration)/_components/IntegrationToolField"

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
		notFound()
	}

	const schema = createZodIntegrationSchema(integration.config!) as any

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: data as any,
	})

	const updateIntegration = useAction(updateAction, {
		onSuccess() {
			onSuccess?.(data.publicId)
			router.refresh()
		},
	})

	function onSubmit(values: any) {
		const { name, ...rest } = values

		toast.promise(
			updateIntegration.mutateAsync({
				publicId: data.publicId,
				config: rest,
				tool: slug as any,
				name: name as string,
			}),
			{
				loading: "Update Integration...",
				success: "Integration Successfully Updated",
				error: "There was an error updating your Integration. Please try again or contact us.",
			},
		)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{Object.entries(config.general).map(([key, config]) => (
					<IntegrationToolField fieldDef={config} pathKey={key} key={key} control={form.control} />
				))}
				<LabeledSeparator label="Configuration" className="pt-4" />
				{Object.entries(config.fields).map(([key, integField]) => (
					<IntegrationToolField fieldDef={integField as any} pathKey={key} key={key} control={form.control} />
				))}

				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={updateIntegration.status === "loading"}
						loading={updateIntegration.status === "loading"}
					>
						Update
					</Button>
				</div>
			</form>
		</Form>
	)
}

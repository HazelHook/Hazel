"use client"

import { IntegrationToolField } from "@/app/(pages)/(integration)/_components/IntegrationToolField"
import { createIntegrationAction, updateIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import { useAction } from "@/server/client"
import { IntegrationTool } from "db/src/drizzle/integrations/common"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Integration } from "db/src/drizzle/schema"

export const UpdateIntegrationForm = ({
	data,
	integration,
	updateAction,
	onClose,
}: {
	data: Integration
	integration: IntegrationTool
	updateAction: typeof updateIntegrationAction
	onClose?: (id: string) => void
}) => {
	const { config, slug } = integration
	const router = useRouter()

	if (!config) return notFound()

	const form = useForm({
		defaultValues: data as any,
	})

	const updateIntegration = useAction(updateAction, {
		onSuccess() {
			onClose?.(data.publicId)
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

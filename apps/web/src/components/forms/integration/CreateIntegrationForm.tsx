"use client"

import { notFound, useRouter } from "next/navigation"
import { createZodIntegrationSchema, IntegrationTool } from "@hazel/db/integrations"
import { Button } from "@hazel/ui/button"
import { Form } from "@hazel/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createIntegrationAction } from "@/server/actions/integrations"
import { useAction } from "@hazel/server/actions/client"

import { LabeledSeparator } from "@/components/labeled-separator"
import { IntegrationToolField } from "@/app/[locale]/(pages)/(integration)/_components/IntegrationToolField"

export const NewIntegrationForm = ({
	integration: { config, slug },
	onSuccess,
}: {
	integration: IntegrationTool
	onSuccess?: (id: string) => void
}) => {
	const router = useRouter()

	if (!config) return notFound()

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			onSuccess?.(data.id)
			router.refresh()
		},
	})

	function onSubmit({ name, ...data }: any) {
		createIntegration.mutate({
			config: data,
			tool: slug,
			name: name,
		})
	}
	const schema = createZodIntegrationSchema(config) as any

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
				{Object.entries(config.general).map(([key, config]) => (
					<IntegrationToolField control={form.control} fieldDef={config} pathKey={key} key={key} />
				))}
				<LabeledSeparator label="Configuration" className="pt-4" />
				{Object.entries(config.fields).map(([key, integField]) => (
					<IntegrationToolField control={form.control} fieldDef={integField as any} pathKey={key} key={key} />
				))}

				<Button
					type="submit"
					disabled={createIntegration.status === "loading"}
					loading={createIntegration.status === "loading"}
					className="w-full mt-5"
				>
					Create Integration
				</Button>
			</form>
		</Form>
	)
}

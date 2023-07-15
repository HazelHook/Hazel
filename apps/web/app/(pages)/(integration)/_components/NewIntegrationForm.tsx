"use client"

import { IntegrationToolField } from "@/app/(pages)/(integration)/_components/IntegrationToolField"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import { useAction } from "@/server/client"
import { IntegrationTool, createZodIntegrationSchema } from "db/src/drizzle/integrations/common"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const NewIntegrationForm = ({
	integration: { config, slug },
	onClose,
}: {
	integration: IntegrationTool
	onClose?: (id: string) => void
}) => {
	const router = useRouter()

	if (!config) return notFound()

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			onClose?.(data.id)
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
	const schema = createZodIntegrationSchema(config)

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

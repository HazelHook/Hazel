"use client"

import { IntegrationToolField } from "@/app/(pages)/(integration)/_components/IntegrationToolField"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
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

export const UpdateIntegrationForm = ({
	integration,
	onClose,
}: {
	integration: IntegrationTool
	onClose?: (id: string) => void
}) => {
	const { config, slug } = integration
	const router = useRouter()

	if (!config) return notFound()

	const form = useForm({
		defaultValues: {
			name: "",
			url: "",
		},
	})

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			onClose?.(data.id)
			router.refresh()
		},
	})

	function onSubmit(values: any) {
		const { name, ...data } = Object.fromEntries(new FormData(values.currentTarget))
		createIntegration.mutate({
			config: data,
			tool: slug as any,
			name: name as string,
		})
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
						disabled={createIntegration.status === "loading"}
						loading={createIntegration.status === "loading"}
					>
						Update
					</Button>
				</div>
			</form>
		</Form>
	)
}

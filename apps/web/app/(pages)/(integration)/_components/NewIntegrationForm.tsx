"use client"

import { IntegrationToolField } from "@/app/(pages)/(integration)/_components/IntegrationToolField"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import { useAction } from "@/server/client"
import { IntegrationTool } from "db/src/drizzle/integrations/common"
import { notFound, useRouter } from "next/navigation"
import * as Form from "@radix-ui/react-form"
import { Button } from "@/components/ui/button"

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
			router.replace("/integrations")
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
		<Form.Root className="space-y-2 w-full" onSubmit={onSubmit}>
			{Object.entries(config.general).map(([key, config]) => (
				<IntegrationToolField fieldDef={config} pathKey={key} key={key} />
			))}
			<LabeledSeparator label="Configuration" className="pt-4" />
			{Object.entries(config.fields).map(([key, integField]) => (
				<IntegrationToolField fieldDef={integField as any} pathKey={key} key={key} />
			))}

			<Form.Submit type="submit" disabled={createIntegration.status === "loading"} className="w-full">
				<Button type="submit" disabled={createIntegration.status === "loading"} className="w-full mt-5">
					Create Integration
				</Button>
			</Form.Submit>
		</Form.Root>
	)
}

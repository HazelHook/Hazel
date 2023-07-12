"use client"

import { IntegrationField } from "@/app/(pages)/(integration)/_components/IntegrationField"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import { FormMessage } from "@/components/ui/form"
import { useAction } from "@/server/client"
import { IntegrationTool } from "db/src/drizzle/integrations/common"
import { notFound } from "next/navigation"
import * as Form from "@radix-ui/react-form"
import { Button } from "@/components/ui/button"

export const NewIntegrationForm = ({
        integration: {
			config
		},
        onClose
}: {
		integration: IntegrationTool
        onClose?: (id: string) => void
}) => {
	if(!config) return notFound()

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			onClose?.(data.id)
		},
	})

	function onSubmit(values: any) {
		createIntegration.mutate({
			config: values,
			name: values.name!,
		})
	}

	return (
		<Form.Root onSubmit={onSubmit} className="space-y-2">
				{Object.entries(config.general).map(([key, config]) => {
					return <IntegrationField fieldDef={config} pathKey={key} key={key} />
				})}
				<LabeledSeparator label="Configuration" className="pt-4" />
				{Object.entries(config.fields).map(([key, integField]) => {
					return <IntegrationField fieldDef={integField as any} pathKey={key} key={key} />
				})}


				<Form.Submit onSubmit={onSubmit} type="submit" disabled={createIntegration.status === "loading"} className="w-full">
					<Button type="submit" disabled={createIntegration.status === "loading"} className="w-full mt-5" >
						Create Integration
					</Button>
				</Form.Submit>
		</Form.Root>
	)
}

"use client"

import { IntegrationField } from "@/app/(pages)/(integration)/_components/IntegrationField"
import { createIntegrationForm } from "@/app/(pages)/(integration)/_data/common"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import { Button } from "@/components/ui/button"
import { FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getCachedIntegrationTool } from "@/lib/orm"
import { useAction } from "@/server/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { notFound, useRouter } from "next/navigation"
import { Form, useForm } from "react-hook-form"
import { z } from "zod"

const NewIntegrationForm = async ({
	params: {
        slug,
        onClose
    }
}: {
	params: {
		slug: string
        onClose?: (id: string) => void
	}
}) => {
	const router = useRouter()

	const integrationTool = await getCachedIntegrationTool({ slug: slug })
	if (!integrationTool) {
		notFound()
	}

	const formSchema = createIntegrationForm({
		name: integrationTool.name,
		schema: JSON.parse(integrationTool.schema),
	})

	const form = useForm<typeof formSchema>({
		resolver: zodResolver(z.object(formSchema.config)),
		defaultValues: Object.keys(formSchema.config).reduce((acc, key) => {
			(acc as any)[key] = ""
			return acc
		}, {}) as any,
	})

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
			onClose?.(data.id)
		},
		onError(error) {
			form.setError("root", error)
		},
	})

	function onSubmit(values: typeof formSchema) {
		createIntegration.mutate({
			data: values,
			name: values.name!,
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{Object.entries(formSchema.general).map(([key, config]) => {
					return <IntegrationField fieldDef={config} pathKey={key} form={form as any} key={key} />
				})}
				<LabeledSeparator label="Configuration" className="mt-6 mb-4" />
				{Object.entries(formSchema.fields).map(([key, integField]) => {
					return <IntegrationField fieldDef={integField as any} pathKey={key} form={form as any} key={key} />
				})}
				<FormMessage />

				<Button type="submit" disabled={createIntegration.status === "loading"} loading={createIntegration.status === "loading"}>
					Create
				</Button>
			</form>
		</Form>
	)
}

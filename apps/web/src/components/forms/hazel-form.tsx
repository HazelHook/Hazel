"use client"

import { z } from "zod"
import AutoForm, { FieldConfig, ZodObjectOrWrapped } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import { useAction } from "@/server/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TRPCActionHandler } from "@trpc/next/app-dir/server"

export const HazelForm = <SchemaType extends ZodObjectOrWrapped>({
	action,
	onSubmit,
	formSchema,
	defaultValues,
	fieldConfig,
	extraData,
}: {
	extraData?: any
	formSchema: SchemaType
	defaultValues?: z.infer<SchemaType>
	action?: TRPCActionHandler<any>
	onSubmit?: (data: z.infer<SchemaType>) => Promise<void>
	fieldConfig?: FieldConfig<z.infer<SchemaType>>
}) => {
	const router = useRouter()

	const [values, setValues] = useState<Partial<z.infer<typeof formSchema>>>(defaultValues || {})

	useEffect(() => {
		if (defaultValues) {
			setValues(defaultValues)
		}
	}, [defaultValues])

	const updateAction = useAction(action as any, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<AutoForm
			formSchema={formSchema}
			fieldConfig={fieldConfig}
			values={values}
			onValuesChange={setValues}
			onSubmit={async (data) => {
				await onSubmit?.(data)
				action && (await updateAction.mutateAsync({ ...extraData, ...data }))
			}}
		>
			<Button
				type="submit"
				disabled={updateAction.status === "loading"}
				loading={updateAction.status === "loading"}
			>
				Update
			</Button>
		</AutoForm>
	)
}
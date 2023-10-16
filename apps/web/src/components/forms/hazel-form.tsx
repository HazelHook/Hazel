"use client"

import { z } from "zod"
import AutoForm, { FieldConfig, ZodObjectOrWrapped } from "@/components/ui/auto-form"
import { Button } from "@/components/ui/button"
import { useAction } from "@/server/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TRPCActionHandler } from "@trpc/next/app-dir/server"

import { User } from "db/src/drizzle/schema"

export const HazelForm = <SchemaType extends ZodObjectOrWrapped>({
	action,
	formSchema,
	defaultValues,
	fieldConfig,
	extraData,
}: {
	extraData?: Partial<User>
	formSchema: SchemaType
	defaultValues?: z.infer<SchemaType>
	action: TRPCActionHandler<any>
	fieldConfig?: FieldConfig<z.infer<SchemaType>>
}) => {
	const router = useRouter()

	const [values, setValues] = useState<Partial<z.infer<typeof formSchema>>>(defaultValues || {})

	useEffect(() => {
		if (defaultValues) {
			setValues(defaultValues)
		}
	}, [defaultValues])

	const updateAction = useAction(action, {
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
				console.log(data)
				await updateAction.mutateAsync({ ...extraData, ...data })
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

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { updateOrganzationAction } from "@/server/actions/organization"
import { orgUpdateFormSchema } from "@/lib/schemas/organization"

import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button } from "@hazel/ui/button"
import { z } from "zod"

export const OrganizationUpdateForm = ({
	pOrgId,
	defaultValues,
}: {
	pOrgId: string
	defaultValues?: z.infer<typeof orgUpdateFormSchema>
}) => {
	const router = useRouter()

	const [values, setValues] = useState<Partial<z.infer<typeof orgUpdateFormSchema>>>(defaultValues || {})

	useEffect(() => {
		if (defaultValues) {
			setValues(defaultValues)
		}
	}, [defaultValues])

	const updateOrg = useAction(updateOrganzationAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<AutoForm
			formSchema={orgUpdateFormSchema}
			fieldConfig={{
				name: {
					description: "Name of your Organization",
				},
			}}
			values={values}
			onValuesChange={setValues}
			onSubmit={async (data) => {
				await updateOrg.mutateAsync({ ...data, publicId: pOrgId })
			}}
		>
			<Button type="submit" disabled={updateOrg.status === "loading"} loading={updateOrg.status === "loading"}>
				Update
			</Button>
		</AutoForm>
	)
}

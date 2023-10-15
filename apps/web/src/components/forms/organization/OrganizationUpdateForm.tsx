"use client"

import { z } from "zod"
import { orgUpdateFormSchema } from "@//lib/schemas/organization"
import AutoForm from "@//components/ui/auto-form"
import { Button } from "@//components/ui/button"
import { updateOrganzationAction } from "@//server/actions/organization"
import { useAction } from "@//server/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const OrganizationUpdateForm = ({
	pOrgId,
	defaultValues,
}: { pOrgId: string; defaultValues?: z.infer<typeof orgUpdateFormSchema> }) => {
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

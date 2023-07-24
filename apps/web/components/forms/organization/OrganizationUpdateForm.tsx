"use client"

import { z } from "zod"
import { orgUpdateFormSchema } from "@/lib/schemas/organization"
import AutoForm from "@/components/ui/auto-form"
import { Button } from "@/components/ui/button"
import { updateOrganzationAction } from "@/server/actions/organization"
import { useAction } from "@/server/client"

export const OrganizationUpdateForm = ({
	pOrgId,
	defaultValues,
}: { pOrgId: string; defaultValues?: z.infer<typeof orgUpdateFormSchema> }) => {
	const updateOrg = useAction(updateOrganzationAction)

	return (
		<AutoForm
			formSchema={orgUpdateFormSchema}
			fieldConfig={{
				name: {
					description: "Name of your Organization",
				},
				slug: {
					description: "Slug to describe your Organization",
				},
			}}
			defaultValues={defaultValues}
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

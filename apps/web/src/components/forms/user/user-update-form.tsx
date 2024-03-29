"use client"

import { updateUserAction } from "@/server/actions/user"
import { userUpdateFormSchema } from "@/lib/schemas/user"

import { z } from "zod"

import { HazelForm } from "../hazel-form"

export const UserUpdateForm = ({
	userId,
	defaultValues,
}: {
	defaultValues?: z.infer<typeof userUpdateFormSchema>
	userId: string
}) => {
	return (
		<HazelForm
			formSchema={userUpdateFormSchema}
			extraData={{ id: userId }}
			action={updateUserAction}
			defaultValues={defaultValues}
		/>
	)
}

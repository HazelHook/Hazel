"use client"

import { z } from "zod"
import { HazelForm } from "../hazel-form"
import { updateUserAction } from "@/server/actions/user"
import { userUpdateFormSchema } from "@/lib/schemas/user"

export const UserUpdateForm = ({
	userId,
	defaultValues,
}: { defaultValues?: z.infer<typeof userUpdateFormSchema>; userId: string }) => {
	return (
		<HazelForm
			fieldConfig={
				{
					// profile_image: {
					// 	inputProps: {
					// 		type: "file",
					// 		accept: "image/png, image/jpeg",
					// 	},
					// },
				}
			}
			formSchema={userUpdateFormSchema}
			extraData={{ id: userId }}
			action={updateUserAction}
			defaultValues={defaultValues}
		/>
	)
}

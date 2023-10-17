"use client"

import { z } from "zod"
import { HazelForm } from "../hazel-form"
import { userUpdateEmailFormSchema } from "@/lib/schemas/user"
import useUpdateUserMutation from "@/core/hooks/use-update-user-mutation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import configuration from "@/configuration"

export const UserUpdateEmailForm = ({
	defaultValues,
	currentEmail,
}: { defaultValues?: z.infer<typeof userUpdateEmailFormSchema>; currentEmail?: string }) => {
	const t = useTranslations()

	const updateUserMutation = useUpdateUserMutation()

	return (
		<HazelForm
			onSubmit={async (data) => {
				if (data.email === currentEmail) {
					throw new Error(t("profile.updatingSameEmail"))
				}

				const redirectTo = [window.location.origin, configuration.paths.authCallback].join("")

				const promise = updateUserMutation.trigger({ email: data.email, redirectTo })

				toast.promise(promise, {
					success: t("profile.updateEmailSuccess"),
					loading: t("profile.updateEmailLoading"),
					error: (error: Error) => {
						return error.message ?? t("profile.updateEmailError")
					},
				})

				return
			}}
			formSchema={userUpdateEmailFormSchema}
			defaultValues={defaultValues}
		/>
	)
}

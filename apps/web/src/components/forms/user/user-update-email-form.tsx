"use client"

import useUpdateUserMutation from "@/core/hooks/use-update-user-mutation"
import configuration from "@hazel/utils/configuration"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { z } from "zod"

import { userUpdateEmailFormSchema } from "@/lib/schemas/user"

import { HazelForm } from "../hazel-form"

export const UserUpdateEmailForm = ({
	defaultValues,
	currentEmail,
}: {
	defaultValues?: z.infer<typeof userUpdateEmailFormSchema>
	currentEmail?: string
}) => {
	const t = useTranslations()

	const updateUserMutation = useUpdateUserMutation()

	return (
		<HazelForm
			onSubmit={async (data) => {
				if (data.email === currentEmail) {
					throw new Error(t("profile.updatingSameEmail"))
				}

				const redirectTo = [window.location.origin, configuration.paths.authCallback].join("")

				const promise = updateUserMutation.trigger({
					email: data.email,
					redirectTo,
				})

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

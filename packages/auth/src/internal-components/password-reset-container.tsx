"use client"

import { FormEvent, useCallback } from "react"

import Alert from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { Input } from "@hazel/ui/input"
import { Label } from "@hazel/ui/label"
import { useTranslations } from "next-intl"

import useResetPassword from "../hooks/use-reset-password"
import { useAuthConfig } from "../provider"
import { AuthErrorMessage } from "./auth-error-messave"

export function PasswordResetContainer() {
	const t = useTranslations()
	const authConfig = useAuthConfig()
	const resetPasswordMutation = useResetPassword()
	const error = resetPasswordMutation.error
	const success = resetPasswordMutation.data

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			const data = new FormData(event.currentTarget)
			const email = data.get("email") as string
			const redirectTo = getReturnUrl(authConfig.paths.authCallback)

			await resetPasswordMutation.trigger({
				email,
				redirectTo,
			})
		},
		[resetPasswordMutation],
	)

	return (
		<>
			<If condition={success}>
				<Alert type={"success"}>{t("auth.passwordResetSuccessMessage")}</Alert>
			</If>

			<If condition={!resetPasswordMutation.data}>
				<>
					<form onSubmit={(e) => void onSubmit(e)} className={"container mx-auto flex justify-center"}>
						<div className={"flex-col space-y-4"}>
							<div>
								<p className={"text-sm text-gray-700 dark:text-gray-400"}>
									{t("auth.passwordResetSubheading")}
								</p>
							</div>

							<div className="space-y-1">
								<Label>{t("common.emailAddress")}</Label>

								<Input name="email" required type="email" placeholder={"your@email.com"} />
							</div>

							<AuthErrorMessage error={error} />

							<Button className="w-full" loading={resetPasswordMutation.isMutating} type="submit">
								{t("auth.passwordResetLabel")}
							</Button>
						</div>
					</form>
				</>
			</If>
		</>
	)
}

/**
 * @description
 * Return the URL where the user will be redirected to after resetting
 * their password
 */
function getReturnUrl(callbackPath: string) {
	const host = window.location.origin

	return `${host}${callbackPath}`
}

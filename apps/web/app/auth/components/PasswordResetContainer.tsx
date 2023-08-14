"use client"

import { FormEvent, useCallback } from "react"

import useResetPassword from "@/core/hooks/use-reset-password"
import AuthErrorMessage from "@/app/auth/components/AuthErrorMessage"

import configuration from "@/configuration"
import If from "@/components/ui/if"
import Alert from "@/components/ui/alert"
import Trans from "@/components/ui/trans"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function PasswordResetContainer() {
	const resetPasswordMutation = useResetPassword()
	const error = resetPasswordMutation.error
	const success = resetPasswordMutation.data

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			const data = new FormData(event.currentTarget)
			const email = data.get("email") as string
			const redirectTo = getReturnUrl()

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
				<Alert type={"success"}>
					<Trans i18nKey={"auth:passwordResetSuccessMessage"} />
				</Alert>
			</If>

			<If condition={!resetPasswordMutation.data}>
				<>
					<form onSubmit={(e) => void onSubmit(e)} className={"container mx-auto flex justify-center"}>
						<div className={"flex-col space-y-4"}>
							<div>
								<p className={"text-sm text-gray-700 dark:text-gray-400"}>
									<Trans i18nKey={"auth:passwordResetSubheading"} />
								</p>
							</div>

							<div className="space-y-1">
								<Label>
									<Trans i18nKey={"common:emailAddress"} />
								</Label>

								<Input name="email" required type="email" placeholder={"your@email.com"} />
							</div>

							<AuthErrorMessage error={error} />

							<Button className="w-full" loading={resetPasswordMutation.isMutating} type="submit">
								<Trans i18nKey={"auth:passwordResetLabel"} />
							</Button>
						</div>
					</form>
				</>
			</If>
		</>
	)
}

export default PasswordResetContainer

/**
 * @description
 * Return the URL where the user will be redirected to after resetting
 * their password
 */
function getReturnUrl() {
	const host = window.location.origin
	const callback = configuration.paths.authCallback

	return `${host}${callback}`
}

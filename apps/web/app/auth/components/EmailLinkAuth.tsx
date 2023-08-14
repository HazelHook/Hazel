"use client"

import type { FormEventHandler } from "react"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import configuration from "@/configuration"
import { toast } from "sonner"
import Alert from "@/components/ui/alert"
import Trans from "@/components/ui/trans"
import { Button } from "@/components/ui/button"
import If from "@/components/ui/if"
import useSignInWithOtp from "@/core/hooks/use-sign-in-with-otp"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const EmailLinkAuth: React.FC = () => {
	const { t } = useTranslation()
	const signInWithOtpMutation = useSignInWithOtp()

	const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		async (event) => {
			event.preventDefault()

			const target = event.currentTarget
			const data = new FormData(target)
			const email = data.get("email") as string

			const origin = window.location.origin
			const redirectUrl = [origin, configuration.paths.authCallback].join("")

			const promise = signInWithOtpMutation.trigger({
				email,
				options: {
					emailRedirectTo: redirectUrl,
				},
			})

			await toast.promise(promise, {
				loading: t("auth:sendingEmailLink"),
				success: t("auth:sendLinkSuccessToast"),
				error: t("auth:errors.link"),
			})
		},
		[signInWithOtpMutation, t],
	)

	if (signInWithOtpMutation.data) {
		return (
			<Alert type={"success"}>
				<Trans i18nKey={"auth:sendLinkSuccess"} />
			</Alert>
		)
	}

	return (
		<form className={"w-full"} onSubmit={onSubmit}>
			<div className={"flex flex-col space-y-4"}>
				<div className="space-y-1">
					<Label>
						<Trans i18nKey={"common:emailAddress"} />
					</Label>
					<Input data-cy={"email-input"} required type="email" placeholder={"your@email.com"} name={"email"} />
				</div>
				<Button loading={signInWithOtpMutation.isMutating}>
					<If condition={signInWithOtpMutation.isMutating} fallback={<Trans i18nKey={"auth:sendEmailLink"} />}>
						<Trans i18nKey={"auth:sendingEmailLink"} />
					</If>
				</Button>
			</div>

			<If condition={signInWithOtpMutation.error}>
				<Alert type={"error"}>
					<Trans i18nKey={"auth:errors.link"} />
				</Alert>
			</If>
		</form>
	)
}

export default EmailLinkAuth

"use client"

import type { FormEventHandler } from "react"
import { useCallback } from "react"

import Alert from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { Input } from "@hazel/ui/input"
import { Label } from "@hazel/ui/label"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { useSignInWithOtp } from "../hooks/use-sign-in-with-otp"
import { useAuthConfig } from "../provider/auth-config"

export const EmailLinkAuth: React.FC<{
	inviteCode?: string
}> = ({ inviteCode }) => {
	const t = useTranslations()
	const authConfig = useAuthConfig()

	const signInWithOtpMutation = useSignInWithOtp()

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		async (event) => {
			event.preventDefault()

			const target = event.currentTarget
			const data = (new FormData() as any)(target as any)
			const email = data.get("email") as string

			// @ts-ignore
			const origin = (window as any).location.origin
			const queryParams = inviteCode ? `?inviteCode=${inviteCode}` : ""

			const redirectUrl = [origin, authConfig.paths.authCallback, queryParams].join("")

			const promise = signInWithOtpMutation.trigger({
				email,
				options: {
					emailRedirectTo: redirectUrl,
				},
			})

			await toast.promise(promise, {
				loading: t("auth.sendingEmailLink"),
				success: t("auth.sendLinkSuccessToast"),
				error: t("auth.errors.link"),
			})
		},
		[signInWithOtpMutation, t],
	)

	if (signInWithOtpMutation.data) {
		return <Alert type={"success"}>{t("auth.sendLinkSuccess")}</Alert>
	}

	return (
		<form className={"w-full"} onSubmit={onSubmit}>
			<div className={"flex flex-col space-y-4"}>
				<div className="space-y-1">
					<Label>{t("common.emailAddress")}</Label>
					<Input
						data-cy={"email-input"}
						required
						type="email"
						placeholder={"your@email.com"}
						name={"email"}
					/>
				</div>
				<Button loading={signInWithOtpMutation.isMutating}>
					<If condition={signInWithOtpMutation.isMutating} fallback={t("auth.sendEmailLink")}>
						{t("auth.sendingEmailLink")}
					</If>
				</Button>
			</div>

			<If condition={signInWithOtpMutation.error}>
				<Alert type={"error"}>{t("auth.errors.link")}</Alert>
			</If>
		</form>
	)
}

"use client"

import { Button } from "@/components/ui/button"
import If from "@/components/ui/if"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/i18n/client"
import type { FormEventHandler } from "react"
import { useCallback } from "react"

type ActionTypes = `link` | `signIn`

const PhoneNumberCredentialForm: React.FC<{
	onSubmit: (phoneNumber: string) => void
	action: ActionTypes
	loading?: boolean
}> = ({ onSubmit, action, loading }) => {
	const t = useI18n()
	const onLinkPhoneNumberSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault()

			const data = new FormData(event.currentTarget)
			const phoneNumber = data.get("phoneNumber") as string

			onSubmit(phoneNumber)
		},
		[onSubmit],
	)

	return (
		<form className={"w-full"} onSubmit={onLinkPhoneNumberSubmit}>
			<div className={"flex flex-col space-y-2"}>
				<div className="space-y-1">
					<Label>{t("profile.phoneNumberLabel")}</Label>

					<Input
						required
						pattern={"^\\+?[1-9]\\d{1,14}$"}
						name={"phoneNumber"}
						type={"tel"}
						placeholder={"Ex. +919367788755"}
						disabled={loading}
					/>
				</div>

				<Button loading={loading} className="w-full" type={"submit"}>
					<If condition={action === "link"}>{t("profile.verifyPhoneNumberSubmitLabel")}</If>

					<If condition={action === "signIn"}>{t("auth.signInWithPhoneNumber")}</If>
				</Button>
			</div>
		</form>
	)
}

export default PhoneNumberCredentialForm

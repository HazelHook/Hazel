import type { FormEventHandler } from "react"
import React, { useCallback, useState } from "react"

import Alert from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { useTranslations } from "next-intl"

import { useSignInWithOtp } from "../hooks/use-sign-in-with-otp"
import { useVerifyOtp } from "../hooks/use-verify-otp"
import { useAuthConfig } from "../provider/auth-config"
import PhoneNumberCredentialForm from "./phone-number-credential-form"
import { VerificationCodeInput } from "./verification-code-input"

enum Step {
	Phone = 0,
	Otp = 1,
}

export const PhoneNumberSignInContainer: React.FC<{
	onSuccess: () => unknown
	mode: "signIn" | "signUp"
}> = ({ onSuccess, mode }) => {
	const t = useTranslations()
	const authConfig = useAuthConfig()

	const [step, setStep] = useState<Step>(Step.Phone)
	const [verificationCode, setVerificationCode] = useState("")
	const [phone, setPhone] = useState("")

	const signInWithOtp = useSignInWithOtp()
	const verifyOtp = useVerifyOtp()

	const onPhoneNumberSubmit = useCallback(
		async (phone: string) => {
			await signInWithOtp.trigger({
				phone,
				options: {
					shouldCreateUser: mode === "signUp",
					channel: "sms",
				},
			})

			setStep(Step.Otp)
			setPhone(phone)
		},
		[mode, signInWithOtp],
	)

	const onOTPSubmit: FormEventHandler = useCallback(
		async (e) => {
			e.preventDefault()

			const redirectTo = `${window.location.origin}${authConfig.paths.signInRedirect}`

			await verifyOtp.trigger({
				token: verificationCode,
				phone,
				type: "sms",
				options: {
					redirectTo,
				},
			})

			if (onSuccess) {
				onSuccess()
			}
		},
		[onSuccess, verificationCode, phone, verifyOtp],
	)

	if (step === Step.Otp) {
		return (
			<form className={"w-full"} onSubmit={onOTPSubmit}>
				<div className={"flex flex-col space-y-4"}>
					<If condition={verifyOtp.error}>
						<Alert type={"error"}>
							<Alert.Heading>Sorry, we were unable to log you in.</Alert.Heading>
							We were unable to verify your phone number. Please try again later.
						</Alert>
					</If>

					<VerificationCodeInput onInvalid={() => setVerificationCode("")} onValid={setVerificationCode} />

					<Button
						disabled={!verificationCode}
						loading={verifyOtp.isMutating}
						variant={"default"}
						type={"submit"}
					>
						{t("auth.signIn")}
					</Button>
				</div>
			</form>
		)
	}

	return (
		<div className={"flex w-full flex-col space-y-4"}>
			<If condition={signInWithOtp.error}>
				<Alert type={"error"}>
					<Alert.Heading>Sorry, something went wrong.</Alert.Heading>
					We were unable to send you an OTP. Please try again later.
				</Alert>
			</If>

			<PhoneNumberCredentialForm
				action={"signIn"}
				onSubmit={onPhoneNumberSubmit}
				loading={signInWithOtp.isMutating}
			/>
		</div>
	)
}

import type { FormEventHandler } from "react"
import React, { useCallback, useState } from "react"

import configuration from "@/configuration"
import useSignInWithOtp from "@/core/hooks/use-sign-in-with-otp"
import useVerifyOtp from "@/core/hooks/use-verify-otp"
import If from "@/components/ui/if"
import Alert from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Trans from "@/components/ui/trans"
import VerificationCodeInput from "./VerificationCodeInput"
import PhoneNumberCredentialForm from "./PhoneNumberCredentialForm"

enum Step {
	Phone = 0,
	Otp = 1,
}

const PhoneNumberSignInContainer: React.FC<{
	onSuccess: () => unknown
	mode: "signIn" | "signUp"
}> = ({ onSuccess, mode }) => {
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

			const redirectTo = `${window.location.origin}${configuration.paths.home}`

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

					<Button disabled={!verificationCode} loading={verifyOtp.isMutating} variant={"default"} type={"submit"}>
						<Trans i18nKey={"auth:signIn"} />
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

			<PhoneNumberCredentialForm action={"signIn"} onSubmit={onPhoneNumberSubmit} loading={signInWithOtp.isMutating} />
		</div>
	)
}

export default PhoneNumberSignInContainer

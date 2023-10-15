"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import AuthErrorMessage from "./AuthErrorMessage"

import configuration from "@/configuration"
import If from "@/components/ui/if"
import Alert from "@/components/ui/alert"

import useSignUpWithEmailAndPasswordMutation from "@/core/hooks/use-sign-up-with-email-password"
import EmailPasswordSignUpForm from "./EmailPasswordSignUpForm"
import { useTranslations } from "next-intl"

const requireEmailConfirmation = configuration.auth.requireEmailConfirmation

const EmailPasswordSignUpContainer: React.FCC<{
	onSignUp?: () => unknown
	onSubmit?: (userId?: string) => void
	onError?: (error?: unknown) => unknown
}> = ({ onSignUp, onSubmit, onError }) => {
	const t = useTranslations()
	const signUpMutation = useSignUpWithEmailAndPasswordMutation()
	const redirecting = useRef(false)
	const loading = signUpMutation.isMutating || redirecting.current
	const [showVerifyEmailAlert, setShowVerifyEmailAlert] = useState(false)

	const callOnErrorCallback = useCallback(() => {
		if (signUpMutation.error && onError) {
			onError(signUpMutation.error)
		}
	}, [signUpMutation.error, onError])

	useEffect(() => {
		callOnErrorCallback()
	}, [callOnErrorCallback])

	const onSignupRequested = useCallback(
		async (params: { email: string; password: string }) => {
			if (loading) {
				return
			}

			try {
				const data = await signUpMutation.trigger(params)

				// If the user is required to confirm their email, we display a message
				if (requireEmailConfirmation) {
					setShowVerifyEmailAlert(true)

					if (onSubmit) {
						const userId = data?.user?.id
						onSubmit(userId)
					}
				} else {
					// Otherwise, we redirect the user to the onboarding page
					onSignUp?.()
				}
			} catch (error) {
				if (onError) {
					onError(error)
				}
			}
		},
		[loading, onError, onSignUp, onSubmit, signUpMutation],
	)

	return (
		<>
			<If condition={showVerifyEmailAlert}>
				<Alert type={"success"}>
					<Alert.Heading>{t("auth.emailConfirmationAlertHeading")}</Alert.Heading>

					<p data-cy={"email-confirmation-alert"}>{t("auth.emailConfirmationAlertBody")}</p>
				</Alert>
			</If>

			<If condition={!showVerifyEmailAlert}>
				<AuthErrorMessage error={signUpMutation.error} />

				<EmailPasswordSignUpForm onSubmit={onSignupRequested} loading={loading} />
			</If>
		</>
	)
}

export default EmailPasswordSignUpContainer

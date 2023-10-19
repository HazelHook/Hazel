"use client"

import { useCallback } from "react"

import EmailPasswordSignInForm from "./email-password-sign-in-form"
import { AuthErrorMessage } from "./auth-error-messave"
import { useSignInWithEmailPassword } from "../hooks/use-sign-in-with-email-password"

export const EmailPasswordSignInContainer: React.FCC<{
	onSignIn: (userId?: string) => unknown
}> = ({ onSignIn }) => {
	const signInMutation = useSignInWithEmailPassword()
	const isLoading = signInMutation.isMutating

	const onSubmit = useCallback(
		async (credentials: { email: string; password: string }) => {
			try {
				const data = await signInMutation.trigger(credentials)
				const userId = data?.user?.id

				onSignIn(userId)
			} catch (e) {
				// wrong credentials, do nothing
			}
		},
		[onSignIn, signInMutation],
	)

	return (
		<>
			<AuthErrorMessage error={signInMutation.error} />

			<EmailPasswordSignInForm onSubmit={onSubmit} loading={isLoading} />
		</>
	)
}

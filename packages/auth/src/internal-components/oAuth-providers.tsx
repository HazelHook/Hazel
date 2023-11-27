"use client"

import { useCallback } from "react"

import { PageLoadingIndicator } from "@hazel/ui/page-loading-indicator"
import { Provider } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"

import { useSignInWithProvider } from "../hooks"
import { AuthErrorMessage } from "./auth-error-messave"
import { AuthProviderButton } from "./auth-provider-button"

const OAuthProviders: React.FCC<{
	providers: Provider[]
	callbackUrl: string
	returnUrl?: string
}> = ({ returnUrl, callbackUrl, providers }) => {
	const t = useTranslations()
	const signInWithProviderMutation = useSignInWithProvider()

	// we make the UI "busy" until the next page is fully loaded
	const onSignInWithProvider = useCallback(async (signInRequest: () => Promise<unknown>) => {
		try {
			const credential = await signInRequest()

			if (!credential) {
				return Promise.reject()
			}
		} catch (error) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw error
		}
	}, [])

	if (!providers || !providers.length) {
		return null
	}

	return (
		<>
			{signInWithProviderMutation.isMutating && <PageLoadingIndicator />}

			<div className={"flex w-full flex-1 flex-col space-y-3"}>
				<div className={"flex-col space-y-2"}>
					{providers.map((provider) => {
						return (
							<AuthProviderButton
								key={provider}
								providerId={provider}
								onClick={() => {
									const origin = window.location.origin

									const returnUrlParams = returnUrl ? `?returnUrl=${returnUrl}` : ""

									const computedReturnUrl = [callbackUrl, returnUrlParams].join("")
									const redirectTo = [origin, computedReturnUrl].join("")

									const credentials = {
										provider,
										options: {
											redirectTo,
										},
									}

									return onSignInWithProvider(() => signInWithProviderMutation.trigger(credentials))
								}}
							>
								{t("auth.signInWithProvider", {
									provider: getProviderName(provider),
								})}
							</AuthProviderButton>
						)
					})}
				</div>

				<AuthErrorMessage error={signInWithProviderMutation.error} />
			</div>
		</>
	)
}

function getProviderName(providerId: string) {
	const capitalize = (value: string) => value.slice(0, 1).toUpperCase() + value.slice(1)

	if (providerId.endsWith(".com")) {
		return capitalize(providerId.split(".com")[0])
	}

	return capitalize(providerId)
}

export default OAuthProviders

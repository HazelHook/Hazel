"use client"

import { useCallback } from "react"

import AuthErrorMessage from "./AuthErrorMessage"

import configuration from "@/configuration"
import useSignInWithProvider from "@/core/hooks/use-sign-in-with-provider"
import AuthProviderButton from "./AuthProviderButton"
import PageLoadingIndicator from "@/components/PageLoadingIndicator"
import { useI18n } from "@/i18n/client"

const OAUTH_PROVIDERS = configuration.auth.providers.oAuth

const OAuthProviders: React.FCC<{
	returnUrl?: string
}> = (props) => {
	const t = useI18n()
	const signInWithProviderMutation = useSignInWithProvider()

	// we make the UI "busy" until the next page is fully loaded
	const loading = signInWithProviderMutation.isMutating

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

	if (!OAUTH_PROVIDERS || !OAUTH_PROVIDERS.length) {
		return null
	}

	return (
		<>
			{loading && <PageLoadingIndicator />}

			<div className={"flex w-full flex-1 flex-col space-y-3"}>
				<div className={"flex-col space-y-2"}>
					{OAUTH_PROVIDERS.map((provider) => {
						return (
							<AuthProviderButton
								key={provider}
								providerId={provider}
								onClick={() => {
									// @ts-ignore
									const origin = window.location.origin
									const callback = configuration.paths.authCallback

									const returnUrlParams = props.returnUrl ? `?returnUrl=${props.returnUrl}` : ""

									const returnUrl = [callback, returnUrlParams].join("")
									const redirectTo = [origin, returnUrl].join("")

									const credentials = {
										provider,
										options: {
											redirectTo,
										},
									}

									return onSignInWithProvider(() => signInWithProviderMutation.trigger(credentials))
								}}
							>
								{t("auth.signInWithProvider", { provider: getProviderName(provider) })}
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

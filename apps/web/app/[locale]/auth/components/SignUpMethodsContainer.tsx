"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

import configuration from "@/configuration"
import OAuthProviders from "./OAuthProviders"
import If from "@/components/ui/if"

import EmailLinkAuth from "./EmailLinkAuth"
import EmailPasswordSignUpContainer from "./EmailPasswordSignUpContainer"
import PhoneNumberSignInContainer from "./PhoneNumberSignInContainer"
import { useI18n } from "@/i18n/client"

function SignUpMethodsContainer() {
	const t = useI18n()
	const router = useRouter()

	const onSignUp = useCallback(() => {
		router.push(configuration.paths.onboarding)
	}, [router])

	return (
		<>
			<If condition={configuration.auth.providers.oAuth.length}>
				<OAuthProviders />

				<div>
					<span className={"text-xs text-gray-400"}>{t("auth.orContinueWithEmail")}</span>
				</div>
			</If>

			<If condition={configuration.auth.providers.emailPassword}>
				<EmailPasswordSignUpContainer onSignUp={onSignUp} />
			</If>

			<If condition={configuration.auth.providers.phoneNumber}>
				<PhoneNumberSignInContainer onSuccess={onSignUp} mode={"signUp"} />
			</If>

			<If condition={configuration.auth.providers.emailLink}>
				<EmailLinkAuth />
			</If>
		</>
	)
}

export default SignUpMethodsContainer

"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import configuration from "@/configuration"
import If from "@hazel/ui/if"
import { useTranslations } from "next-intl"

import EmailLinkAuth from "./EmailLinkAuth"
import EmailPasswordSignInContainer from "./EmailPasswordSignInContainer"
import OAuthProviders from "./OAuthProviders"
import PhoneNumberSignInContainer from "./PhoneNumberSignInContainer"

function SignInMethodsContainer() {
	const router = useRouter()

	const t = useTranslations()

	const onSignIn = useCallback(() => {
		router.push(configuration.paths.home)
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
				<EmailPasswordSignInContainer onSignIn={onSignIn} />
			</If>

			<If condition={configuration.auth.providers.phoneNumber}>
				<PhoneNumberSignInContainer onSuccess={onSignIn} mode={"signIn"} />
			</If>

			<If condition={configuration.auth.providers.emailLink}>
				<EmailLinkAuth />
			</If>
		</>
	)
}

export default SignInMethodsContainer

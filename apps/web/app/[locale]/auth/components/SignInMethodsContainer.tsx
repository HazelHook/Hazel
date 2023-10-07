"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { Trans } from "@/components/ui/trans"

import OAuthProviders from "./OAuthProviders"

import configuration from "@/configuration"
import If from "@/components/ui/if"
import EmailLinkAuth from "./EmailLinkAuth"
import EmailPasswordSignInContainer from "./EmailPasswordSignInContainer"
import PhoneNumberSignInContainer from "./PhoneNumberSignInContainer"
import { useScopedI18n } from "@/i18n/client"

function SignInMethodsContainer() {
	const router = useRouter()

	const t = useScopedI18n("auth")

	const onSignIn = useCallback(() => {
		router.push(configuration.paths.home)
	}, [router])

	return (
		<>
			<If condition={configuration.auth.providers.oAuth.length}>
				<OAuthProviders />

				<div>
					<span className={"text-xs text-gray-400"}>{t("orContinueWithEmail")}</span>
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

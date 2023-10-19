"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { If } from "@hazel/ui/if"
import { useTranslations } from "next-intl"

import { EmailLinkAuth } from "./email-link-auth"
import { EmailPasswordSignInContainer } from "./emai-password-signIn-container"
import OAuthProviders from "./oAuth-providers"
import { PhoneNumberSignInContainer } from "./phone-numbe-signIn-container"
import { useAuthConfig } from "../provider/auth-config"

export function SignInMethodsContainer() {
	const router = useRouter()
	const authConfig = useAuthConfig()

	const t = useTranslations()

	const onSignIn = useCallback(() => {
		router.push(authConfig.paths.signInRedirect)
	}, [router])

	return (
		<>
			<If condition={authConfig.providers.oAuth.length}>
				<OAuthProviders providers={authConfig.providers.oAuth} callbackUrl={authConfig.paths.authCallback} />

				<div>
					<span className={"text-xs text-gray-400"}>{t("auth.orContinueWithEmail")}</span>
				</div>
			</If>

			<If condition={authConfig.providers.emailPassword}>
				<EmailPasswordSignInContainer onSignIn={onSignIn} />
			</If>

			<If condition={authConfig.providers.phoneNumber}>
				<PhoneNumberSignInContainer onSuccess={onSignIn} mode={"signIn"} />
			</If>

			<If condition={authConfig.providers.magicLink}>
				<EmailLinkAuth />
			</If>
		</>
	)
}

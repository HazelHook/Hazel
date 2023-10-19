"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { If } from "@hazel/ui/if"
import { useTranslations } from "next-intl"

import { EmailLinkAuth } from "./email-link-auth"
import OAuthProviders from "./oAuth-providers"
import { PhoneNumberSignInContainer } from "./phone-numbe-signIn-container"
import { useAuthConfig } from "../provider/auth-config"
import { EmailPasswordSignUpContainer } from "./email-password-sign-up-container"

export function SignUpMethodsContainer() {
	const t = useTranslations()
	const router = useRouter()
	const authConfig = useAuthConfig()

	const onSignUp = useCallback(() => {
		router.push(authConfig.paths.onboarding)
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
				<EmailPasswordSignUpContainer onSignUp={onSignUp} />
			</If>

			<If condition={authConfig.providers.phoneNumber}>
				<PhoneNumberSignInContainer onSuccess={onSignUp} mode={"signUp"} />
			</If>

			<If condition={authConfig.providers.magicLink}>
				<EmailLinkAuth />
			</If>
		</>
	)
}

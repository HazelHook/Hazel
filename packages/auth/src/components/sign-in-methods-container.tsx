"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import If from "@hazel/ui/if"
import { useTranslations } from "next-intl"

import { EmailLinkAuth } from "./email-link-auth"
import { EmailPasswordSignInContainer } from "./emai-password-signIn-container"
import OAuthProviders from "./oAuth-providers"
import type { Paths, Providers } from "../pages"
import { PhoneNumberSignInContainer } from "./phone-numbe-signIn-container"

export type SignInMethodsContainerProps = {
	paths: Paths

	providers: Providers
}

export function SignInMethodsContainer({ paths, providers }: SignInMethodsContainerProps) {
	const router = useRouter()

	const t = useTranslations()

	const onSignIn = useCallback(() => {
		router.push(paths.redirect)
	}, [router])

	return (
		<>
			<If condition={providers.oAuth.length}>
				<OAuthProviders providers={providers.oAuth as any} callbackUrl={paths.authCallback} />

				<div>
					<span className={"text-xs text-gray-400"}>{t("auth.orContinueWithEmail")}</span>
				</div>
			</If>

			<If condition={providers.emailPassword}>
				<EmailPasswordSignInContainer onSignIn={onSignIn} />
			</If>

			<If condition={providers.phoneNumber}>
				<PhoneNumberSignInContainer paths={paths} onSuccess={onSignIn} mode={"signIn"} />
			</If>

			<If condition={providers.magicLink}>
				<EmailLinkAuth paths={paths} />
			</If>
		</>
	)
}

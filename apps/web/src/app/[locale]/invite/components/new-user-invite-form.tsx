"use client"

import { useState } from "react"
import isBrowser from "@/core/generic/is-browser"
import { EmailPasswordSignInContainer } from "@hazel/auth/internal-components/emai-password-signIn-container"
import { EmailLinkAuth } from "@hazel/auth/internal-components/email-link-auth"
import { EmailPasswordSignUpContainer } from "@hazel/auth/internal-components/email-password-sign-up-container"
import OAuthProviders from "@hazel/auth/internal-components/oAuth-providers"
import { PhoneNumberSignInContainer } from "@hazel/auth/internal-components/phone-numbe-signIn-container"
import { useAction } from "@hazel/server/actions/client"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { PageLoadingIndicator } from "@hazel/ui/page-loading-indicator"
import configuration from "@hazel/utils/configuration"
import { useTranslations } from "next-intl"

import { acceptOrganizationInvite } from "@/server/actions/organization-invite"

enum Mode {
	SignUp = 0,
	SignIn = 1,
}

function NewUserInviteForm(
	props: React.PropsWithChildren<{
		code: string
		action: typeof acceptOrganizationInvite
	}>,
) {
	const t = useTranslations()
	const [mode, setMode] = useState<Mode>(Mode.SignUp)

	const inviteAcceptAction = useAction(props.action)

	const oAuthReturnUrl = isBrowser() ? window.location.pathname : ""

	return (
		<>
			<If condition={inviteAcceptAction.status === "loading"}>
				<PageLoadingIndicator fullPage>Accepting invite. Please wait...</PageLoadingIndicator>
			</If>

			<OAuthProviders
				providers={configuration.auth.providers.oAuth}
				returnUrl={oAuthReturnUrl}
				callbackUrl={configuration.paths.authCallback}
			/>

			<If condition={configuration.auth.providers.emailPassword}>
				<If condition={mode === Mode.SignUp}>
					<div className={"flex w-full flex-col items-center space-y-4"}>
						<EmailPasswordSignUpContainer
							onSignUp={() => inviteAcceptAction.mutate({ inviteId: props.code })}
						/>

						<Button className="w-full" variant={"ghost"} size={"sm"} onClick={() => setMode(Mode.SignIn)}>
							{t("auth.alreadyHaveAccountStatement")}
						</Button>
					</div>
				</If>

				<If condition={mode === Mode.SignIn}>
					<div className={"flex w-full flex-col items-center space-y-4"}>
						<EmailPasswordSignInContainer
							onSignIn={() => inviteAcceptAction.mutate({ inviteId: props.code })}
						/>

						<Button className="w=full" variant={"ghost"} size={"sm"} onClick={() => setMode(Mode.SignUp)}>
							{t("auth.doNotHaveAccountStatement")}
						</Button>
					</div>
				</If>
			</If>

			<If condition={configuration.auth.providers.phoneNumber}>
				<PhoneNumberSignInContainer
					onSuccess={() => inviteAcceptAction.mutate({ inviteId: props.code })}
					mode={"signUp"}
				/>
			</If>

			<If condition={configuration.auth.providers.magicLink}>
				<EmailLinkAuth inviteCode={props.code} />
			</If>
		</>
	)
}

export default NewUserInviteForm

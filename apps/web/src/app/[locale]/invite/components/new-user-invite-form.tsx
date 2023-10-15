"use client"

import PageLoadingIndicator from "@//components/PageLoadingIndicator"
import If from "@//components/ui/if"
import isBrowser from "@//core/generic/is-browser"
import { acceptOrganizationInvite } from "@//server/actions/organization-invite"
import { useAction } from "@//server/client"
import { useState } from "react"
import OAuthProviders from "../../auth/components/OAuthProviders"
import configuration from "@//configuration"
import EmailPasswordSignUpContainer from "../../auth/components/EmailPasswordSignUpContainer"
import { useI18n } from "@//i18n/client"
import { Button } from "@//components/ui/button"
import EmailPasswordSignInContainer from "../../auth/components/EmailPasswordSignInContainer"
import EmailLinkAuth from "../../auth/components/EmailLinkAuth"
import PhoneNumberSignInContainer from "../../auth/components/PhoneNumberSignInContainer"

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
	const t = useI18n()
	const [mode, setMode] = useState<Mode>(Mode.SignUp)

	const inviteAcceptAction = useAction(props.action)

	const oAuthReturnUrl = isBrowser() ? window.location.pathname : ""

	return (
		<>
			<If condition={inviteAcceptAction.status === "loading"}>
				<PageLoadingIndicator fullPage>Accepting invite. Please wait...</PageLoadingIndicator>
			</If>

			<OAuthProviders returnUrl={oAuthReturnUrl} />

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

			<If condition={configuration.auth.providers.emailLink}>
				<EmailLinkAuth inviteCode={props.code} />
			</If>
		</>
	)
}

export default NewUserInviteForm

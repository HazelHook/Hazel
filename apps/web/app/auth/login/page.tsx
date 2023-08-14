import Link from "next/link"
import { Trans } from "@/components/ui/trans"

import { Heading } from "@/components/ui/heading"
import { withI18n } from "@/i18n/with-i18n"

import configuration from "@/configuration"
import SignInMethodsContainer from "@/app/auth/components/SignInMethodsContainer"

export const metadata = {
	title: "Sign In",
}

function SignInPage() {
	return (
		<>
			<div>
				<Heading type={5}>
					<Trans i18nKey={"auth:signInHeading"} />
				</Heading>
			</div>

			<SignInMethodsContainer />

			<div className={"flex justify-center text-xs"}>
				<p className={"flex space-x-1"}>
					<span>
						<Trans i18nKey={"auth:doNotHaveAccountYet"} />
					</span>

					<Link className={"text-primary hover:underline"} href={configuration.paths.signUp}>
						<Trans i18nKey={"auth:signUp"} />
					</Link>
				</p>
			</div>
		</>
	)
}

export default withI18n(SignInPage)

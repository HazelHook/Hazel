import Link from "next/link"
import { Trans } from "@/components/ui/trans"

import { Heading } from "@/components/ui/heading"

import configuration from "@/configuration"
import SignInMethodsContainer from "@/app/[locale]/auth/components/SignInMethodsContainer"
import { getScopedI18n } from "@/i18n/server"

export const metadata = {
	title: "Sign In",
}

async function SignInPage() {
	const t = await getScopedI18n("auth")
	return (
		<>
			<div>
				<Heading type={5}>{t("signInHeading")}</Heading>
			</div>

			<SignInMethodsContainer />

			<div className={"flex justify-center text-xs"}>
				<p className={"flex space-x-1"}>
					<span>{t("doNotHaveAccountYet")}</span>

					<Link className={"text-primary hover:underline"} href={configuration.paths.signUp}>
						{t("signUp")}
					</Link>
				</p>
			</div>
		</>
	)
}

export default SignInPage

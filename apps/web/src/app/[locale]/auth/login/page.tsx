import Link from "next/link"

import { Heading } from "@hazel/ui/heading"

import configuration from "@/configuration"
import SignInMethodsContainer from "@/app/[locale]/auth/components/SignInMethodsContainer"
import { useTranslations } from "next-intl"

export const metadata = {
	title: "Sign In",
}

function SignInPage() {
	const t = useTranslations("auth")

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

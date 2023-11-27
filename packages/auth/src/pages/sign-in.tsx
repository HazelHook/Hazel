import Link from "next/link"

import { Heading } from "@hazel/ui/heading"
import { useTranslations } from "next-intl"

import { SignInMethodsContainer } from "../internal-components/sign-in-methods-container"

export function SignInPage({ signUpPath }: { signUpPath: string }) {
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

					<Link className={"text-primary hover:underline"} href={signUpPath}>
						{t("signUp")}
					</Link>
				</p>
			</div>
		</>
	)
}

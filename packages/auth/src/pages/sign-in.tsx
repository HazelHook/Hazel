import Link from "next/link"
import { Heading } from "@hazel/ui/heading"
import { useTranslations } from "next-intl"

import { SignInMethodsContainer } from "../components/sign-in-methods-container"

export type Providers = {
	oAuth: string[]
	emailPassword: boolean
	phoneNumber: boolean
	magicLink: boolean
}

export type Paths = {
	signUp: string
	redirect: string
	authCallback: string
}

export type SignInPageProps = {
	paths: Paths
	providers: Providers
}

export function SignInPage({ paths, providers }: SignInPageProps) {
	const t = useTranslations("auth")

	return (
		<>
			<div>
				<Heading type={5}>{t("signInHeading")}</Heading>
			</div>

			<SignInMethodsContainer providers={providers} paths={paths} />

			<div className={"flex justify-center text-xs"}>
				<p className={"flex space-x-1"}>
					<span>{t("doNotHaveAccountYet")}</span>

					<Link className={"text-primary hover:underline"} href={paths.signUp}>
						{t("signUp")}
					</Link>
				</p>
			</div>
		</>
	)
}

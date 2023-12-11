import Link from "next/link"

import { Heading } from "@hazel/ui/heading"
import { useTranslations } from "next-intl"

import { SignUpMethodsContainer } from "../internal-components/sign-up-methods-container"

export function SignUpPage({ signInPath }: { signInPath: string }) {
	const t = useTranslations()

	return (
		<>
			<div>
				<Heading type={5}>{t("auth.signUpHeading")}</Heading>
			</div>

			<SignUpMethodsContainer />

			<div className={"flex justify-center text-xs"}>
				<p className={"flex space-x-1"}>
					<span>{t("auth.alreadyHaveAnAccount")}</span>

					<Link className={"text-primary-800 hover:underline dark:text-primary-500"} href={signInPath}>
						{t("auth.signIn")}
					</Link>
				</p>
			</div>
		</>
	)
}

import Link from "next/link"
import configuration from "@/configuration"
import Heading from "@hazel/ui/heading"
import { useTranslations } from "next-intl"

import SignUpMethodsContainer from "../components/SignUpMethodsContainer"

const SIGN_IN_PATH = configuration.paths.signIn

export const metadata = {
	title: "Sign up",
}

function SignUpPage() {
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

					<Link className={"text-primary-800 hover:underline dark:text-primary-500"} href={SIGN_IN_PATH}>
						{t("auth.signIn")}
					</Link>
				</p>
			</div>
		</>
	)
}

export default SignUpPage

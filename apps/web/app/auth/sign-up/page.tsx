import Link from "next/link"

import configuration from "@/configuration"
import { withI18n } from "@/i18n/with-i18n"
import Heading from "@/components/ui/heading"
import Trans from "@/components/ui/trans"
import SignUpMethodsContainer from "../components/SignUpMethodsContainer"

const SIGN_IN_PATH = configuration.paths.signIn

export const metadata = {
	title: "Sign up",
}

function SignUpPage() {
	return (
		<>
			<div>
				<Heading type={5}>
					<Trans i18nKey={"auth:signUpHeading"} />
				</Heading>
			</div>

			<SignUpMethodsContainer />

			<div className={"flex justify-center text-xs"}>
				<p className={"flex space-x-1"}>
					<span>
						<Trans i18nKey={"auth:alreadyHaveAnAccount"} />
					</span>

					<Link className={"text-primary-800 hover:underline dark:text-primary-500"} href={SIGN_IN_PATH}>
						<Trans i18nKey={"auth:signIn"} />
					</Link>
				</p>
			</div>
		</>
	)
}

export default withI18n(SignUpPage)

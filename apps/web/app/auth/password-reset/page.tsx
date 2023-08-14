import Link from "next/link"

import configuration from "@/configuration"

import { withI18n } from "@/i18n/with-i18n"
import Heading from "@/components/ui/heading"
import Trans from "@/components/ui/trans"
import PasswordResetContainer from "../components/PasswordResetContainer"

export const metadata = {
	title: "Password Reset",
}

function PasswordResetPage() {
	return (
		<>
			<div>
				<Heading type={5}>
					<Trans i18nKey={"auth:passwordResetLabel"} />
				</Heading>
			</div>

			<div className={"flex flex-col space-y-4"}>
				<PasswordResetContainer />

				<div className={"flex justify-center text-xs"}>
					<p className={"flex space-x-1"}>
						<span>
							<Trans i18nKey={"auth:passwordRecoveredQuestion"} />
						</span>

						<Link
							className={"text-primary-800 hover:underline dark:text-primary-500"}
							href={configuration.paths.signIn}
						>
							<Trans i18nKey={"auth:signIn"} />
						</Link>
					</p>
				</div>
			</div>
		</>
	)
}

export default withI18n(PasswordResetPage)

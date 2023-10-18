import Link from "next/link"
import configuration from "@/configuration"
import Heading from "@hazel/ui/heading"
import { useTranslations } from "next-intl"

import PasswordResetContainer from "../components/PasswordResetContainer"

export const metadata = {
	title: "Password Reset",
}

function PasswordResetPage() {
	const t = useTranslations()
	return (
		<>
			<div>
				<Heading type={5}>{t("auth.passwordResetLabel")}</Heading>
			</div>

			<div className={"flex flex-col space-y-4"}>
				<PasswordResetContainer />

				<div className={"flex justify-center text-xs"}>
					<p className={"flex space-x-1"}>
						<span>{t("auth.passwordRecoveredQuestion")}</span>

						<Link
							className={"text-primary-800 hover:underline dark:text-primary-500"}
							href={configuration.paths.signIn}
						>
							{t("auth.signIn")}
						</Link>
					</p>
				</div>
			</div>
		</>
	)
}

export default PasswordResetPage

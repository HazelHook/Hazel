import Link from "next/link"
import Heading from "@hazel/ui/heading"
import { useTranslations } from "next-intl"
import { PasswordResetContainer } from "../internal-components/password-reset-container"

export const metadata = {
	title: "Password Reset",
}

export function PasswordResetPage({ signInPath }: { signInPath: string }) {
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

						<Link className={"text-primary hover:underline"} href={signInPath}>
							{t("auth.signIn")}
						</Link>
					</p>
				</div>
			</div>
		</>
	)
}

export default PasswordResetPage

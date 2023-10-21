import configuration from "@hazel/utils/configuration"

import { PasswordResetPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Password Reset",
}

function NextPasswordResetPage() {
	return <PasswordResetPage signInPath={configuration.paths.signIn} />
}

export default NextPasswordResetPage

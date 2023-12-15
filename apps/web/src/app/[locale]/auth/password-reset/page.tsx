import { PasswordResetPage } from "@hazel/auth/pages"
import configuration from "@hazel/utils/configuration"

export const metadata = {
	title: "Password Reset",
}

function NextPasswordResetPage() {
	return <PasswordResetPage signInPath={configuration.paths.signIn} />
}

// export const runtime = "edge"

export default NextPasswordResetPage

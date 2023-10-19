import configuration from "@/configuration"
import { VerifyPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Verify Authentication",
}

async function NextVerifyPage() {
	return <VerifyPage signInPath={configuration.paths.signIn} signInRedirectPath={configuration.paths.home} />
}

export default NextVerifyPage

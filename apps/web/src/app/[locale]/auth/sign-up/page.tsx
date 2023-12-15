import { SignUpPage } from "@hazel/auth/pages"
import configuration from "@hazel/utils/configuration"

export const metadata = {
	title: "Sign up",
}

function NextSignUpPage() {
	return <SignUpPage signInPath={configuration.paths.signIn} />
}

export const runtime = "edge"

export default NextSignUpPage

import configuration from "@/configuration"
import { SignUpPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Sign up",
}

function NextSignUpPage() {
	return <SignUpPage signInPath={configuration.paths.signIn} />
}

export default NextSignUpPage

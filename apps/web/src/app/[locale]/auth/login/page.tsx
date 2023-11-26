import { SignInPage } from "@hazel/auth/pages"
import configuration from "@hazel/utils/configuration"

export const metadata = {
	title: "Sign In",
}

function LoginPage() {
	return <SignInPage signUpPath={configuration.paths.signUp} />
}

// export const runtime = "edge"

export default LoginPage

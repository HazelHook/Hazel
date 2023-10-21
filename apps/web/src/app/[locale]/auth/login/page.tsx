import configuration from "@hazel/utils/configuration"

import { SignInPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Sign In",
}

function LoginPage() {
	return <SignInPage signUpPath={configuration.paths.signUp} />
}

export default LoginPage

import configuration from "@/configuration"

import { SignInPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Sign In",
}

function LoginPage() {
	return (
		<SignInPage
			providers={configuration.auth.providers}
			paths={{
				redirect: configuration.paths.home,
				authCallback: configuration.paths.authCallback,
				signUp: configuration.paths.signUp,
			}}
		/>
	)
}

export default LoginPage

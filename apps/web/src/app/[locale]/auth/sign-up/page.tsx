import configuration from "@hazel/utils/configuration"

import { SignUpPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Sign up",
}

function NextSignUpPage() {
	return <SignUpPage signInPath={configuration.paths.signIn} />
}

// export const runtime = "edge"

export default NextSignUpPage

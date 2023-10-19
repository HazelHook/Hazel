import configuration from "@/configuration"

import { VerifyPage } from "@hazel/auth/pages"

export const metadata = {
	title: "Verify Authentication",
}

async function NextVerifyPage() {
	return (
		<VerifyPage
			paths={{
				signIn: configuration.paths.signIn,
				redirect: configuration.paths.home,
			}}
		/>
	)
}

export default NextVerifyPage

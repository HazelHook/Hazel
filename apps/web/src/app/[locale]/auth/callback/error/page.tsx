import configuration from "@hazel/utils/configuration"

import { AuthCallbackErrorPage } from "@hazel/auth/pages"

interface Params {
	searchParams: StringObject
}

function CallbackErrorPage({ searchParams }: Params) {
	return <AuthCallbackErrorPage searchParams={searchParams} signInPath={configuration.paths.signIn} />
}

export default CallbackErrorPage

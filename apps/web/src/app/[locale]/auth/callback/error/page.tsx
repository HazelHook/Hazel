import { AuthCallbackErrorPage } from "@hazel/auth/pages"
import configuration from "@hazel/utils/configuration"

interface Params {
	searchParams: StringObject
}

function CallbackErrorPage({ searchParams }: Params) {
	return <AuthCallbackErrorPage searchParams={searchParams} signInPath={configuration.paths.signIn} />
}

// export const runtime = "edge"

export default CallbackErrorPage

import { AuthCallbackErrorPage } from "@hazel/auth/pages"
import configuration from "@/configuration"

interface Params {
	searchParams: StringObject
}

function CallbackErrorPage({ searchParams }: Params) {
	return <AuthCallbackErrorPage searchParams={searchParams} signInPath={configuration.paths.signIn} />
}

export default CallbackErrorPage

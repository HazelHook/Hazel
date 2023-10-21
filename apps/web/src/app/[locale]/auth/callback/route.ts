import configuration from "@hazel/utils/configuration"

import { authCallbackGetRoute } from "@hazel/auth"

export const GET = authCallbackGetRoute({
	redirectPath: configuration.paths.home,
})

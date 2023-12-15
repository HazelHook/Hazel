import { authCallbackGetRoute } from "@hazel/auth"
import configuration from "@hazel/utils/configuration"

export const GET = authCallbackGetRoute({
	redirectPath: configuration.paths.home,
})

export const runtime = "edge"

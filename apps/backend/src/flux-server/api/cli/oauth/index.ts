import { ElysiaCLIHandler } from ".."
import { getOAuthToken } from "./oauth-token"
import { getOAuthURL } from "./oauth-url"

export function addCLIOAuthEndpoints(elysia: ElysiaCLIHandler) {
	return getOAuthToken(getOAuthURL(elysia))
}

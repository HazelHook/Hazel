import { t } from "elysia"
import { ElysiaCLIHandler } from ".."
import { getUser } from "./user"

export const CLIAuthenticatedDTO = t.Object({
	access_token: t.String(),
})

export function addCLIAuthenticatedEndpoints(elysia: ElysiaCLIHandler) {
	return getUser(elysia)
}

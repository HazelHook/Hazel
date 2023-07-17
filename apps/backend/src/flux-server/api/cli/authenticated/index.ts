import { t } from "elysia";
import { ElysiaCLIHandler } from "..";
import { getDestinations } from "./destinations";

export const CLIAuthenticatedDTO = t.Object({
    access_token: t.String(),
})

export function addCLIAuthenticatedEndpoints(elysia: ElysiaCLIHandler) {
    return getDestinations(elysia)
}
import { ElysiaCLIHandler } from "..";

const OAUTH_URL = process.env["CLERK_OAUTH2_AUTH_URL"] as string

export function getOAuthURL(elyisa: ElysiaCLIHandler) {
    return elyisa.get("/oauth-url/:port", async ({ set, oauthClient }) => {
        set.status = 200
        console.log("XD")
        console.log(oauthClient)
        return {
            auth_url: OAUTH_URL,
            client_id: oauthClient.client_id,
        }
    }) as any as ElysiaCLIHandler
}
import keytar from "keytar"

import { RequestClient } from "./request-client.js"
import { openInBrowser } from "./util.js"

export interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}

export async function storeToken(tokenData: {
	access_token: string
	refresh_token: string
	expires_in: number
}): Promise<Token> {
	const expires_at = new Date().getTime() + tokenData.expires_in * 1000
	const token: Token = {
		access_token: tokenData.access_token,
		refresh_token: tokenData.refresh_token,
		expires_at,
	}

	await keytar.setPassword("hazel", "token", JSON.stringify(token))

	return token
}

async function verifyToken(client: RequestClient, token: string): Promise<void> {
	try {
		await client.post(`v1/cli/verify/${process.env["PORT"]}`, {
			token,
		})
	} catch (e) {
		console.log(e)
		throw new Error("Token is invalid.")
	}
}

export async function getToken(client: RequestClient): Promise<Token | null> {
	try {
		const tokenString = await keytar.getPassword("hazel", "token")
		if (!tokenString) {
			return null
		}

		const token: Token = JSON.parse(tokenString)

		// If the token expired get a new one
		if (token?.expires_at < new Date().getTime()) {
			const newToken = await client.post(`v1/cli/token/${process.env["PORT"]}`, {
				token: token.refresh_token,
				token_type: "refresh_token",
			})
			return await storeToken({
				access_token: newToken.access_token,
				refresh_token: newToken.refresh_token,
				expires_in: newToken.expires_in,
			})
		}

		await verifyToken(client, token.access_token)

		return token
	} catch (e) {
		console.log(e)
		await keytar.deletePassword("hazel", "token")
		return null
	}
}

export async function openLogin(client: RequestClient) {
	try {
		const data = await client.get(`/v1/cli/oauth-url/${process.env["PORT"]}`)
		const redirect_uri = `http://localhost:${process.env["PORT"]}/oauth2/callback`
		const url = `${data.auth_url}?response_type=code&client_id=${data.client_id}&redirect_uri=${redirect_uri}&scope=profile%20email`

		// Open in browser
		openInBrowser(url)
	} catch (e) {
		console.error(e)
	}
}

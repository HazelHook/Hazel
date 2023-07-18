import { AxiosInstance } from "axios"
import keytar from "keytar"
const {setPassword, getPassword} = keytar

export interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}

export async function storeToken(token: {
	access_token: string
	refresh_token: string
	expires_in: number
}) {
	const expires_at = new Date().getTime() + token.expires_in * 1000

	await setPassword(
		"hazel",
		"token",
		JSON.stringify({
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			expires_at,
		}),
	)
}

export async function tryGetToken(client: AxiosInstance): Promise<Token | null> {
	const token: Token = JSON.parse(await getPassword("hazel", "token"))
	
	if (token?.expires_at < new Date().getTime()) {
		try {
			const newToken = await client.post(`v1/cli/token/${process.env["PORT"]}`, {
				token: token.refresh_token,
				token_type: "refresh_token",
			})
			await storeToken({
				access_token: newToken.data.access_token,
				refresh_token: newToken.data.refresh_token,
				expires_in: newToken.data.expires_in,
			})

			return {
				access_token: newToken.data.access_token,
				refresh_token: newToken.data.refresh_token,
				expires_at: new Date().getTime() + newToken.data.expires_in * 1000,
			}
		} catch (e) {
			console.log(e)
			return null
		}
	}

	if (!token) {
		return null
	}

	return token
}

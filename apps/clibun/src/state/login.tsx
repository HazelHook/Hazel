import React from "react"
import { Box, Text, useInput } from "ink"
import {AxiosInstance} from "axios"
import { exec } from "child_process"

export function Login({ client }: { client: AxiosInstance }) {
    const [state, setState] = React.useState(0)

	useInput(async (_, key) => {
		if (key.return) {
			if (state === 1) {
				process.exit(0)
			} else {
				try {
					const data = await client.get(`/v1/cli/oauth-url/${process.env["PORT"]}`)

					if(data.status !== 200) {
						throw new Error(`Failed to get oauth url: ${data?.data?.message ?? data.status}`)
					}
					
					const redirect_uri = `http://localhost:${process.env["PORT"]}/oauth2/callback`
					const url = `${data.data.auth_url}?response_type=code&client_id=${data.data.client_id}&redirect_uri=${redirect_uri}&scope=profile%20email`
					
					// Open in browser
					exec(`open "${url}"`)
				} catch (e) {
					console.error(e)
				}
			}
		}

		const newState = state + (key.upArrow ? -1 : key.downArrow ? 1 : 0)
		setState(newState < 0 ? 1 : newState > 1 ? 0 : newState)
	})

	return (
		<Box flexDirection="column">
			<Text>You need to login to access the Hazel CLI. Would you like to continue?</Text>
			<Text color={state === 0 ? "greenBright" : "white"}> Login</Text>
			<Text color={state === 1 ? "greenBright" : "white"}> Cancel</Text>
		</Box>
	)
}
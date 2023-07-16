import React, { useEffect } from "react"
import { AxiosInstance } from "axios"
import { Text, useInput } from "ink"
import { Login } from "./login.js"

export interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}

export default function App({ client, token, openWebsocket }: { client: AxiosInstance; token: Token | null; openWebsocket: (id: string) => void }) {
	const [destinations, setDestinations] = React.useState(null)
	const [state, setState] = React.useState(0)

	useInput(async (_, key) => {
		const max = destinations?.length

		if (key.return && destinations) {
			openWebsocket(destinations[state].id)
		}else if (key.upArrow) {
			setState(state === 0 ? max - 1 : state - 1)
		} else if (key.downArrow) {
			setState(state === max - 1 ? 0 : state + 1)
		}


		const newState = state + (key.upArrow ? -1 : key.downArrow ? 1 : 0)
		setState(newState < 0 ? 1 : newState > 1 ? 0 : newState)
	})

	useEffect(() => {
		if(!token) {
			return
		}

		client
			.post(`/v1/webhook-destinations/${process.env["PORT"]}`, {
				token: token.access_token,
			})
			.then((destinations) => {
				if (destinations.status !== 200) {
					throw new Error(`Failed to get destinations: ${destinations?.data?.message ?? destinations.status}`)
				}
				setDestinations(destinations.data)
			})
	}, [token])

	if (!token) {
		return <Login client={client} />
	}

	if (!destinations) {
		return (
			<>
				<Text>Loading...</Text>
			</>
		)
	}

	if (destinations.length === 0) {
		return (
			<>
				<Text>No destinations found. Please create one in the Hazel web app.</Text>
			</>
		)
	}

	return (
		<>
			{destinations.map((destination) => {
				return <Text key={destination.id}>{destination.name}</Text>
			})}
		</>
	)
}

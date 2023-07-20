import React, { useEffect } from "react"
import { AxiosInstance } from "axios"
import { Box, Text } from "ink"
import { selectableLayout } from "../components/selectable-layout.js"
import MenuObserveWebhook from "./options/observe-webhook.js"
import MenuRedirectWebhook from "./options/redirect-webhook.js"

export interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}

export default function Menu({
	client,
	token,
	openWebsocket,
}: { client: AxiosInstance; token: Token | null; openWebsocket: (id: string, url?: string) => void }) {
	const [selectedOption, setSelectedOption] = React.useState(0)
	const [selectedMenu, setSelectedMenu] = React.useState(0)
	const [destinations, setDestinations] = React.useState(null)

	selectableLayout({
		layout: {
			direction: 'v',
			elements: 2,
		},
		selected: selectedOption,
		setSelected: setSelectedOption,
		focused: selectedMenu === 0
	})
	selectableLayout({
		layout: {
			direction: 'h',
			elements: 2,
		},
		selected: selectedMenu,
		setSelected: setSelectedMenu,
		focused: true
	})

	useEffect(() => {
		if (!token) {
			return
		}

		client
			.post(`/v1/cli/user/${process.env["PORT"]}`, {
				access_token: token.access_token,
			})
			.then((destinations) => {
				if (destinations.status !== 200) {
					throw new Error(`Failed to get destinations: ${destinations?.data?.message ?? destinations.status}`)
				}
				setDestinations(destinations.data.destinations)
			})
	}, [token])

	return <Box flexDirection="row">
		<Box borderStyle="round" paddingX={2} minWidth={14} flexDirection="column" borderColor={selectedMenu === 0 ? 'white' : 'gray'}>
			<Text dimColor={selectedOption !== 0}>
				Observe
			</Text>
			<Text dimColor={selectedOption !== 1}>
				Forward
			</Text>
		</Box>
		{
			selectedOption === 0 ? (
				<MenuObserveWebhook destinations={destinations ?? []} openWebsocket={openWebsocket} focused={selectedMenu === 1}/>
			) : (
				<MenuRedirectWebhook destinations={destinations ?? []} openWebsocket={openWebsocket}  focused={selectedMenu === 1}/>
			)
		}
	</Box>
}

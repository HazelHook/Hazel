import React from "react"
import { Box, Text } from "ink"
import { selectableLayout } from "../../components/selectable-layout.js"

export interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}

export default function MenuObserveWebhook({
	openWebsocket,
    destinations,
	focused
}: { openWebsocket: (id: string) => void ; destinations: any[]; focused: boolean}) {
	const [selectedDestination, setSelectedDestination] = React.useState(0)

	selectableLayout({
		layout: {
			direction: 'v',
			elements: destinations.length,
			confirmEvent: (d) => {
				openWebsocket(destinations[d].publicId)
			}
		},
		selected: selectedDestination,
		setSelected: setSelectedDestination,
		focused
	})

	return (
		<>
			<Box borderStyle="round" flexDirection="column" borderColor={focused ? 'white' : 'gray'}>
				<Text dimColor={!focused}>
					Observe displays all requests for a specified destination in this CLI. 
					It is useful for debugging failing requests.
				</Text>
				<Box height={1}/>
				<Text bold>Please select a destination you would like to observe.</Text>

				{destinations.map((destination, i) => {
					return <Text key={destination.id} dimColor={selectedDestination !== i}>{destination.name}</Text>
				})}
			</Box>
		</>
	)
}

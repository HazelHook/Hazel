import React from "react"
import { Box, Text } from "ink"
import TextInput from "ink-text-input"
import { selectableLayout } from "../../components/selectable-layout.js"

export interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}

export default function MenuRedirectWebhook({
	openWebsocket,
	destinations,
	focused,
}: { openWebsocket: (id: string, url?: string) => void; destinations: any[]; focused: boolean }) {
	const [hoveredElement, setHoveredElement] = React.useState(0)
	const [selectedDestination, setSelectedDestination] = React.useState(-1)
	const [url, setUrl] = React.useState("")

	selectableLayout({
		layout: {
			direction: "v",
			elements: destinations.length + 1,
			confirmEvent: (i) => {
				if (i < destinations.length) {
					setSelectedDestination(i)
					setHoveredElement(destinations.length)
				} else {
					openWebsocket(destinations[selectedDestination], url)
				}
			},
		},
		selected: hoveredElement,
		setSelected: setHoveredElement,
		focused,
	})

	if(destinations.length === 0){
		return <Box borderStyle="round" flexDirection="column" borderColor={focused ? "white" : "gray"} paddingX={1}>
			<Text dimColor>Loading...</Text>
		</Box>
	}

	return (
		<>
			<Box borderStyle="round" flexDirection="column" borderColor={focused ? "white" : "gray"} paddingX={1}>
				<Text dimColor>Forward all requests to specified URL.</Text>
				<Text dimColor>Useful when debugging a webhook.</Text>
				<Box height={1} />
				<SelectDestination
					destinations={destinations}
					focused={focused}
					hoveredElement={hoveredElement}
					selectedElement={selectedDestination}
				/>

				<Box height={1} />
				<Text dimColor={!focused || hoveredElement < destinations.length}>2. Enter the target URL:</Text>
				<Box>
					<TextInput
						value={url}
						onChange={setUrl}
						showCursor={focused && hoveredElement === destinations.length}
						placeholder="e.g. localhost:3000"
					/>
				</Box>
			</Box>
		</>
	)
}

function SelectDestination({
	destinations,
	hoveredElement,
	focused,
	selectedElement,
}: { destinations: any[]; hoveredElement: number; focused: boolean; selectedElement?: number }) {
	if (selectedElement !== undefined) {
		if (hoveredElement >= destinations.length) {
			return (
				<Box>
					<Text dimColor>Selected destination: {destinations[selectedElement]?.name}</Text>
				</Box>
			)
		}
	}

	return (
		<Box flexDirection="column">
			<Text dimColor={!focused}>1. Select the destination to forward:</Text>

			{destinations.map((destination, i) => {
				return (
					<Text
						key={destination.id}
						color={selectedElement === i ? "green" : "white"}
						dimColor={hoveredElement !== i || !focused}
					>
						{`   ${destination.name}`}
					</Text>
				)
			})}
		</Box>
	)
}

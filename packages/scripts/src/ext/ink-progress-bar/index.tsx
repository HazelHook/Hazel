import React from "react"
import { Text, Box } from "../ink"

export function ProgressBar({
	percent,
	columns,
	left = 0,
	right = 0,
	character = "█",
	rightPad = false,
}: {
	percent: number
	columns?: number
	left?: number
	right?: number
	character?: string
	rightPad?: boolean
}) {
	const screen = columns || process.stdout.columns || 80
	const space = screen - right - left
	const max = Math.min(Math.floor(space * percent), space)
	const chars = character.repeat(max)

	let name = ""
	if (!rightPad) {
		name = chars
	} else {
		name = chars + " ".repeat(space - max)
	}

	return (
		<Box borderColor="#CC671B" borderStyle="round" width={"100%"}>
			<Text color="green">{name}</Text>
		</Box>
	)
}

import React, { useState } from "react"
import { Box, Text, useInput } from "../ext/ink"
import figures from "figures"

export function Checkbox({
	selected,
	highlighted,
	label,
    selectedColor,
    color,
	onToggle,
}: {
	selected?: boolean
	highlighted?: boolean
	label: string
    selectedColor: string
    color: string
	onToggle?: (selected: boolean) => void
}) {
	useInput((input, key) => {
		if (highlighted && (key.return || input === " ")) {
			onToggle?.(!selected)
		}
	})

	return (
		<Text
			color={selected ? selectedColor : color}
			dimColor={!highlighted}
		>
			{selected ? figures.checkboxOn : figures.checkboxOff} {label}
		</Text>
	)
}

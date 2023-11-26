import { useState } from "react"
import figures from "figures"

import { Box, Text, useInput } from "../ext/ink"

export type LabelListItemProps = {
	label: string
	highlighted: boolean
}
export type CheckboxListItemProps = LabelListItemProps & {
	checked: boolean
}
type LabelListConfig = {
	color: string
	selectedColor: string
}
type CheckboxListConfig = LabelListConfig

type BaseListProps = {
	items: string[]
	engaged: boolean
	selectedIndex: number
	title?: string
	setSelectedIndex: (index: number) => void
}
type LabelListProps = BaseListProps & {
	type: "label"
	config: LabelListConfig
}
type CheckboxListProps = BaseListProps & {
	type: "checkbox"
	config: CheckboxListConfig
	setSelectedCheckboxes: (index: number[]) => void
}

export function CustomList(props: LabelListProps | CheckboxListProps) {
	const [selectedCheckbox, setSelectedCheckbox] = useState<number[]>([])

	useInput((input, key) => {
		if (props.engaged) {
			if (key.upArrow) {
				props.setSelectedIndex(props.selectedIndex - 1)
			}

			if (key.downArrow) {
				props.setSelectedIndex(props.selectedIndex + 1)
			}

			if (input === " " && props.type === "checkbox") {
				if (selectedCheckbox.includes(props.selectedIndex)) {
					const newSelectedCheckbox = selectedCheckbox.filter((i) => i !== props.selectedIndex)
					props.setSelectedCheckboxes(newSelectedCheckbox)
					setSelectedCheckbox(newSelectedCheckbox)
				} else {
					const newSelectedCheckbox = [...selectedCheckbox, props.selectedIndex]
					props.setSelectedCheckboxes(newSelectedCheckbox)
					setSelectedCheckbox(newSelectedCheckbox)
				}
			}
		}
	})

	if (props.type === "label") {
		return (
			<Box flexDirection="column">
				{props.items.map((item, i) => (
					<Text color={props.config.color} dimColor={props.selectedIndex !== i || !props.engaged} key={i}>
						{item}
					</Text>
				))}
			</Box>
		)
	}

	if (props.type === "checkbox") {
		return (
			<Box flexDirection="column">
				<Text>{props.title}</Text>
				{props.items.map((item, i) => (
					<Text
						color={selectedCheckbox.includes(i) ? props.config.selectedColor : props.config.color}
						dimColor={props.selectedIndex !== i || !props.engaged}
						key={i}
					>
						{selectedCheckbox.includes(i) ? figures.checkboxOn : figures.checkboxOff} {item}
					</Text>
				))}
			</Box>
		)
	}
}

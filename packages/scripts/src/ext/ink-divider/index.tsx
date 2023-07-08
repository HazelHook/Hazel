import { Box, Text } from "../ink"

// Helpers
const getSideDividerWidth = (width: number, titleWidth: number) => (width - titleWidth) / 2
const getNumberOfCharsPerWidth = (char: string, width: number) => width / char.length

const PAD = " "

// Divider

interface DividerProps {
	title: string
	width: number
	padding: number
	titlePadding: number
	titleColor: string
	dividerChar: string
	dividerColor: string
}

export const Divider = ({
	title,
	width = 50,
	padding = 1,
	titlePadding = 1,
	titleColor = "white",
	dividerChar = "-",
	dividerColor = "grey",
}: DividerProps) => {
	const titleString = title ? `${PAD.repeat(titlePadding) + title + PAD.repeat(titlePadding)}` : ""

	const dividerWidth = getSideDividerWidth(width, titleString.length)
	const numberOfCharsPerSide = getNumberOfCharsPerWidth(dividerChar, dividerWidth)
	const dividerSideString = dividerChar.repeat(numberOfCharsPerSide)

	const paddingString = PAD.repeat(padding)

	return (
		<Box flexDirection="row">
			<Text>
				{paddingString}
				<Text color={dividerColor}>{dividerSideString}</Text>
				<Text color={titleColor}>{titleString}</Text>
				<Text color={dividerColor}>{dividerSideString}</Text>
				{paddingString}
			</Text>
		</Box>
	)
}

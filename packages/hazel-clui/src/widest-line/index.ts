import stringWidth from "../string-width"

export default function widestLine(text: string) {
	let lineWidth = 0

	for (const line of text.split("\n")) {
		lineWidth = Math.max(lineWidth, stringWidth(line))
	}

	return lineWidth
}

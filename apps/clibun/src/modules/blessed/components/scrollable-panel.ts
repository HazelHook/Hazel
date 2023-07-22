import blessed from "blessed"

export function ScrollablePanel({
	width = "100%",
	height = "100%",
	top = 0,
	left = 0,
}: {
	top: number | string
	left: number | string
	width: number | string
	height: number | string
}) {
	return blessed.box({
		top,
		left,
		tags: true,
		keys: true,
		vi: true,
		mouse: true,
		scrollable: true,
		width,
		height,
		padding: {
			left: 1,
			right: 1,
		},
		scrollbar: {
			ch: " ",
			track: {
				bg: "gray",
			},
			style: {
				inverse: true,
				fg: "white",
			},
		},
		style: {
			fg: "gray",
		},
		border: {
			type: "line",
		},
	})
}

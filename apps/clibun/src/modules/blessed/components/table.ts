import blessed from "blessed"

function longestString(strings: string[]): number {
	let longest = 0
	for (const s of strings) {
		if (s.length > longest) {
			longest = s.length
		}
	}
	return longest + 4
}

function columnTexts(data: string[][], columnWidths: number[]) {
	const texts: string[] = []
	for (const row of data) {
		let text = ""
		for (let i = 0; i < row.length; i++) {
			text += row[i].padEnd(columnWidths[i])
		}
		texts.push(text)
	}
	return texts
}

export function customTable(headers: string[], data: string[][], onClick?: (index: number) => void) {
	const columns = headers.map((h) => [h])

	for (const d of data) {
		for (let i = 0; i < d.length; i++) {
			columns[i].push(d[i])
		}
	}

	const columnWidths = columns.map((c) => longestString(c))
	const dataColumns = columnTexts(data, columnWidths)
	const totalWidth = columnWidths.reduce((a, b) => a + b, 0)

	const box = blessed.box({
		top: 0,
		left: 0,
		padding: {
			left: 1,
			right: 1,
		},
		width: totalWidth + 4,
		height: data.length + 3,
		border: {
			type: "line",
		},
	})

	const headersBox = blessed.box({
		top: 0,
		left: 0,
		width: totalWidth,
		height: columns[0].length,
	})
	let currentWidth = 0
	for (let i = 0; i < headers.length; i++) {
		headersBox.append(
			blessed.text({
				top: 0,
				left: currentWidth,
				width: columnWidths[i],
				height: 1,
				content: headers[i],
				tags: true,
				style: {
					fg: "blue",
				},
			}),
		)

		currentWidth += columnWidths[i]
	}

	box.append(headersBox)

	let rowIndex = 0
	for (const row of dataColumns) {
		const rowBox = blessed.box({
			top: ++rowIndex,
			left: 0,
			width: totalWidth,
			content: row,
			height: 1,
			mouse: true,
			style: {
				fg: "gray",
				hover: {
					fg: "white",
				},
			},
			bg: "red",
		})
		rowBox.on("click", () => {
			onClick?.(rowIndex - 1)
		})

		box.append(rowBox)
	}

	return box
}

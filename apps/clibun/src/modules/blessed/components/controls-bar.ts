import blessed from 'blessed'
import { maxStringLength } from '../../../core/lib/util.js'

export function ControlsBar({
    width,
    left,
	top,
    items,
    selectedItem,
}: {
    width: number | string,
	top?: number | string,
    left: number | string,
    items: {
        name: string,
        onSelect: () => void,
    }[],
    selectedItem?: number,
}) {
    const maxLength = maxStringLength(items.map(i => i.name))

    const navbar = blessed.box({
		padding: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		},
		left,
		tags: true,
		keys: true,
		vi: true,
		mouse: true,
		width,
		height: 3,
		top,
		style: {
			fg: "gray",
		},
		border: {
			type: "line",
		},
	})

    let curWidth = 0
    items.forEach((item, index) => {
		const menuItem = blessed.box({
			content: item.name,
			width: maxLength + 4,
			top: -1,
			padding: {
				left: 1,
				right: 1,
			},
			height: 3,
			left: curWidth - 1,
			style: {
				fg: selectedItem === index ? "white" : "gray",
				hover: {
					fg: "white",
				},
			},
			border: {
				type: "line",
			},
			align: "center",
		})

		menuItem.on("click", item.onSelect)

		navbar.append(menuItem)
        curWidth += maxLength + 3
    })
    return {
        navbar,
        itemWidth: maxLength + 3,
    }
}
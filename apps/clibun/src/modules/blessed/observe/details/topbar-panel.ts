import blessed from "blessed"

import { Message } from "../../../module.js"
import { ControlsBar } from "../../components/controls-bar.js"

export function TopbarPanel({
	select,
	message,
	selectedMenu,
}: {
	select: (index: number) => void
	message: Message
	selectedMenu: number
}) {
	const menuItems = [
		{
			name: "Details",
			onSelect: () => select(0),
		},
		{
			name: "Headers",
			onSelect: () => select(1),
		},
		{
			name: "Body",
			onSelect: () => select(2),
		},
	]

	const topBarInfo = (() => {
		if (!message) return " "

		const msDelta = message.send_at.getTime() - message.received_at.getTime()
		const statusColor =
			message.status >= 200 && message.status < 300
				? "green"
				: message.status >= 300 && message.status < 400
				? "yellow"
				: message.status >= 400
				? "red"
				: "gray"

		return `${message.method}  ${msDelta} ms  {${statusColor}-fg}${message.status} OK{/${statusColor}-fg}`
	})()

	const { navbar, itemWidth } = ControlsBar({
		width: "100%-12",
		left: 12,
		items: menuItems,
		selectedItem: selectedMenu,
	})

	const detailsLeft = itemWidth * menuItems.length
	const details = blessed.box({
		width: `100%-${detailsLeft + 2}`,
		height: 1,
		padding: {
			right: 1,
		},
		left: detailsLeft,
		tags: true,
		align: "right",
		content: topBarInfo,
	})
	navbar.append(details)

	const hidebox = blessed.box({
		left: selectedMenu * itemWidth + 13,
		width: itemWidth - 1,
		height: 1,
		top: 2,
		content: " ",
	})

	return {
		navbar,
		hidebox,
		details,
	}
}

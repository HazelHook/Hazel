import blessed from "blessed"

import { Module, UserData } from "../../module.js"
import { customTable } from "../components/table.js"
import { Text } from "../components/text.js"
import { observeWebhook } from "./observe-webhook.js"

export function getObserveMenu(data: UserData, module: Module, rerender: (box: blessed.Widgets.BoxElement) => void) {
	const box = blessed.box({
		width: "100%",
		height: "100%",
	})

	box.append(
		Text({
			content: "Select the destination you want to observe.",
			variant: "title",
		}),
	)

	const destinationTable: string[][] = []
	for (const d of data.destinations) {
		const conns = data.connections.filter((c) => c.destination === d.id)
		const srcs = conns.map((c) => data.sources.find((s) => s.id === c.source)?.name)

		destinationTable.push([d.name, srcs.join(", "), d.url, d.id])
	}

	const table = customTable(["Name", "Connected Sources", "Destination URL", "ID"], destinationTable, (index) => {
		observeWebhook(data, module, data.destinations[index].id, rerender)
	})
	table.top = 3

	box.append(table)
	rerender(box)
}

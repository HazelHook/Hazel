import { prettyTimestamp } from "../../../core/lib/print-util.js"
import { openInBrowser } from "../../../core/lib/util.js"
import { Message, Module, UserData } from "../../module.js"
import blessed from "blessed"
import { ScrollableList } from "../components/scrollable-list.js"
import { DetailsPanel } from "./details/details.js"

const messages: Message[] = []
let selectedMessage = 0

export function observeWebhook(
	userData: UserData,
	module: Module,
	destinationId: string,
	rerender: (box: blessed.Widgets.BoxElement) => void,
) {
	module.triggerRequestEvent({
		type: "websocket-connect",
		destinationId,
		onMessage(data) {
			messages.push(data)
			rerender(buildMessageBox(userData, module, rerender))
		},
		onClose() {},
		onOpen() {},
	})
	rerender(buildMessageBox(userData, module, rerender))
}

function buildMessageBox(
	data: UserData,
	module: Module,
	rerender: (box: blessed.Widgets.BoxElement) => void,
): blessed.Widgets.BoxElement {
	const requestList = ScrollableList({
		items: messages.map((m) => prettyTimestamp(m.received_at)),
		selected: selectedMessage,
        placeholder: "Waiting...",
		onSelect(_, index) {
			selectedMessage = index
			rerender(buildMessageBox(data, module, rerender))
		}
	})

	const details = DetailsPanel({
		rerender: () => rerender(buildMessageBox(data, module, rerender)),
		message: messages[selectedMessage]
	})

	const box = blessed.box({
		width: "100%",
		height: "100%",
		children: [requestList, ...details],
	})

	return box
}

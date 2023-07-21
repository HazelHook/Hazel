
import { copyToClipboard, openInBrowser } from "../../../../core/lib/util.js"
import { Message } from "../../../module.js"
import { ControlsBar } from "../../components/controls-bar.js"

export function ControlsPanel({
    message,
}: {
    message: Message,
}) {
	const controls = [
		{
			name: "Dashboard",
			onSelect: () => {
				openInBrowser(`http://localhost:3001/request/${message.requestId}`)
			},
		},
		{
			name: "Copy cURL",
			onSelect: () => {
				const curl = `curl -X ${message.method} "${message.url}?${Object.entries(message.query)
					.map(([key, value]) => `${key}=${value}`)
					.join("&")}" ${Object.entries(message.headers)
					.map(([key, value]) => `-H "${key}: ${value}"`)
					.join(" ")} -d '${JSON.stringify(message.data)}'`
				copyToClipboard(curl)
			},
		},
		{
			name: "Copy body",
			onSelect: () => {
				copyToClipboard(JSON.stringify(message.data))
			},
		},
	]
	const { navbar: controlBar } = ControlsBar({
		width: "100%-12",
		left: 12,
		top: "100%-3",
		items: controls,
		selectedItem: -1,
	})
    return controlBar
}
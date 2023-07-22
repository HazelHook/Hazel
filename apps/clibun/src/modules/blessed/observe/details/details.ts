import { Message } from "../../../module.js"
import { ControlsPanel } from "./controls-panel.js"
import { MainPanel } from "./main-panel.js"
import { TopbarPanel } from "./topbar-panel.js"

let selectedMenu = 0

export function DetailsPanel({
	rerender,
	message,
}: {
	rerender: () => void
	message: Message
}) {
	const { hidebox, navbar } = TopbarPanel({
		select: (index: number) => {
			selectedMenu = index
			rerender()
		},
		message,
		selectedMenu,
	})

	const details = MainPanel({ message, selectedMenu })
	const controls = ControlsPanel({ message })

	return [navbar, hidebox, details, controls]
}




import { prettyTimestamp, renderList } from "../../../../core/lib/print-util.js"
import { maxStringLength } from "../../../../core/lib/util.js"
import { Message } from "../../../module.js"
import { ScrollablePanel } from "../../components/scrollable-panel.js"

export function MainPanel({
    message,
    selectedMenu,
}: {
    message?: Message,
    selectedMenu: number,
}) {
	const detail = ScrollablePanel({
		width: "100%-12",
		height: "100%-4",
		top: 2,
		left: 12,
	})

	if (!message) {
		detail.setContent("No messages received yet.")
        return detail
	} 
    
    if (selectedMenu === 0) {
        
		detail.setContent(renderDetails(message))
	} else if (selectedMenu === 1) {
		detail.setContent(renderHeaders(message))
	} else if (selectedMenu === 2) {
		detail.setContent(renderBody(message))
	}

    return detail
}

function renderHeaders(message: Message){
    return `Request headers\n\n${renderList(message.headers)}`
}

function renderBody(message: Message){
    return `{bold}Request body{/bold}\n\n${JSON.stringify(message.data, null, 2)}`
}

function renderDetails(message: Message){
    const date = message.received_at.toDateString()
    const time = prettyTimestamp(message.received_at)
    const mili = message.received_at.getMilliseconds()

    const request = renderList({
        "Receieved at": `${date} ${time}:${mili}`,
        Source: message.sourceId,
        Method: message.method,
    })
    const query = renderList(message.query)

    return `Request details\n\n${request}\n\nQuery Params\n\n${query}`
}

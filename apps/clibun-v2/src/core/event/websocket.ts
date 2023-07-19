import { Message, WebsocketRequestEvent } from "../../modules/module.js"
import WebSocket from "ws"

const WEBSOCKET_BACKEND = process.env["BACKEND_WEBSOCKET_URL_WS"]

global.websockets = {} as Record<string, WebSocket>
export function handleWebsocketRequestEvent(event: WebsocketRequestEvent) {
	const url = `${WEBSOCKET_BACKEND}/ws/${event.destinationId}`

	const ws = new WebSocket(url)

	ws.onmessage = (message) => {
		const deserialized = JSON.parse(message.data.toString())

		const msg: Message = {
			requestId: deserialized.requestId,
			method: deserialized.method,
			source: deserialized.source,
			data: deserialized.data,
			timestamp: new Date(deserialized.timestamp),
			headers: deserialized.headers,
		}

		event.onMessage(msg)
	}

	ws.onopen = () => {
		global.websockets[url] = ws
		event.onOpen()
	}

	ws.onclose = () => {
		delete global.websockets[url]
		event.onClose()
	}
}

import { Message, WebsocketRequestEvent } from "../../modules/module.js"
import WebSocket from "ws"

const WEBSOCKET_BACKEND = process.env["BACKEND_WEBSOCKET_URL_WS"]

global.websockets = {} as Record<string, WebSocket>
export function handleWebsocketRequestEvent(event: WebsocketRequestEvent) {
	const url = `${WEBSOCKET_BACKEND}/ws/${event.destinationId}`

	const ws = new WebSocket(url)

	ws.onmessage = (message) => {
		const deserialized = JSON.parse(message.data.toString())
		const parameters = deserialized.query.split("&")
		const query: Record<string, string> = {}
		for (const parameter of parameters) {
			const [key, value] = parameter.split("=")
			query[key] = value
		}

		const msg: Message = {
			requestId: deserialized.requestId,
			method: deserialized.method,
			sourceId: deserialized.sourceId,
			url: deserialized.url,
			responseId: deserialized.responseId,
			data: JSON.parse(deserialized.body),
			headers: deserialized.headers,
			received_at: new Date(deserialized.received_at),
			response_at: new Date(deserialized.response_at),
			send_at: new Date(deserialized.send_at),
			status: deserialized.status,
			query
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

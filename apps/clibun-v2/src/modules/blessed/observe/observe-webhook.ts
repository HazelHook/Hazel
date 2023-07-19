import { prettyTimestamp } from "../../../core/lib/print-util.js";
import { Message, Module, UserData } from "../../module.js";
import blessed from "blessed"

const messages: Message[] = []

export function observeWebhook(userData: UserData, module: Module, destinationId: string, rerender: (box: blessed.Widgets.BoxElement) => void) {
    module.triggerRequestEvent({
        type: 'websocket-connect',
        destinationId,
        onMessage(data) {
            messages.push(data)
            rerender(buildMessageBox(userData, module))
        },
        onClose() {
        },
        onOpen() {
        }
    })
    rerender(buildMessageBox(userData, module))
}

function buildMessageBox(_: UserData, _m: Module) {
    const uniques: Message[] = [
		{
			timestamp: new Date(1689607812776),
			requestId: "req_QhHhMpmTC4rWVoaFolMhQ",
			source: "Kombo",
			method: "POST",
			headers: {
				accept: "*/*",
				"accept-encoding": "gzip, deflate, br",
				connection: "keep-alive",
				"content-length": "21",
				"content-type": "application/json",
				host: "127.0.0.1:3003",
				"user-agent": "PostmanRuntime/7.32.2",
			},
			data: {
				id: "5gjAtURLPbnTiwgkaBfiA3WJ",
				type: "sync-finished",
				data: {
					sync_id: "EY2KfFEZ5Vc2FVfVUQFpRduM",
					sync_state: "SUCCEEDED",
					sync_started_at: "2022-11-02T10:50:10.242Z",
					sync_ended_at: "2022-11-02T10:50:14.751Z",
					sync_duration_seconds: 14.509,
					integration_id: "personio:hris-dev",
					integration_tool: "personio",
					integration_category: "HRIS",
				},
			},
		},
		{
			timestamp: new Date(1689607812776),
			requestId: "req_QhHhMpmTCsdklk2olMhQ",
			source: "Stripe",
			method: "GET",
			headers: {
				accept: "*/*",
				"accept-encoding": "gzip, deflate, br",
				connection: "keep-alive",
				"content-length": "21",
				"content-type": "application/json",
				host: "127.0.0.1:3003",
				"user-agent": "PostmanRuntime/7.32.2",
			},
			data: {
				id: "5gjAtURfdfdTiwgkaBfiA3WJ",
				type: "customer-acquired",
				data: {
					customer_id: "usr_sdkl32d0pe2ss",
					level: "premium",
					plan: "yearly",
					state: "confirmed",
				},
			},
		},
	]

	let messages: Message[] = []

	for (let i = 0; i < 25; i++) {
		const current = {
			...uniques[i % uniques.length],
		}
		current.timestamp = new Date(current.timestamp.getTime() + 1000 * 3600 * 1.0 * Math.random())
		messages.push(current)
	}

	messages = messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())


    const requestList = blessed.list({
        top: 0,
        left: 0,
        width: 12,
        height: messages.length + 2,
        mouse: true,
        keys: true,
        vi: true,
        alwaysScroll: true,
        scrollable: true,
        scrollbar: {
            ch: " ",
            track: {
                bg: "gray",
            },
            style: {
                inverse: true,
            },
        },
        style: {
            fg: "white",
        },
        padding: {
            left: 1,
        },
        align: "center",
        border: {
            type: "line",
        }
    })

    let index = 0
    for(const m of messages){
        requestList.append(blessed.text({
            top: index++,
            content: prettyTimestamp(m.timestamp),
            style: {
                fg: "red",
            },
        }))
    }

    return requestList
}
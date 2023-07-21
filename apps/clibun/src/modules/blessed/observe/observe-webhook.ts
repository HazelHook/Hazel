import { prettyTimestamp } from "../../../core/lib/print-util.js";
import { openInBrowser } from "../../../core/lib/util.js";
import { Message, Module, UserData } from "../../module.js";
import blessed from "blessed"

const messages: Message[] = []
let selectedMessage = 0
let selectedMenu = 0

export function observeWebhook(userData: UserData, module: Module, destinationId: string, rerender: (box: blessed.Widgets.BoxElement) => void) {
    module.triggerRequestEvent({
        type: 'websocket-connect',
        destinationId,
        onMessage(data) {
            messages.push(data)
            rerender(buildMessageBox(userData, module, rerender))
        },
        onClose() {
        },
        onOpen() {
        }
    })
    rerender(buildMessageBox(userData, module, rerender))
}

const uniques: Message[] = [
    {
        received_at: new Date(1689607812776),
        response_at: new Date(1689607812776),
        send_at: new Date(1689607812776),
        status: 200,
        requestId: "req_QhHhMpmTC4rWVoaFolMhQ",
        sourceId: "Kombo",
        method: "POST",
        query: {
            "param1": "value1",
            "param2": "value2",
        },
        responseId: "res_QhHhMpmTC4rWVoaFolMhQ",
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
        received_at: new Date(1689607812776),
        response_at: new Date(1689607812776),
        send_at: new Date(1689607812776),
        status: 200,
        requestId: "req_QhHhMpmTCsdklk2olMhQ",
        sourceId: "Stripe",
        method: "GET",
        query: {
            "param1": "value1",
            "param2": "value2",
        },
        responseId: "res_QhHhMpmTC4rWVoaFolMhQ",
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

for (let i = 0; i < 25; i++) {
    const current = {
        ...uniques[i % uniques.length],
    }
    current.received_at = new Date(current.received_at.getTime() + 1000 * 3600 * 1.0 * Math.random())
    current.send_at = new Date(current.received_at.getTime() + 200 * Math.random())
    current.response_at = new Date(current.send_at.getTime() + 2000 * (Math.random() * Math.random()))
    // messages.push(current)
}

// messages = messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())


function buildMessageBox(data: UserData, module: Module, rerender: (box: blessed.Widgets.BoxElement) => void): blessed.Widgets.BoxElement {

    const requestList = blessed.list({
        padding: {
            left: 1,
        },
        items: messages.map(m => prettyTimestamp(m.received_at)),
        tags: true,
        keys: true,
        vi: true,
        width: 13,
        mouse: true,
        alwaysScroll: true,
        scrollable: true,
        height: "100%",
        scrollbar: {
            ch: " ",
            track: {
                bg: "gray",
            },
            style: {
                inverse: true,
                fg: "white",
            },
        },
        style: {
            fg: "gray",
            selected: {
                fg: "white",
            }
        },
        border: {
            type: "line",
        },
    })
    requestList.select(selectedMessage)

    requestList.on("select item", (_, index) => {
        selectedMessage = index
        rerender(buildMessageBox(data, module, rerender))
    })

    if(messages.length === 0){
        requestList.setContent("Waiting..")
    }


    const navbar = blessed.box({
        padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        left: 12,
        tags: true,
        keys: true,
        vi: true,
        mouse: true,
        width: "100%-12",
        height: 3,
        style: {
            fg: "gray",
        },
        border: {
            type: "line",
        },
    })

    const menuItems = [
        "Details",
        "Headers",
        "Body",
    ]
    const biggestItem = menuItems.reduce((a, b) => a.length > b.length ? a : b).length
    const message = messages[selectedMessage]

    let width = 0
    menuItems.forEach((item) => {
        const menuItem = blessed.box({
            content: item,
            width: biggestItem + 4,
            top: -1,
            padding: {
                left: 1,
                right: 1,
            },
            height: 3,
            left: width - 1,
            style: {
                fg: selectedMenu === menuItems.indexOf(item) ? "white" : "gray",
                hover: {
                    fg: "white",
                }
            },
            border: {
                type: "line",
            },
            align: "center",
        })

        menuItem.on("click", () => {
            selectedMenu = menuItems.indexOf(item)
            rerender(buildMessageBox(data, module, rerender))
        })


        navbar.append(menuItem)
        width += biggestItem + 3

    })

    const statusColor = message.status >= 200 && message.status < 300 ? "green" : message.status >= 300 && message.status < 400 ? "yellow" : "red"
    navbar.append(blessed.box({
        left: width - 1,
        width: `100%-${width}`,
        height: 3,
        top: -1,
        tags: true,
        content: messages.length === 0 ? '' : `${message.method}  ${
            message.send_at.getTime() - message.received_at.getTime()
        } ms  {${statusColor}-fg}200 OK{/${statusColor}-fg}`,
        style: {
            fg: "gray",
        },
        border: {
            type: "line",
        },
        align: "right",
        padding: {
            right: 1,
        }
    }))

    const detail = blessed.box({
        top: 2,
        content: "",
        left: 12,
        tags: true,
        keys: true,
        vi: true,
        mouse: true,
        scrollable: true,
        width: "100%-12",
        height: "100%-4",
        padding: {
            left: 1,

        },
        scrollbar: {
            ch: " ",
            track: {
                bg: "gray",
            },
            style: {
                inverse: true,
                fg: "white",
            },
        },
        style: {
            fg: "gray",
        },
        border: {
            type: "line",
        },
    })

    if(messages.length === 0){
        detail.setContent("No messages received yet.")
    } else if (selectedMenu === 0) {
        const data = {
            "Receieved at": `${message.received_at.toDateString()} ${prettyTimestamp(message.received_at)}:${message.received_at.getMilliseconds()}`,
            "Source": message.sourceId,
            "Method": message.method,
        }
        const longest = Object.keys(data).reduce((a, b) => a.length > b.length ? a : b).length + 1
        const requests = Object.keys(data).map(key => `${key.padEnd(longest)}: ${data[key]}`).join("\n")

        const longestQuery = Object.keys(message.query).reduce((a, b) => a.length > b.length ? a : b).length + 1
        const query = Object.keys(message.query).map(key => `${key.padEnd(longestQuery)}: ${message.query[key]}`).join("\n")

        detail.setContent(`{bold}Request details{/bold}\n\n${requests}\n\n{bold}Query Params{/bold}\n\n${query}`)
    } else if (selectedMenu === 1) {
        const longest = Object.keys(message.headers).reduce((a, b) => a.length > b.length ? a : b).length + 1
        const content = Object.keys(message.headers).map(key => `${key.padEnd(longest)}: ${message.headers[key]}`).join("\n")

        detail.setContent(`{bold}Request headers{/bold}\n\n${content}`)
    } else if (selectedMenu === 2) {
        detail.setContent(`{bold}Request body{/bold}\n\n${JSON.stringify(message.data, null, 2)}`)
    }

    const borderHide = blessed.box({
        left: selectedMenu * (biggestItem + 3) + 13,
        width: biggestItem + 2,
        height: 1,
        top: 2,
        content: " ",
    })
    borderHide.setFront()

    const controls = [
        "Dashboard",
        "Retry Request",
        "Copy cURL",
        "Copy Body",
    ]
    const controlBar = blessed.box({
        top: "100%-3",
        left: 12,
        tags: true,
        mouse: true,
        width: "100%-12",
        border: {
            type: "line",
        },
    })

    let controlWidth = 0
    controls.forEach((item) => {
        const menuItem = blessed.box({
            content: item,
            width: item.length + 4,
            top: -1,
            padding: {
                left: 1,
                right: 1,
            },
            clickable: true,
            mouse: true,
            height: 3,
            left: controlWidth - 1,
            style: {
                fg: "gray",
                hover: {
                    fg: "white",
                }
            },
            border: {
                type: "line",
            },
            align: "center",
        })

        menuItem.on("click", () => {
            if (item === "Dashboard") {
                openInBrowser(`http://localhost:3001/request/${message.requestId}`)
            }
        })

        controlBar.append(menuItem)
        controlWidth += item.length + 3
    })


    const box = blessed.box({
        width: "100%",
        height: "100%",
        children: [requestList, navbar, detail, borderHide, controlBar],
    })

    return box
}

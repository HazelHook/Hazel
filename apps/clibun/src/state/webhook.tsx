import React, { ReactNode, useState } from "react"
import { Box, Text, useInput } from "ink"
import WebSocket from "ws"
import { exec } from "child_process"
import { Divider } from "./divider.js"
import axios from "axios"

type Message = {
	requestId: string
	source: string
	data: any
	headers: Record<string, string>
	timestamp: Date
	method: "GET" | "POST"
}

const messages: Message[] = []
export function handleWebhookMessage(data: WebSocket.RawData, url?: string) {
	const deserialized = JSON.parse(data.toString())

	const body = JSON.parse(deserialized.data) // This should be extended with cleartext, xml etc.

	const msg: Message = {
		requestId: deserialized.requestId,
		method: deserialized.method,
		source: deserialized.source,
		data: body,
		timestamp: new Date(deserialized.timestamp),
		headers: deserialized.headers,
	}

	if (url) {
		if(msg.method === 'POST') {
			axios.post(url, deserialized.data, {
				headers: msg.headers,
				
			})
		}
		if(msg.method === 'GET') {
			axios.get(url, {
				headers: msg.headers,
				data: deserialized.data
			})
		}
	}

	messages.push(msg)
}

export function renderWebhook(rerender: (node: ReactNode) => void, exit: () => void) {
	return rerender(<Webhook messages={messages} exit={exit} />)
}

function DateTime({ date, selected }: { date: Date; minTime: Date; maxTime: Date; selected: boolean }) {
	function n(num: number, len = 2) {
		let text = num.toString()

		while (text.length < len) {
			text = `0${text}`
		}

		return text
	}
	return (
		<Text dimColor={!selected}>
			[{n(date.getHours())}:{n(date.getMinutes())}:{n(date.getSeconds())}]
		</Text>
	)
}

function Headers({ headers }: { headers: Record<string, string> }) {
	const entries = Object.entries(headers)
	const maxName = entries.reduce((p, c) => {
		return p > c[0].length ? p : c[0].length
	}, 0)

	return (
		<Box flexDirection="column">
			{entries.map((e, i) => {
				const repeat = maxName - e[0].length
				return (
					<Text key={i}>
						{` ${capitalizeHeader(e[0])}`}
						{" ".repeat(repeat)}
						{` │ ${e[1]}`}
					</Text>
				)
			})}
		</Box>
	)
}

function Webhook({ messages, exit }: { messages: Message[]; exit: () => void }) {
	const [selected, setSelected] = useState(0)
	const [hSelected, setHSelected] = useState(0)

	useInput((_, key) => {
		if (key.escape) {
			exit()
		}

		if (key.upArrow && hSelected === 0) {
			const newS = selected - 1
			setSelected(newS < 0 ? 0 : newS)
		} else if (key.downArrow && hSelected === 0) {
			const newS = selected + 1
			setSelected(newS >= messages.length ? messages.length - 1 : newS)
		} else if (key.leftArrow) {
			const newS = hSelected - 1
			setHSelected(newS < 0 ? 0 : newS)
		} else if (key.rightArrow) {
			const newS = hSelected + 1
			setHSelected(newS >= 5 ? 4 : newS)
		}

		if (key.return) {
			const msg = messages[selected]
			if (hSelected === 1) {
				exec(`open "https://app.hazelhook.dev/request/${msg.requestId}"`)
			} else if (hSelected === 2) {
			} else if (hSelected === 3) {
			} else if (hSelected === 4) {
			}
		}
	})

	if (messages.length === 0) {
		return (
			<Box borderStyle="round" key="to-loading" flexDirection="column">
				<Text dimColor>Waiting for webhook event...</Text>
				<Box height={1} />
				<Text>To leave press ESC</Text>
			</Box>
		)
	}

	const minTime = messages.at(0)?.timestamp
	const maxTime = messages.at(messages.length - 1)?.timestamp

	return (
		<Box flexDirection="column" key="top-wh">
			<Box flexDirection="row">
				<Box flexDirection="column" borderStyle="single">
					{/* <Divider title="Requests" /> */}
					{messages.map((msg, i) => {
						return (
							<Box height={1} key={i}>
								<DateTime date={msg.timestamp} maxTime={maxTime} minTime={minTime} selected={i === selected} />
								{selected === i ? (
									<Text color="green" bold>
										{` ${msg.source} `}
									</Text>
								) : (
									<Text>{` ${msg.source} `}</Text>
								)}
							</Box>
						)
					})}
				</Box>
				<Box flexDirection="column" borderStyle="single" justifyContent="space-between">
					<Box flexDirection="column">
						<Box>
							<Text>{messages[selected].method === "POST" ? " POST   " : " GET    "}</Text>
							<Text>Latency: 431ms</Text>
						</Box>
						<Divider title="Headers" />
						<Headers headers={messages[selected].headers} />
						<Divider title="Body" />
						<Text>
							{JSON.stringify(messages[selected].data, null, 2)
								.split("\n")
								.filter((_, i) => i < 100)
								.join("\n")}
						</Text>
					</Box>
					<Box flexDirection="row" justifyContent="space-around" borderStyle="single">
						<Text dimColor={hSelected !== 1} bold={hSelected === 1}>
							Open Dashboard
						</Text>
						<Text dimColor={hSelected !== 2} bold={hSelected === 2}>
							Retry
						</Text>
						<Text dimColor={hSelected !== 3} bold={hSelected === 3}>
							Copy CURL
						</Text>
						<Text dimColor={hSelected !== 4} bold={hSelected === 4}>
							Copy Body
						</Text>
					</Box>
				</Box>
			</Box>
			<Text>Back (ESC)</Text>
		</Box>
	)
}

function capitalizeHeader(name: string) {
	if (name.startsWith("x-")) {
		return name.toUpperCase()
	}

	const split = name.split("-")

	return split.map((s) => s[0].toUpperCase() + s.substring(1)).join("-")
}

export function DummyWebhook() {
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

	let result: Message[] = []

	for (let i = 0; i < 25; i++) {
		const current = {
			...uniques[i % uniques.length],
		}
		current.timestamp = new Date(current.timestamp.getTime() + 1000 * 3600 * 1.0 * Math.random())
		result.push(current)
	}

	result = result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

	return <Webhook messages={result} exit={() => {}} />
}

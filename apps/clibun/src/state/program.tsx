import React, { ReactNode } from "react"
import { AxiosInstance } from "axios"
import { Token, tryGetToken } from "../token.js"
import { Box, render, Text } from "ink"
import { Login } from "./login.js"
import WebSocket from "ws"
import Menu from "../menu/menu.js"
import { handleWebhookMessage, renderWebhook } from "./webhook.js"

export type ProgramState = "starting" | "menu" | "webhook"

export class Program {
	state: ProgramState = "starting"
	client: AxiosInstance
	token: Token | null = null
	rerender: (node: ReactNode) => void
	ws: WebSocket | null = null

	constructor(client: AxiosInstance) {
		this.state = "starting"
		this.client = client
	}

	async executeState() {
		// render(<DummyWebhook/>)
		// return

		if (this.state === "starting") {
			const rend = render(<Box borderStyle="round">
				<Text>Logging in...</Text>
			</Box>)
			this.rerender = rend.rerender

			this.token = await tryGetToken(this.client)

			if (!this.token) {
				this.rerender(<Login client={this.client} />)
			} else {
				this.state = "menu"
				this.executeState()
			}
		} else if (this.state === "menu") {
			this.rerender(
				<Menu
					client={this.client}
					token={this.token}
					openWebsocket={(id: string, url?: string) => {
						this.websocket(id, url)
					}}
				/>,
			)
		} else if (this.state === "webhook") {
			renderWebhook(this.rerender, () => {
				this.state = "menu"
				this.executeState()
			})
		}
	}

	async loggedIn() {
		console.log("logged in")
		this.state = "menu"
		await this.executeState()
	}

	async websocket(id: string, url?: string) {
		this.state = "webhook"
		this.ws = new WebSocket(`${process.env["BACKEND_WEBSOCKET_URL_WS"]}/ws/${id}`)

		this.ws.on("message", (data) => {
			handleWebhookMessage(data, url)
			this.executeState()
		})

		this.ws.on("open", () => {
			console.log("Websocket opened")
		})

		await this.executeState()
	}
}

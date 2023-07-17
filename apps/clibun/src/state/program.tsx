import React from "react"
import { AxiosInstance } from "axios"
import { Token, tryGetToken } from "../token.js"
import { render } from "ink"
import { Login } from "./login.js"
import WebSocket from "ws"
import Menu from "./menu.js"

export type ProgramState = "starting" | "menu" | "webhook"

export class Program {
	state: ProgramState = "starting"
	client: AxiosInstance
	token: Token | null = null
	unmount: () => void
	ws: WebSocket | null = null

	constructor(client: AxiosInstance) {
		this.state = "starting"
		this.client = client
	}

	async executeState() {
		if (this.state === "starting") {
			this.token = await tryGetToken(this.client)
			if (!this.token) {
				const rend = render(<Login client={this.client} />)
				this.unmount = rend.unmount
			} else {
				this.state = "menu"
				await this.executeState()
			}
		} else if (this.state === "menu") {
			const rend = render(
				<Menu
					client={this.client}
					token={this.token}
					openWebsocket={(id) => {
						this.websocket(id)
					}}
				/>,
			)
			this.unmount = rend.unmount
		} else if (this.state === "webhook") {
			console.log("Not sure")
		}
	}

	async loggedIn() {
		console.log("logged in")
		this.state = "menu"
		this.unmount()
	}

	async websocket(id: string) {
		this.state = "webhook"
		this.ws = new WebSocket(`${process.env["BACKEND_WEBSOCKET_URL_WS"]}/ws/${id}`)

		this.ws.on("message", (data) => {
			console.log("Data received")
			console.log(data)
		})

		this.ws.on("open", () => {
			console.log("Websocket opened")
		})

		this.unmount()
		await this.executeState()
	}
}

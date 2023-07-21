import { RequestClient } from "../../core/lib/request-client.js"
import { CLIRequestEvent, CLIResponseEvent, Module, ModuleData } from "../module.js"
import { login } from "./components/login.js"
import blessed from "blessed"
import { getMenu } from "./menu.js"

global.hazelModuleInitialized = false

export class BlessedModule extends Module {
	private triggerEvent: (event: CLIRequestEvent) => void
	private client: RequestClient
	private screen: blessed.Widgets.Screen

	private constructor() {
		super()
		global.hazelModuleInitialized = true
	}

	override async init(data: ModuleData) {
		this.client = data.client
		this.screen = blessed.screen({
			smartCSR: true,
			title: "Hazel CLI",
			dockBorders: true,
		})
		this.screen.key(["escape", "q", "C-c"], function () {
			return process.exit(0)
		})
	}

	override setRequestEventCallback(callback: (data: CLIRequestEvent) => void) {
		this.triggerEvent = callback
	}

	override onResponseEvent(event: CLIResponseEvent): void {
		if (event.type === "user-data") {
			getMenu(event, this, (box) => {
				for(const child of this.screen.children){
					child.detach()
				} 
				this.screen.append(box)
				this.screen.render()
			})
		} else if (event.type === "login"){
			for(const child of this.screen.children){
				child.detach()
			} 
			this.screen.render()
			this.triggerEvent({
				type: "user-data",
			})
		}
	}

	override start(token?: string) {
		if (!token) {
			const box = login(() => {
				this.triggerEvent({
					type: "login",
				})
			})

			this.screen.append(box)
			this.screen.render()
		} else {
			this.client.setToken(token)
			this.screen.append(
				blessed.box({
					top: "center",
					left: "center",
					content: "Loading...",
					tags: true,
					style: {
						fg: "white",
					},
				}),
			)
			this.screen.render()
			this.triggerEvent({
				type: "user-data",
			})
		}
	}

	override triggerRequestEvent(event: CLIRequestEvent): void {
		this.triggerEvent(event)
	}

	static create(): BlessedModule {
		if (global.hazelModuleInitialized) {
			throw new Error("Module already initialized.")
		}

		return new BlessedModule()
	}
}

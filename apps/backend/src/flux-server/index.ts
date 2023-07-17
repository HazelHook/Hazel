import { Elysia } from "elysia"
import { addCLIEndpoints } from "./api/cli"
import { addHookEndpoints } from "./api/hook"

const app = new Elysia()
	.get("/", async () => {
		return "Hello Elysia"
	})
	.group("v1", (app) => {
		const basic = app.get("/", () => "V1 API").get("/status", () => `Uptime: ${process.uptime().toFixed()}s`)
		const cli = addCLIEndpoints(basic as any)
		const hook = addHookEndpoints(cli as any)

		return hook
	})
	.listen(3003)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

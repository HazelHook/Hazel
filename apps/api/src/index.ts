import { Elysia } from "elysia"
import { connectionRouter } from "./routes/connections.route"

const app = new Elysia()
	.get("/", () => "Hello Elysia")
	.use(connectionRouter)
	.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

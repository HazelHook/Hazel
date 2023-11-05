import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"

import { connectionRouter } from "./routes/v1/connections"

const app = new Elysia()
	.use(swagger())
	.onError(({ code, error, set }) => {
		let statusCode = 400
		switch (code) {
			case "INTERNAL_SERVER_ERROR":
				statusCode = 500
				break
			case "NOT_FOUND":
				statusCode = 404
				break
			case "PARSE":
				statusCode = 400
				break
			case "VALIDATION":
				statusCode = 403
				break

			default:
				statusCode = 400
				break
		}

		if (error.message === "Unauthorized") {
			set.status = 401
		}

		if (error.message === "Ratelimit") {
			set.status = 429
		}

		return new Response(error.message, {
			status: statusCode,
			statusText: error.message as string,
		})
	})
	.get("/", () => "Hello Elysia")
	.group("v1", (app) => app.use(connectionRouter))

	.listen(3006)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

import db from "@hazel/db/src/drizzle"
import Elysia, { t, ws } from "elysia"
import { ElysiaWS } from "elysia/dist/ws"

const sockets = new Map<string, ElysiaWS<any>>()

const app = new Elysia()
	.post(
		"/forward",
		async ({ set, body }) => {
			console.log("Forwarding", body)
			for (const destination of body.destinations) {
				const socket = sockets.get(destination.id)
				if (!socket) {
					await db.destination.update({
						publicId: destination.id,
						websocket_connection: false,
					})
				} else {
					socket.send({
						requestId: body.requestId,
						method: body.method,
						sourceId: body.sourceId,
						body: body.body,
						headers: body.headers,
						url: destination.url,
						responseId: destination.responseId,
						query: body.query,
						received_at: body.received_at,
						send_at: destination.send_at,
						response_at: destination.response_at,
						status: destination.status,
					})
				}
			}

			set.status = 200
			return "Success"
		},
		{
			body: t.Object({
				requestId: t.String(),
				method: t.String(),
				sourceId: t.String(),
				body: t.Any(),
				headers: t.Any(),
				received_at: t.String(),
				destinations: t.Array(
					t.Object({
						id: t.String(),
						responseId: t.String(),
						send_at: t.String(),
						url: t.String(),
						response_at: t.String(),
						status: t.Number(),
					}),
				),
				query: t.String(),
			}),
		},
	)
	.use(ws())
	.ws("/ws/:destination_id", {
		open(ws) {
			console.log("Opened")

			// Giga insecure
			db.destination.update({
				publicId: ws.data.params["destination_id"] as string,
				websocket_connection: true,
			})

			const destinationId = ws.data.params["destination_id"] as string
			sockets.set(destinationId, ws)
		},
		message(ws, _) {},
		close(ws) {
			console.log("Closed")
			const destinationId = ws.data.params["destination_id"] as string
			sockets.delete(destinationId)
		},
	})
	.listen(5004)

console.log(`🦊 Elysia socket is running at ${app.server?.hostname}:${app.server?.port}`)

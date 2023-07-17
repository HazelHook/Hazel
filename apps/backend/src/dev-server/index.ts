import Elysia, { ws } from "elysia"
import { ElysiaWS } from "elysia/dist/ws"
import db from "db/src/drizzle"

const sockets = new Map<string, ElysiaWS<any>>()

const app = new Elysia()
    .post("/forward/:destination_id", async ({ params, set, request }) => {
        console.log("Forwarding")
        const destinationId = params.destination_id
        const socket = sockets.get(destinationId)
        if (!socket) {
            console.log("Failed to find socket!")
            set.status = 404
            return {
                message: "No socket found with that id",
            }
        }
        socket.send(await request.text())
    })
	.use(ws())
	.ws("/ws/:destination_id", {
		open(ws) {
            console.log("Opened")

            // Giga insecure
            db.destination.update({
                publicId: ws.data.params["destination_id"] as string,
                websocket_connection: true
            })

			const destinationId = ws.data.params["destination_id"] as string
			sockets.set(destinationId, ws)
		},
		message(ws, message) {
            // console.log("Message")
            // const destinationId = ws.data.params["destination_id"] as string
            // const socket = sockets.get(destinationId)
            // if (!socket) {
            //     ws.close()
            //     return
            // }

            // socket.send(message)
        },
        close(ws) {
            console.log("Closed")
            const destinationId = ws.data.params["destination_id"] as string
            sockets.delete(destinationId)
        }
	})
	.listen(5004)

console.log(`🦊 Elysia socket is running at ${app.server?.hostname}:${app.server?.port}`)

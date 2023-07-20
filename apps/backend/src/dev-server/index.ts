import Elysia, { t, ws } from "elysia"
import { ElysiaWS } from "elysia/dist/ws"
import db from "db/src/drizzle"
import { ResponseResult } from "../flux-server/api/hook/response-event"

const sockets = new Map<string, ElysiaWS<any>>()

const app = new Elysia()
    .post("/forward", async ({ set, body }) => {
        for(const destination of body.destinations){
            const socket = sockets.get(destination.destination_id)
            if (!socket) {
                await db.destination.update({
                    publicId: destination.destination_id,
                    websocket_connection: false
                })
            }else{
                socket.send(body)
            }
        }

        set.status = 200
    }, {
        body: t.Object({
            destinations: t.Array(t.Object({
                body: t.String(),
                destination_id: t.String(),
                headers: t.String(),
                id: t.String(),
                request_id: t.String(),
                send_timestamp: t.String(),
                source_id: t.String(),
                status: t.Number(),
                success: t.Number(),
                timestamp: t.String()
            }))
        })
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
		message(ws, _) {
        },
        close(ws) {
            console.log("Closed")
            const destinationId = ws.data.params["destination_id"] as string
            sockets.delete(destinationId)
        }
	})
	.listen(5004)

console.log(`🦊 Elysia socket is running at ${app.server?.hostname}:${app.server?.port}`)

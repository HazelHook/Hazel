import { Client, getLagoError } from "lago-javascript-client"

export const lago = Client(process.env.LAGO_API_KEY as string, {
	baseUrl: "https://api.lago.hazelapp.dev/api/v1",
})
export { getLagoError }

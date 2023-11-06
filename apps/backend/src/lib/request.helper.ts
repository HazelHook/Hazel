import { Buffer } from "buffer"

export async function handleRequest(url: string, request: Request, body: string): Promise<string> {
	const data = {
		method: request.method,
		url: url,
		headers: [...request.headers],
		body: body,
	}

	// Convert the JSON object to a string
	const jsonString = JSON.stringify(data)

	// Convert the string to a buffer
	const buffer = Buffer.from(jsonString, "utf8")

	// Convert the buffer to a base64 string
	const base64 = buffer.toString("base64")

	return base64
}

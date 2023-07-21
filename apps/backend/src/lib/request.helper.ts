import { Buffer } from "buffer"

// async function extractBody(request: Request): Promise<string | null> {
// 	const bodyFormats = ["json", "text", "formData"] as const
// 	for (const format of bodyFormats) {
// 		try {
// 			// Try to read the body in this format
// 			const body = await request.clone().body
// 			// if format is 'json', stringify it again to ensure it's a string
// 			return format === "json" ? JSON.stringify(body) : (body as any)
// 		} catch (error) {
// 			// Ignore the error and try the next format
// 		}
// 	}
// 	// If none of the formats worked, return null
// 	return null
// }

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

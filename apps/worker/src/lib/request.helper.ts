export async function consumeBase64(base64: string): Promise<Response> {
	const decodedBuffer = Buffer.from(base64, "base64")

	const decodedString = decodedBuffer.toString("utf8")

	const decodedJson = JSON.parse(decodedString)

	return fetch(decodedJson.url, {
		method: decodedJson.method,
		headers: new Headers(decodedJson.headers),
		body: decodedJson.body,
	})
}

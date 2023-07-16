export async function consumeBase64(base64: string): Promise<Response> {
	console.log("HI")
	const decodedBuffer = Buffer.from(base64, "base64")

	console.log(decodedBuffer)
	const decodedString = decodedBuffer.toString("utf8")

	console.log(decodedString)
	const decodedJson = JSON.parse(decodedString)

	console.log(decodedJson)
	return fetch(decodedJson.url, {
		method: decodedJson.method,
		headers: new Headers(decodedJson.headers),
		body: decodedJson.body,
	})
}

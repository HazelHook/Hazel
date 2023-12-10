import { createHmac } from "crypto"

/**
 * Verifies the HMAC signature of a webhook request in Node.js.
 *
 * @param {string} secret - The secret token used to generate the signature.
 * @param {string} body - The raw string payload of the webhook request.
 * @param {string} signature - The signature received in the webhook request header.
 * @returns {boolean} - Returns true if the signature is verified, false otherwise.
 */
export function verifySignatureNode(secret: string, body: string, signature: string): boolean {
	const hmac = createHmac("sha256", secret)
	const generatedSignature = hmac.update(body).digest("hex")
	return generatedSignature === signature
}

export const POST = async (req: Request) => {
	const isValid = verifySignatureNode(
		"sk_530a7f6d609053a3d750107cc9f",
		JSON.stringify(await req.json()),
		req.headers.get("X-HAZEL_SIGNATURE")!,
	)

	console.log("🚀 ~ file: route.ts:20 ~ POST ~ isValid:", isValid)
	return Response.json({ data: await req.text() })
}

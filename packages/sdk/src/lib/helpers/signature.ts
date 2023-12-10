import { crypto, TextEncoder } from "@edge-runtime/ponyfill"

/**
 * Converts a hex string to a Uint8Array.
 *
 * @param {string} hex - The hex string to convert.
 * @returns {Uint8Array} - The resulting Uint8Array.
 */
function hexToBuffer(hex: string): Uint8Array {
	return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)))
}

/**
 * Verifies the HMAC signature of a webhook request in environments like Next.js Edge Runtime.
 *
 * @param {string} secret - The secret token used to generate the signature.
 * @param {string} body - The raw string payload of the webhook request.
 * @param {string} signature - The signature received in the webhook request header.
 * @returns {Promise<boolean>} - Returns true if the signature is verified, false otherwise.
 */
export async function verifySignature(secret: string, body: string, signature: string): Promise<boolean> {
	const encoder = new TextEncoder()
	const secretKey = encoder.encode(secret)
	const data = encoder.encode(body)

	const key = await crypto.subtle.importKey("raw", secretKey, { name: "HMAC", hash: "SHA-256" }, false, ["verify"])

	return await crypto.subtle.verify("HMAC", key, hexToBuffer(signature), data)
}

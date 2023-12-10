import { createHmac } from "crypto"

export const generateSignature = (body: string, secret: string) => {
	return createHmac("sha256", secret).update(body).digest("hex")
}

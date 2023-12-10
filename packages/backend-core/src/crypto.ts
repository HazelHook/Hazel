import { createHmac } from "crypto"

export const generateSignature = ({ secret, body }: { secret: string; body: string }) => {
	return createHmac("sha256", secret).update(body).digest("hex")
}

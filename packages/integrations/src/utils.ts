import crypto, { BinaryToTextEncoding } from "crypto"

export const validateWithHmac = ({
	signature,
	secret,
	body,
	algorithm,
	encoding,
}: { signature: string; body: string; algorithm: string; secret: string; encoding: BinaryToTextEncoding }) => {
	const newSignature = crypto.createHmac(algorithm, secret).update(body).digest(encoding)

	if (newSignature !== signature) {
		return false
	}

	return true
}

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto"

const IV_LENGTH = 16
const ALGORITHM = "aes-256-cbc"
const HASH_ALGORITHM = "sha256"
const ENCODING = "hex"
const BASE_64_ENCODING = "base64"
const SEPARATOR = ":"

/**
 * @name encrypt
 * @param data
 * @param key
 * @description Encrypt a string (such as an API key).
 * It requires the Secret key environment (SECRET_KEY) variable to be defined
 * Decrypt with {@link decrypt}
 */
export function encrypt(data: string, key = getSecretKey()) {
	const iv = randomBytes(IV_LENGTH)
	const hash = getHash(key)
	const cipher = createCipheriv(ALGORITHM, hash, iv)

	let encrypted = cipher.update(data)

	encrypted = Buffer.concat([encrypted, cipher.final()])

	return iv.toString(ENCODING) + SEPARATOR + encrypted.toString(ENCODING)
}

/**
 * @name decrypt
 * @param data
 * @param key
 * @description Descrypt a string encrypted with {@link encrypt}.
 * It requires the Secret key environment (SECRET_KEY) variable to be defined
 */
export function decrypt(data: string, key = getSecretKey()) {
	const textParts = data.split(SEPARATOR)
	const hash = getHash(key)
	const iv = Buffer.from(textParts.shift() as string, ENCODING)
	const encryptedText = Buffer.from(textParts.join(SEPARATOR), ENCODING)
	const decipher = createDecipheriv(ALGORITHM, hash, iv)

	let decrypted = decipher.update(encryptedText)

	decrypted = Buffer.concat([decrypted, decipher.final()])

	return decrypted.toString()
}

function getHash(key: string) {
	return createHash(HASH_ALGORITHM).update(key).digest(BASE_64_ENCODING).substr(0, 32)
}

function getSecretKey() {
	const key = process.env.SECRET_KEY

	if (!key) {
		throw new Error("Please provide the required secret key environment variable")
	}

	return key
}

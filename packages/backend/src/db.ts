import { connectWDB } from "db/src"

export const cDb = (input: {
	host: string
	username: string
	password: string
}) => {
	return connectWDB({ ...input, fetch })
}

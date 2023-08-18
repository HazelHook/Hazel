import { serial, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const generatePublicId = (prefix: "src" | "dst" | "con" | "itg" | "sk" | "org" | "mem" | "inv") => {
	return `${prefix}_${nanoid(21 - (prefix.length + 1))}`
}

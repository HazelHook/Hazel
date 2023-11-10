import { genId } from "@hazel/utils"

export type SchemaType = "src" | "dst" | "con" | "itg" | "sk" | "org" | "mem" | "inv"

export const generatePublicId = (prefix: SchemaType) => {
	return `${prefix}_${genId(21 - (prefix.length + 1))}`
}

import { customAlphabet } from "nanoid"

export * from "./logger"

export const genId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21)

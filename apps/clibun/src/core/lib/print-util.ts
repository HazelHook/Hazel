import { maxStringLength } from "./util.js"

export function prettyTimestamp(date: Date) {
	const hours = date.getHours().toString().padStart(2, "0")
	const minutes = date.getMinutes().toString().padStart(2, "0")
	const seconds = date.getSeconds().toString().padStart(2, "0")

	return `${hours}:${minutes}:${seconds}`
}

export function renderList(data: Record<string, string>) {
	const longest = maxStringLength(Object.keys(data)) + 1
	return Object.keys(data)
		.map((key) => `${key.padEnd(longest)}: ${data[key]}`)
		.join("\n")
}

import { clsx, type ClassValue } from "clsx"
import { sub } from "date-fns"
import { twMerge } from "tailwind-merge"
import colors from "tailwindcss/colors"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getSeededProfileImageUrl = (id: string) => {
	return `https://gradient-avatars-production.up.railway.app/${id}`
}

export const chartColors = [colors.purple[500], colors.teal[500], colors.amber[500], colors.sky[500]]

export function formatDateTime(date: Date) {
	return `${date.getUTCFullYear()}-${`0${date.getUTCMonth() + 1}`.slice(-2)}-${`0${date.getUTCDate()}`.slice(
		-2,
	)} ${`0${date.getUTCHours()}`.slice(-2)}:${`0${date.getUTCMinutes()}`.slice(-2)}:${`0${date.getUTCSeconds()}`.slice(
		-2,
	)}`
}

export function charToDuration(char: "h" | "d" | "m" | "y") {
	switch (char) {
		case "h":
			return "hours"
		case "d":
			return "days"
		case "m":
			return "months"
		case "y":
			return "years"
	}
}

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export function subtractFromString(date: Date, str: string) {
	const parsed = /^(\d+)([a-z]+)$/i.exec(str)

	if (!parsed) {
		return
	}

	const value = parseInt(parsed[1], 10)
	const unit = parsed[2].toLowerCase()

	const duration = {
		[charToDuration(unit as any)]: value,
	}

	return sub(date, duration)
}

export function jsonToArray(obj: {
	[key: string]: any
}): Array<{ title: string; description: any }> {
	const arr = []
	for (const key in obj) {
		// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (obj.hasOwnProperty(key)) {
			arr.push({ title: key, description: obj[key] })
		}
	}
	return arr
}

async function sleep(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export async function minDelay<T>(promise: Promise<T>, ms: number) {
	const [p] = await Promise.all([promise, sleep(ms)])

	return p
}

export const httpStatusCodes = [
	// 1xx Informational
	{ name: "Continue", code: 100 },
	{ name: "Switching Protocols", code: 101 },
	{ name: "Processing", code: 102 },
	{ name: "Early Hints", code: 103 },
	// 2xx Success
	{ name: "OK", code: 200 },
	{ name: "Created", code: 201 },
	{ name: "Accepted", code: 202 },
	{ name: "Non-Authoritative Information", code: 203 },
	{ name: "No Content", code: 204 },
	{ name: "Reset Content", code: 205 },
	{ name: "Partial Content", code: 206 },
	{ name: "Multi-Status", code: 207 },
	{ name: "Already Reported", code: 208 },
	{ name: "IM Used", code: 226 },
	// 3xx Redirection
	{ name: "Multiple Choices", code: 300 },
	{ name: "Moved Permanently", code: 301 },
	{ name: "Found", code: 302 },
	{ name: "See Other", code: 303 },
	{ name: "Not Modified", code: 304 },
	{ name: "Use Proxy", code: 305 },
	{ name: "Switch Proxy", code: 306 },
	{ name: "Temporary Redirect", code: 307 },
	{ name: "Permanent Redirect", code: 308 },
	// 4xx Client Error
	{ name: "Bad Request", code: 400 },
	{ name: "Unauthorized", code: 401 },
	{ name: "Payment Required", code: 402 },
	{ name: "Forbidden", code: 403 },
	{ name: "Not Found", code: 404 },
	{ name: "Method Not Allowed", code: 405 },
	{ name: "Not Acceptable", code: 406 },
	{ name: "Proxy Authentication Required", code: 407 },
	{ name: "Request Timeout", code: 408 },
	{ name: "Conflict", code: 409 },
	{ name: "Gone", code: 410 },
	{ name: "Length Required", code: 411 },
	{ name: "Precondition Failed", code: 412 },
	{ name: "Payload Too Large", code: 413 },
	{ name: "URI Too Long", code: 414 },
	{ name: "Unsupported Media Type", code: 415 },
	{ name: "Range Not Satisfiable", code: 416 },
	{ name: "Expectation Failed", code: 417 },
	{ name: "I'm a teapot", code: 418 },
	{ name: "Misdirected Request", code: 421 },
	{ name: "Unprocessable Entity", code: 422 },
	{ name: "Locked", code: 423 },
	{ name: "Failed Dependency", code: 424 },
	{ name: "Too Early", code: 425 },
	{ name: "Upgrade Required", code: 426 },
	{ name: "Precondition Required", code: 428 },
	{ name: "Too Many Requests", code: 429 },
	{ name: "Request Header Fields Too Large", code: 431 },
	{ name: "Unavailable For Legal Reasons", code: 451 },
	// 5xx Server Error
	{ name: "Internal Server Error", code: 500 },
	{ name: "Not Implemented", code: 501 },
	{ name: "Bad Gateway", code: 502 },
	{ name: "Service Unavailable", code: 503 },
	{ name: "Gateway Timeout", code: 504 },
	{ name: "HTTP Version Not Supported", code: 505 },
	{ name: "Variant Also Negotiates", code: 506 },
	{ name: "Insufficient Storage", code: 507 },
	{ name: "Loop Detected", code: 508 },
	{ name: "Not Extended", code: 510 },
	{ name: "Network Authentication Required", code: 511 },
]

export const getVariantForLatency = (latency: number): "success" | "warning" | "destructive" => {
	if (latency < 200) {
		return "success"
	}

	if (latency < 500) {
		return "warning"
	}

	return "destructive"
}

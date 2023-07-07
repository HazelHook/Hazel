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

export function jsonToArray(obj: { [key: string]: any }): Array<{ title: string; description: any }> {
	const arr = []
	for (const key in obj) {
		// rome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
		if (obj.hasOwnProperty(key)) {
			arr.push({ title: key, description: obj[key] })
		}
	}
	return arr
}

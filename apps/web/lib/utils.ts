import { type ClassValue, clsx } from "clsx"
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

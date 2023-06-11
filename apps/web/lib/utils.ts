import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import colors from "tailwindcss/colors"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getSeededProfileImageUrl = (id: string) => {
	return `https://gradient-avatars-production.up.railway.app/${id}`
}

export const chartColors = [colors.purple[500], colors.teal[500], colors.amber[500], colors.sky[500]]

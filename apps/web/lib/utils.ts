import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getSeededProfileImageUrl = (id: string) => {
	return `https://gradient-avatars-production.up.railway.app/${id}`
}

"use client"

import { Icons } from "@/components/icons"

import { Button } from "@hazel/ui/button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
	const { setTheme, theme } = useTheme()

	return (
		<Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			<Icons.Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Icons.Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}

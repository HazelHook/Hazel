"use client"

import { useRouter } from "next/navigation"

import { Button } from "./button"
import { SimpleTooltip } from "./tooltip"
import { IconRefresh } from "@tabler/icons-react"

export const ReloadButton = () => {
	const router = useRouter()
	return (
		<SimpleTooltip content="Refresh Data">
			<Button onClick={() => router.refresh()} className="aspect-square" variant="outline" size="icon">
				<IconRefresh className="w-5 h-5" />
			</Button>
		</SimpleTooltip>
	)
}

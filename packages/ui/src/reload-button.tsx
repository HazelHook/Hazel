"use client"

import { RefreshIcon } from "@hazel/icons"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { SimpleTooltip } from "./tooltip"

export const ReloadButton = () => {
	const router = useRouter()
	return (
		<SimpleTooltip content="Refresh Data">
			<Button onClick={() => router.refresh()} className="aspect-square" variant="outline" size="icon">
				<RefreshIcon className="w-5 h-5" />
			</Button>
		</SimpleTooltip>
	)
}

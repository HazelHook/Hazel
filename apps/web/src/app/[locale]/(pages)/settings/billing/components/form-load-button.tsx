"use client"

import { LoadingButton } from "@hazel/ui/loading-button"
import { IconFile } from "@tabler/icons-react"
import { useFormStatus } from "react-dom"

export const FormLoadButton = () => {
	const { pending } = useFormStatus()

	return (
		<LoadingButton loading={pending} variant="outline" type="submit">
			{!pending && <IconFile />}
		</LoadingButton>
	)
}

"use client"
import { FileDownloadIcon } from "@hazel/icons"
import { LoadingButton } from "@hazel/ui/loading-button"

// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom"

export const FormLoadButton = () => {
	const { pending } = useFormStatus()
	return (
		<LoadingButton loading={pending} variant="outline" type="submit">
			{!pending && <FileDownloadIcon />}
		</LoadingButton>
	)
}
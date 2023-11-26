"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAction } from "@hazel/server/actions/client"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@hazel/ui/alert-dialog"
import { Button } from "@hazel/ui/button"

import { unsubscribeAction } from "@/server/actions/billing"

interface CancelButtonProps {
	subscriptionId: string
	unsubscribeAction: typeof unsubscribeAction
}

export const CancelButton = ({ unsubscribeAction, subscriptionId }: CancelButtonProps) => {
	const router = useRouter()

	const { mutate, data, status } = useAction(unsubscribeAction)

	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (data) {
			setOpen(false)

			router.refresh()
		}
	}, [data, router])

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<Button
				onClick={() => {
					setOpen(true)
				}}
			>
				Cancel
			</Button>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel your plan</AlertDialogTitle>
					<AlertDialogDescription>Are you sure you want to cancel your plan?</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button variant="outline">Abort</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							loading={status === "loading"}
							onClick={() => mutate({ subscriptionId })}
							disabled={status === "loading"}
						>
							Cancel
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

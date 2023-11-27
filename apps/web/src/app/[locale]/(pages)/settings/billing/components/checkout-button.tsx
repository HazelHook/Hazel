"use client"

import { useRouter } from "next/navigation"

import { changeSubscribtionAction } from "@/server/actions/billing"

import { useAction } from "@hazel/server/actions/client"
import { Button } from "@hazel/ui/button"

interface CheckoutButtonProps {
	disabled?: boolean
	planId: string
	previousSubscriptionId: string
	subscribeAction: typeof changeSubscribtionAction
}

export const CheckoutButton = ({ planId, disabled, previousSubscriptionId, subscribeAction }: CheckoutButtonProps) => {
	const router = useRouter()
	const { mutate, status } = useAction(subscribeAction, {
		onSuccess: (data) => {
			if (data.url) {
				router.push(data.url)
			} else {
				router.refresh()
			}
		},
	})

	return (
		<Button
			loading={status === "loading"}
			onClick={() => {
				mutate({ plan: planId, previousSubscriptionId })
			}}
			disabled={disabled}
		>
			Checkout
		</Button>
	)
}

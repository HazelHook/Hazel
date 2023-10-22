"use client"

import { changeSubscribtionAction } from "@/server/actions/billing"
import { useAction } from "@hazel/server/actions/client"
import { Button } from "@hazel/ui/button"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
	disabled?: boolean
	planId: string
	previousSubscriptionId: string
	subscribeAction: typeof changeSubscribtionAction
}

export const CheckoutButton = ({ planId, disabled, previousSubscriptionId, subscribeAction }: CheckoutButtonProps) => {
	const router = useRouter()
	const { mutateAsync } = useAction(subscribeAction)

	return (
		<Button
			onClick={async () => {
				const data = await mutateAsync({ plan: planId, previousSubscriptionId })

				if (data.url) {
					router.push(data.url)
				} else {
					router.refresh()
				}
			}}
			disabled={disabled}
		>
			Checkout
		</Button>
	)
}

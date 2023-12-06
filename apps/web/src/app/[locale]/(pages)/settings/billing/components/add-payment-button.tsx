"use client"

import { useRouter } from "next/navigation"

import { createCheckoutAction } from "@/server/actions/stripe"

import { useAction } from "@hazel/server/actions/client"
import { Card } from "@hazel/ui/card"
import { IconPlus } from "@tabler/icons-react"

export interface AddPaymentButtonProps {
	stripeCustomerId: string
	createCheckoutAction: typeof createCheckoutAction
}

export const AddPaymentButton = ({ stripeCustomerId, createCheckoutAction }: AddPaymentButtonProps) => {
	const router = useRouter()

	const { mutate } = useAction(createCheckoutAction, {
		onSuccess: (data) => {
			if (data.url) {
				router.push(data.url)
			}
		},
	})

	return (
		<Card
			className="flex aspect-video h-[200px] w-full max-w-[340px] cursor-pointer items-center justify-center hover:bg-muted"
			onClick={() => {
				mutate({
					stripeCustomerId: stripeCustomerId,
					cancelUrl: `${window.location.origin}/settings/billing`,
					successUrl: `${window.location.origin}/settings/billing`,
				})
			}}
		>
			<IconPlus className="h-8 w-8" />
		</Card>
	)
}

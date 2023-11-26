"use client"


import { useRouter } from "next/navigation"
import { CheckTickCircleIcon, CrossCircleIcon } from "@hazel/icons"
import { useAction } from "@hazel/server/actions/client"
import { Button, buttonVariants } from "@hazel/ui/button"
import { Card } from "@hazel/ui/card"
import { Image } from "@hazel/ui/image"

import type { changeDefaultMethodAction, removePaymentMethodAction } from "@/server/actions/stripe"
import { cn } from "@/lib/utils"

import { ConfirmationDialog } from "./confirmation-dialog"

export interface CreditCardProps {
	methodId: string
	stripeCustomerId: string
	className?: string
	name: string
	brand: string
	last4Digits: string
	expiryDate: string
	country: string
	isDefault?: boolean
	changeDefaultMethodAction: typeof changeDefaultMethodAction
	removePaymentMethodAction: typeof removePaymentMethodAction
}

export const creditCardBackgrounds = [
	"bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600",
	"bg-gradient-to-r from-red-800 via-red-500 to-rose-500",
	"bg-gradient-to-l from-pink-600 via-blue-600 to-sky-300",
	"bg-gradient-to-br from-purple-600 via-red-300 to-green-400",
	"bg-gradient-to-tr from-yellow-800 via-yellow-500 to-pink-500",
	"bg-gradient-to-bl from-white via-teal-500 to-green-400",
	"bg-gradient-to-tr from-fuchsia-900 via-indigo-400 to-pink-900",
	"bg-gradient-to-tr from-stone-400 via-purple-800 to-emerald-300",
	"bg-gradient-to-bl from-pink-500 via-violet-600 to-gray-400",
]

export const CreditCard = ({
	name,
	brand,
	last4Digits,
	expiryDate,
	country,
	isDefault,
	className,
	methodId,
	stripeCustomerId,
	changeDefaultMethodAction,
	removePaymentMethodAction,
}: CreditCardProps) => {
	const router = useRouter()
	const changeDefaultMethodHandler = useAction(changeDefaultMethodAction, {
		onSuccess: (data) => {
			// router.refresh()
		},
	})
	const removePaymentHandler = useAction(removePaymentMethodAction, {
		onSuccess: () => {
			// router.refresh()
		},
	})

	const isLoading = changeDefaultMethodHandler.status === "loading" || removePaymentHandler.status === "loading"

	return (
		<Card
			className={cn(
				"group relative m-auto aspect-video h-[200px] w-full max-w-[340px] rounded-xl text-foreground shadow-2xl transition-transform",
				isDefault && "border-2 border-primary",
				creditCardBackgrounds[generateSeededRandom(0, creditCardBackgrounds.length - 1, methodId)],
				className,
			)}
		>
			<div className="absolute top-4 w-full px-6">
				<div className="flex justify-between">
					<div>
						<p className="font-light">Name</p>
						<p className="font-medium tracking-widest">{name}</p>
					</div>
					<Image layout="fixed" width={60} height={60} alt={brand} src={`/logos/${brand}.svg`} />
				</div>
				<div className="pt-1">
					<p className="font-light">Card Number</p>
					<p className="tracking-more-wider font-medium">**** **** **** {last4Digits}</p>
				</div>
				<div className="pr-6 pt-6">
					<div className="flex justify-between">
						<div className="">
							<p className="text-xs font-light">Country</p>
							<p className="text-sm font-medium tracking-wider">{country}</p>
						</div>
						<div className="">
							<p className="text-xs font-light">Expiry</p>
							<p className="text-sm font-medium tracking-wider">{expiryDate}</p>
						</div>

						<div className="">
							<p className="text-xs font-light">CVV</p>
							<p className="tracking-more-wider text-sm font-bold">···</p>
						</div>
					</div>
				</div>
			</div>
			{isDefault && (
				<div className="absolute bottom-2 right-2">
					<div
						className={buttonVariants({
							variant: "outline",
							className: "bg-card",
							size: "sm",
						})}
					>
						<CheckTickCircleIcon className="h-4 w-4 text-primary" />
					</div>
				</div>
			)}
			{!isDefault && (
				<div className="absolute bottom-2 left-2 mx-auto hidden group-hover:block">
					<Button
						variant="outline"
						className="bg-card"
						onClick={() => {
							changeDefaultMethodHandler.mutate({
								methodId,
								stripeCustomerId,
							})
						}}
						disabled={isLoading}
						loading={isLoading}
					>
						Set as default
					</Button>
				</div>
			)}
			{!isDefault && (
				<div className="absolute right-2 top-2 hidden group-hover:block">
					<ConfirmationDialog
						isLoading={removePaymentHandler.status === "loading"}
						title="You sure you want to remove this Card?"
						description="This will permanatly delete this payment method from your account"
						onSubmit={() => removePaymentHandler.mutate({ methodId })}
					>
						<Button variant="destructive" size="xs" disabled={isLoading} loading={isLoading}>
							<CrossCircleIcon className="h-4 w-4" />
						</Button>
					</ConfirmationDialog>
				</div>
			)}
		</Card>
	)
}

function hashString(str: string): number {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash += str.charCodeAt(i)
	}
	return hash
}

function xorshift(seed: number): number {
	let shited = seed
	shited ^= seed << 13
	shited ^= seed >> 17
	shited ^= seed << 5
	return shited < 0 ? ~shited + 1 : shited
}

function generateSeededRandom(min: number, max: number, seed: string): number {
	const seedNumber = hashString(seed)
	const random = xorshift(seedNumber)
	return min + (random % (max - min))
}

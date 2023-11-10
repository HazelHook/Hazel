"use client"

import { Organization, OrganizationMember } from "@hazel/db"
import { ColumnDef } from "@tanstack/react-table"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import Link from "next/link"
import { Button } from "@hazel/ui/button"
import { ThreeDotsVerticalIcon } from "@hazel/icons"

export const columns: Array<
	ColumnDef<
		Organization & {
			members: OrganizationMember[]
		}
	>
> = [
	{
		header: "ID",
		accessorKey: "id",
		id: "id",
		size: 10,
	},
	{
		header: "UUID",
		accessorKey: "publicId",
		id: "uuid",
		size: 200,
	},
	{
		header: "Name",
		accessorKey: "name",
		id: "name",
	},
	// {
	// 	header: "Subscription",
	// 	id: "subscription",
	// 	cell: ({ row }) => {
	// 		const priceId = row.original?.subscription?.data?.priceId

	// 		const plan = configuration.stripe.products.find((product) => {
	// 			return product.plans.some((plan) => plan.stripePriceId === priceId)
	// 		})

	// 		if (plan) {
	// 			const price = plan.plans.find((plan) => plan.stripePriceId === priceId)

	// 			if (!price) {
	// 				return "Unknown Price"
	// 			}

	// 			return `${plan.name} - ${price.name}`
	// 		}

	// 		return "-"
	// 	},
	// },
	// {
	// 	header: "Subscription Status",
	// 	id: "subscription-status",
	// 	cell: ({ row }) => {
	// 		const subscription = row.original?.subscription?.data

	// 		if (!subscription) {
	// 			return "-"
	// 		}

	// 		return <SubscriptionStatusBadge subscription={subscription} />
	// 	},
	// },
	// {
	// 	header: "Subscription Period",
	// 	id: "subscription-period",
	// 	cell: ({ row }) => {
	// 		const subscription = row.original?.subscription?.data

	// 		if (!subscription) {
	// 			return "-"
	// 		}

	// 		const canceled = subscription.cancelAtPeriodEnd
	// 		const date = subscription.periodEndsAt
	// 		const formattedDate = new Date(date).toLocaleDateString()

	// 		return canceled ? (
	// 			<span className={"text-orange-500"}>Stops on {formattedDate}</span>
	// 		) : (
	// 			<span className={"text-green-500"}>Renews on {formattedDate}</span>
	// 		)
	// 	},
	// },
	{
		header: "Members",
		id: "members",
		cell: ({ row }) => {
			const memberships = row.original.members.length
			const uid = row.original.publicId

			return (
				<Link
					data-cy={"organization-members-link"}
					href={`organizations/${uid}/members`}
					className={"hover:underline cursor-pointer"}
				>
					{memberships} member{memberships === 1 ? "" : "s"}
				</Link>
			)
		},
	},
	{
		header: "",
		id: "actions",
		cell: ({ row }) => {
			const organization = row.original
			const uid = organization.publicId

			return (
				<div className={"flex justify-end"}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost">
								<span className="sr-only">Open menu</span>
								<ThreeDotsVerticalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(uid)}>
								Copy UUID
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link href={`/admin/organizations/${uid}/members`}>View Members</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)
		},
	},
]

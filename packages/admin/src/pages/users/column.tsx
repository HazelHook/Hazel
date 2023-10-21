"use client"

import { User } from "@hazel/db/src/drizzle"
import { ThreeDotsVerticalIcon } from "@hazel/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@hazel/ui/avatar"
import { Button } from "@hazel/ui/button"
import { If } from "@hazel/ui/if"
import { Badge } from "@hazel/ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@hazel/ui/tooltip"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

type UserRow = {
	id: string
	email: string | undefined
	phone: string | undefined
	createdAt: string
	updatedAt: string | undefined
	lastSignInAt: string | undefined
	banDuration: string | undefined
	data: User
}

export const columns: Array<ColumnDef<UserRow>> = [
	{
		header: "",
		id: "avatar",
		size: 10,
		cell: ({ row }) => {
			const user = row.original
			const data = user.data
			const displayName = data?.name
			const photoUrl = data?.profileImage
			const displayText = displayName ?? user.email ?? user.phone ?? ""

			return (
				<Tooltip>
					<TooltipTrigger>
						<Avatar>
							{photoUrl ? <AvatarImage src={photoUrl} /> : null}
							<AvatarFallback>{displayText[0]}</AvatarFallback>
						</Avatar>
					</TooltipTrigger>

					<TooltipContent>{displayText}</TooltipContent>
				</Tooltip>
			)
		},
	},
	{
		header: "ID",
		id: "id",
		size: 30,
		cell: ({ row }) => {
			const id = row.original.id

			return (
				<Link className={"hover:underline"} href={`/admin/users/${id}`}>
					{id}
				</Link>
			)
		},
	},
	{
		header: "Email",
		id: "email",
		cell: ({ row }) => {
			const email = row.original.email

			return (
				<span title={email} className={"truncate max-w-full block"}>
					{email}
				</span>
			)
		},
	},
	{
		header: "Name",
		size: 50,
		id: "displayName",
		cell: ({ row }) => {
			return row.original.data?.name ?? ""
		},
	},
	{
		header: "Created at",
		id: "createdAt",
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt)

			return <span title={date.toLocaleString()}>{date.toLocaleDateString()}</span>
		},
	},
	{
		header: "Last sign in",
		id: "lastSignInAt",
		cell: ({ row }) => {
			const lastSignInAt = row.original.lastSignInAt

			if (!lastSignInAt) {
				return <span>-</span>
			}

			const date = new Date(lastSignInAt)
			return <span suppressHydrationWarning>{date.toLocaleString()}</span>
		},
	},
	{
		header: "Status",
		id: "status",
		cell: ({ row }) => {
			const banDuration = row.original.banDuration

			if (!banDuration || banDuration === "none") {
				return (
					<Badge className={"inline-flex"} color={"success"}>
						Active
					</Badge>
				)
			}

			return (
				<Badge className={"inline-flex"} color={"error"}>
					Banned
				</Badge>
			)
		},
	},
	{
		header: "",
		id: "actions",
		cell: ({ row }) => {
			const user = row.original
			const banDuration = row.original.banDuration
			const isBanned = banDuration && banDuration !== "none"

			return (
				<div className={"flex justify-end"}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								<span className="sr-only">Open menu</span>
								<ThreeDotsVerticalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
								Copy user ID
							</DropdownMenuItem>

							<If condition={!isBanned}>
								<DropdownMenuItem asChild>
									<Link href={`/admin/users/${user.id}/impersonate`}>Impersonate User</Link>
								</DropdownMenuItem>

								<DropdownMenuItem asChild>
									<Link
										className={"text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5"}
										href={`/admin/users/${user.id}/ban`}
									>
										Ban User
									</Link>
								</DropdownMenuItem>
							</If>

							<If condition={isBanned}>
								<DropdownMenuItem asChild>
									<Link href={`/admin/users/${user.id}/reactivate`}>Reactivate User</Link>
								</DropdownMenuItem>
							</If>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)
		},
	},
]

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Connection, Destination, Source } from "db/src/schema"
import { ArrowDown, ArrowUp, CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VerticalIcon } from "@/components/icons/pika/vertical"

interface Request {
	timestamp: string
	version: string
	request_id: string
	customer_id: string
	source_id: string
	body: string
	headers: string
}

export type Column = Request

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "request_id",
		header: "Request ID",
		cell: ({ cell, row }) => {
			const requestId = cell.getValue() as string

			return <div>{requestId}</div>
		},
	},

	{
		accessorKey: "timestamp",
		header: "Timestamp",
		cell: ({ cell }) => {
			const date = new Date(cell.getValue<string>())
			return <p>{cell.getValue<string>()}</p>
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const request = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<VerticalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.request_id)}>
							Copy request ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Resend (?)</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { TBResponse } from "db/src/tinybird/model/tiny-response"

import { Button, buttonVariants } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FilterVerticalIcon } from "@/components/icons/pika/filterVertical"

export type Column = TBResponse

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "id",
		header: "Request ID",
		cell: ({ cell }) => {
			const requestId = cell.getValue() as string

			return (
				<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/request/${requestId}`}>
					{requestId}
				</Link>
			)
		},
	},
	{
		accessorKey: "destination_id",
		header: "Destination ID",
		cell: ({ cell }) => {
			const destinationId = cell.getValue() as string

			return (
				<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/destination/${destinationId}`}>
					{destinationId}
				</Link>
			)
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
							<FilterVerticalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>View Request</DropdownMenuItem>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
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

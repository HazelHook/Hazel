"use client"

import Link from "next/link"
import { TBResponse } from "@hazel/db/src/tinybird/model/tiny-response"
import { FilterVerticalIcon } from "@hazel/icons"
import { Button, buttonVariants } from "@hazel/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"

export type Column = TBResponse

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "id",
		header: "Response ID",
		cell: ({ cell }) => {
			const responseId = cell.getValue() as string

			return (
				<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/response/${responseId}`}>
					{responseId}
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
				<Link
					className={buttonVariants({ variant: "link", size: "none" })}
					href={`/destination/${destinationId}`}
				>
					{destinationId}
				</Link>
			)
		},
	},

	{
		accessorKey: "response_at",
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
						<DropdownMenuItem onClick={() => (navigator as any).clipboard.writeText(request.id)}>
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

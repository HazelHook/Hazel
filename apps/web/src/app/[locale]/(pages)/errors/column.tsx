"use client"

import Link from "next/link"

import { TBResponse } from "@hazel/tinybird"
import { Button, buttonVariants } from "@hazel/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"

export type Column = TBResponse

const columnHelper = createColumnHelper<TBResponse>()

export const columns = [
	columnHelper.accessor("id", {
		header: "Response ID",
		cell: ({ cell }) => {
			const responseId = cell.getValue()

			return (
				<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/response/${responseId}`}>
					{responseId}
				</Link>
			)
		},
	}),
	columnHelper.accessor("destination_id", {
		header: "Destination ID",
		cell: ({ cell }) => {
			const destinationId = cell.getValue()

			return (
				<Link
					className={buttonVariants({ variant: "link", size: "none" })}
					href={`/destination/${destinationId}`}
				>
					{destinationId}
				</Link>
			)
		},
	}),

	columnHelper.accessor("response_at", {
		header: "Timestamp",
		cell: ({ cell }) => {
			const date = new Date(cell.getValue())
			return <p>{cell.getValue<string>()}</p>
		},
	}),

	columnHelper.display({
		id: "actions",
		cell: ({ row }) => {
			const request = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<IconDotsVertical className="h-4 w-4" />
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
	}),
] as ColumnDef<TBResponse>[]

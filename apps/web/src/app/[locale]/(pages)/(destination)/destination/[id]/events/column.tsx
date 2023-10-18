"use client"

import { Button } from "@hazel/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@hazel/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"

import { FilterVerticalIcon } from "@/components/icons/pika/filterVertical"
import { Status } from "@/components/Status"
import { EventDataRowType } from "@/app/[locale]/(pages)/(destination)/destination/[id]/events/page"

export const columns: ColumnDef<EventDataRowType>[] = [
	{
		accessorKey: "id",
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
			return <p>{cell.getValue<string>()}</p>
		},
	},
	{
		accessorKey: "success",
		header: () => <div className="text-center">Status</div>,
		cell: ({ cell }) => {
			const success = Boolean(cell.getValue() as number)

			return <Status status={success ? "success" : "error"} />
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

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
import { EventDataRowType } from "@/app/[locale]/(pages)/(source)/source/[id]/events/page"

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
			const date = new Date(cell.getValue<string>())
			return <p>{cell.getValue<string>()}</p>
		},
	},
	{
		accessorKey: "responses",
		header: () => <div className="text-center">Status</div>,
		cell: ({ cell, row }) => {
			const responses = cell.getValue() as EventDataRowType["responses"]
			const succeeded = responses.filter((r) => r.success)

			return (
				<div className="w-full justify-center flex p0">
					{succeeded.length === responses.length ? <Status status="success" /> : <Status status="error" />}
				</div>
			)
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

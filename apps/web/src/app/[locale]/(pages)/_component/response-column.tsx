"use client"

import Link from "next/link"
import { TBResponse } from "@hazel/tinybird"
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
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Status } from "@/components/status"
import { dashboardNumberFormatter, dataTableTimestampFormatter } from "@/lib/formatters"

export type Column = TBResponse

const columnHelper = createColumnHelper<TBResponse>()

export const responseColumns = [
	columnHelper.accessor("response_at", {
		header: "Timestamp",
		cell: ({ cell }) => {
			return <p>{dataTableTimestampFormatter().format(new Date(cell.getValue()))}</p>
		},
	}),
	columnHelper.accessor("id", {
		id: "response_id",
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

	columnHelper.accessor("success", {
		header: "Success",
		cell: ({ cell }) => {
			const success = Boolean(cell.getValue())

			return <Status status={success ? "success" : "error"} />
		},
	}),

	columnHelper.accessor("status", {
		header: "Status",
		cell: ({ cell }) => {
			return cell.getValue()
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
	}),
] as ColumnDef<TBResponse>[]
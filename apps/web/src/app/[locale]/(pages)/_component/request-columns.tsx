"use client"

import Link from "next/link"
import { TBRequest, TBResponse } from "@hazel/tinybird"
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
import { dataTableTimestampFormatter } from "@/lib/formatters"
import { Badge } from "@hazel/ui/badge"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import { cn } from "@/lib/utils"

type Column = TBRequest & {
	responses: TBResponse[]
}

const columnHelper = createColumnHelper<Column>()

export const requestColumns = [
	columnHelper.accessor("timestamp", {
		id: "timestamp",
		header: "Timestamp",
		cell: ({ cell }) => {
			const timestamp = cell.getValue()

			return dataTableTimestampFormatter().format(new Date(timestamp))
		},
	}),

	columnHelper.accessor("source_id", {
		header: "Source",
		cell: ({ cell }) => {
			const sourceId = cell.getValue()

			return (
				<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/source/${sourceId}`}>
					{sourceId}
				</Link>
			)
		},
	}),

	columnHelper.accessor("id", {
		id: "request_id",
		header: "ID",
		cell: ({ cell }) => {
			const requestId = cell.getValue()

			return (
				<Link className={buttonVariants({ variant: "link", size: "none" })} href={`/request/${requestId}`}>
					{requestId}
				</Link>
			)
		},
	}),
	columnHelper.accessor("rejected", {
		header: "Status",
		cell: ({ cell }) => {
			const rejected = cell.getValue() === 1
			const responses = cell.row.original.responses

			// TODO: REPLACE TOOLTIP WITH HOVER CARD
			if (responses.length > 0) {
				return (
					<div className="flex gap-0.5 w-[100px]">
						{responses.map((res) => (
							<SimpleTooltip key={res.id} content={res.status}>
								<div
									className={cn(
										"w-full h-6 rounded-md",
										res.success === 1 ? "bg-emerald-500" : "bg-red-500",
									)}
								/>
							</SimpleTooltip>
						))}
					</div>
				)
			}

			// TODO:GET THE STATUS FROM THE RESPONSE
			return (
				<Badge variant={rejected ? "destructive" : "outline"}>{rejected ? "Unauthorized" : "Delivering"}</Badge>
			)
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
] as ColumnDef<Column>[]

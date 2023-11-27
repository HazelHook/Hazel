"use client"

import Link from "next/link"

import { dataTableTimestampFormatter } from "@/lib/formatters"
import { Status } from "@/components/status"

import { Destination, Integration, Source } from "@hazel/db"
import { FilterVerticalIcon, LogInLeftIcon } from "@hazel/icons"
import { TBResponse } from "@hazel/tinybird"
import { Badge } from "@hazel/ui/badge"
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

export type Column = TBResponse

const columnHelper = createColumnHelper<Column>()

export const responseColumns = (
	sources: (Source & {
		integration: Integration | null
	})[],
	destinations: Destination[],
) =>
	[
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
					<Link
						className={buttonVariants({ variant: "link", size: "none" })}
						href={`/response/${responseId}`}
					>
						{responseId}
					</Link>
				)
			},
		}),
		columnHelper.accessor("source_id", {
			header: "Source",
			cell: ({ cell }) => {
				const sourceId = cell.getValue()

				const source = sources.find((dest) => dest.publicId === sourceId)

				if (!source) {
					return <Badge variant="destructive">Deleted</Badge>
				}

				return (
					<Link
						className={buttonVariants({ variant: "outline", size: "xs", className: "gap-2" })}
						href={`/source/${sourceId}`}
					>
						{source.integration ? (
							<img
								src={`/assets/integrations/${source.integration.tool}.svg`}
								alt={source.integration.tool}
								className="w-5 h-5"
							/>
						) : (
							<LogInLeftIcon className="w-5 h-5 text-muted-foreground" />
						)}
						{source.name}
					</Link>
				)
			},
		}),

		columnHelper.accessor("destination_id", {
			header: "Destination",
			cell: ({ cell }) => {
				const destinationId = cell.getValue()

				const dest = destinations.find((dest) => dest.publicId === destinationId)

				if (!dest) {
					return <Badge variant="destructive">Deleted</Badge>
				}

				return (
					<Link
						className={buttonVariants({ variant: "link", size: "none" })}
						href={`/destination/${destinationId}`}
					>
						{dest.name}
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
				const response = row.original

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
							<DropdownMenuItem asChild>
								<Link href={`/response/${response.id}`}>View Respone</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(response.id)}>
								Copy response ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation()
									console.log("Resend")
								}}
							>
								Resend (?)
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		}),
	] as ColumnDef<TBResponse>[]

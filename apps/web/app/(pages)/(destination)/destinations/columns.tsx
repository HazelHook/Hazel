"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Destination } from "db/src/drizzle/schema"
import { Connection } from "reactflow"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon } from "@/components/icons/pika/arrowDown"
import { ArrowUpIcon } from "@/components/icons/pika/arrowUp"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { EventDataRowType } from "@/app/(pages)/(destination)/destination/[id]/events/page"

export const columns: ColumnDef<EventDataRowType>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					{column.getIsSorted() === "asc" ? (
						<ArrowUpIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownIcon className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell, table, row }) => {
			const id = row.original.id
			return (
				<div className="flex flex-row items-center">
					<Avatar className="w-4 h-4 mr-2">
						<AvatarImage src={getSeededProfileImageUrl(id)} />
					</Avatar>
					{cell.getValue<string>()}
				</div>
			)
		},
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: "TODO:TYPE HERE",
	},
	{
		accessorKey: "group",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Group
					{column.getIsSorted() === "asc" ? (
						<ArrowUpIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownIcon className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell }) => {
			return <p>-</p>
		},
	},
	{
		accessorKey: "connections",
		header: "Status",
		cell: ({ cell }) => {
			const connections = cell.getValue() as (Connection & {
				destination: Destination
			})[]

			return (
				<Badge>
					<CheckTickIcon className="w-4 h-4 mr-2" />
					<p>{connections.length}</p>
				</Badge>
			)
		},
	},
]

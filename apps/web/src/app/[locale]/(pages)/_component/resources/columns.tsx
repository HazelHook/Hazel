"use client"

import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Connection, Destination, Source } from "db/src/drizzle/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { ArrowDownIcon } from "@/components/icons/pika/arrowDown"
import { ArrowUpIcon } from "@/components/icons/pika/arrowUp"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"

export type Column = Source & {
	connections: Connection[]
}

export const columns: ColumnDef<Column>[] = [
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
			const id = row.original.publicId
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
		accessorKey: "connections",
		header: "Destination",
		cell: ({ cell }) => {
			const connections = cell.getValue() as (Connection & {
				destination: Destination
			})[]

			return (
				<div className="flex flex-row gap-1">
					<div className="bg-secondary rounded-xl text-ellipsis w-fit min-w-[24px] h-6 flex justify-center items-center">
						<p>{connections.length}</p>
					</div>
					<div className="flex flex-row gap-1 flex-wrap">
						{connections.map((conn) => (
							<Badge variant="outline" key={`badge-${conn.publicId}`}>
								<Avatar className="w-3 h-3 mr-2">
									<AvatarImage src={getSeededProfileImageUrl(conn.publicId)} />
								</Avatar>
								{conn.destination.name}
							</Badge>
						))}
					</div>
				</div>
			)
		},
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

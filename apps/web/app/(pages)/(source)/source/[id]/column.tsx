"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Connection, Destination, Source } from "db/src/schema"
import { ArrowDown, ArrowUp, CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { getSeededProfileImageUrl } from "@/lib/utils"

export type Column = Connection & {
	destination: Destination | null
}

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Connection
					{column.getIsSorted() === "asc" ? (
						<ArrowUp className="ml-2 h-4 w-4" />
					) : (
						<ArrowDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell, row }) => {
			const destination = cell.getValue() as string

			const publicId = row.original.publicId

			return (
				<div className="flex flex-row items-center">
					<Avatar className="w-4 h-4 mr-2">
						<AvatarImage src={getSeededProfileImageUrl(publicId)} />
					</Avatar>
					{destination}
				</div>
			)
		},
	},
	{
		accessorKey: "destination",
		header: "Destination",
		cell: ({ cell }) => {
			const destination = cell.getValue() as Destination

			return (
				<div className="flex flex-row gap-1">
					<Link href={`/destination/${destination.publicId}`}>
						<Badge variant="secondary">
							<Avatar className="w-3 h-3 mr-2">
								<AvatarImage src={getSeededProfileImageUrl(destination.publicId)} />
							</Avatar>
							{destination.name}
						</Badge>
					</Link>
				</div>
			)
		},
	},

	{
		accessorKey: "publicId",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Group
					{column.getIsSorted() === "asc" ? (
						<ArrowUp className="ml-2 h-4 w-4" />
					) : (
						<ArrowDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell }) => {
			return <p>-</p>
		},
	},
	{
		accessorKey: "id",
		header: "Status",
		cell: ({ cell }) => {
			// const destination = cell.getValue<Destination>()

			return (
				<Badge>
					<CheckIcon className="w-4 h-4 mr-2" />
				</Badge>
			)
		},
	},
]

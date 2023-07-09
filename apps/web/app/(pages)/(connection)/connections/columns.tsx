"use client"

import Link from "next/link"
import { Avatar } from "@radix-ui/react-avatar"
import { ColumnDef } from "@tanstack/react-table"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownSquareIcon } from "@/components/icons/pika/arrowDownSquare"
import { ArrowUpSquareIcon } from "@/components/icons/pika/arrowUpSquare"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { Connection, Destination, Source } from "db/src/drizzle/schema"

export type Column = Connection & {
	source: Source | null
	destination: Destination | null
}

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					{column.getIsSorted() === "asc" ? (
						<ArrowUpSquareIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownSquareIcon className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
	},
	{
		accessorKey: "source",
		header: "Source",
		cell: ({ cell }) => {
			const source = cell.getValue() as Source

			return (
				<div className="flex flex-row gap-1">
					<Link href={`/source/${source.publicId}`}>
						<Badge variant="secondary">
							<Avatar className="w-3 h-3 mr-2">
								<AvatarImage src={getSeededProfileImageUrl(source.publicId)} />
							</Avatar>
							{source.name}
						</Badge>
					</Link>
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
		accessorKey: "group",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Group
					{column.getIsSorted() === "asc" ? (
						<ArrowUpSquareIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownSquareIcon className="ml-2 h-4 w-4" />
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
					<CheckTickIcon className="w-4 h-4 mr-2" />
				</Badge>
			)
		},
	},
]

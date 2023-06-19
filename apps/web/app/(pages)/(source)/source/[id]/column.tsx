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
import { Switch } from "@/components/ui/switch"

export type Column = Destination

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "publicId",
		header: "Destination",
		cell: ({ cell, row }) => {
			const publicId = cell.getValue() as string

			return (
				<div className="flex flex-row gap-1">
					<Link href={`/destination/${publicId}`}>
						<Badge variant="secondary">
							<Avatar className="w-3 h-3 mr-2">
								<AvatarImage src={getSeededProfileImageUrl(publicId)} />
							</Avatar>
							{row.original.name}
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
			return (
				<Badge>
					<CheckIcon className="w-4 h-4 mr-2" />
				</Badge>
			)
		},
	},
	{
		accessorKey: "id",
		header: "Enabled",
		cell: ({ cell }) => {
			return <Switch />
		},
	},
]

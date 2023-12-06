"use client"

import Link from "next/link"

import { getSeededProfileImageUrl } from "@/lib/utils"

import { Destination } from "@hazel/db/schema"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { Switch } from "@hazel/ui/switch"
import { ColumnDef } from "@tanstack/react-table"
import { IconArrowDown, IconArrowUp, IconCheck } from "@tabler/icons-react"

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
						<IconArrowUp className="ml-2 h-4 w-4" />
					) : (
						<IconArrowDown className="ml-2 h-4 w-4" />
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
					<IconCheck className="w-4 h-4 mr-2" />
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

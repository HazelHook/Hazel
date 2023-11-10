"use client"

import Link from "next/link"
import { Destination } from "@hazel/db/schema"
import { CheckTickIcon } from "@hazel/icons"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { Badge } from "@hazel/ui/badge"
import { ColumnDef } from "@tanstack/react-table"

import { getSeededProfileImageUrl } from "@/lib/utils"

export type Column = Destination

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "publicId",
		header: "Destination",
		cell: ({ cell, row }) => {
			const publicId = cell.getValue() as string

			return (
				<div className="flex flex-row gap-1 w-full">
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
		accessorKey: "id",
		header: "Status",
		cell: ({ cell }) => {
			return (
				<Badge>
					<CheckTickIcon className="w-4 h-4 mr-2" />
				</Badge>
			)
		},
	},
]

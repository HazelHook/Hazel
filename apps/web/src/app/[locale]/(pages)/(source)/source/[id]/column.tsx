"use client"

import Link from "next/link"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import { Destination } from "db/src/drizzle/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Badge } from "@hazel/ui/badge"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"

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

"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistance } from "date-fns"
import { RoleSelect } from "./_components/RoleSelect"
import { MemberOptions } from "./_components/MemberOptions"
import { OrganizationMember } from "db/src/drizzle/schema"
import { api } from "@/server/client"
import { Suspense, use, useEffect, useState } from "react"
import { User } from "@clerk/nextjs/dist/types/server"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { UserCell } from "./_components/UserCell"

export const columns: ColumnDef<OrganizationMember>[] = [
	{
		accessorKey: "customerId",
		id: "name",
		header: "Name",
		cell: ({ cell }) => {
			const userId = cell.getValue() as string
			return <UserCell userId={userId} />
		},
	},
	{
		accessorKey: "createdAt",
		header: () => <div>Joined</div>,
		cell: ({ row }) => {
			const formatted = formatDistance(row.getValue("createdAt"), new Date(), { addSuffix: true })

			return <div className="font-medium">{formatted}</div>
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row, table }) => {
			const members = table.getRowModel().rows.map((row) => row.original)
			return (
				<RoleSelect
					orgId={row.original.publicId}
					members={members}
					defaultValue={row.getValue("role")}
					memberId={row.original.customerId}
				/>
			)
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => {
			const members = table.getRowModel().rows.map((row) => row.original)

			return <MemberOptions members={members} orgId={row.original.publicId} memberId={row.original.customerId} />
		},
	},
]

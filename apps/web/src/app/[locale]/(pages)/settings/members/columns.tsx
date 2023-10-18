"use client"

import { User } from "@supabase/supabase-js"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistance } from "date-fns"
import { OrganizationMember } from "@hazel/db/src/drizzle/schema"

import { MemberOptions } from "./_components/MemberOptions"
import { RoleSelect } from "./_components/RoleSelect"
import { UserCell } from "./_components/UserCell"
import { AugmentedMember } from "./page"

export const columns: ColumnDef<AugmentedMember>[] = [
	{
		accessorKey: "user",
		id: "name",
		header: "Name",
		cell: ({ cell }) => {
			const user = cell.getValue() as User
			return <UserCell user={user} />
		},
	},
	{
		accessorKey: "createdAt",
		header: () => <div>Joined</div>,
		cell: ({ row }) => {
			const formatted = formatDistance(row.getValue("createdAt"), new Date(), {
				addSuffix: true,
			})

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
					memberId={row.original.userId}
				/>
			)
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => {
			const members = table.getRowModel().rows.map((row) => row.original)

			return <MemberOptions members={members} orgId={row.original.publicId} memberId={row.original.userId} />
		},
	},
]

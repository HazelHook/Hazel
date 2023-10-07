"use client"

import { ColumnDef } from "@tanstack/react-table"
import { InviteOptions } from "./_components/InviteOptions"
import { dateFormatter } from "@/lib/formatters"
import { OrganizationInvite } from "db/src/drizzle/schema"
import type { revokeOrganizationInvite } from "@/server/actions/organization-invite"

export const columns: (revokeAction: typeof revokeOrganizationInvite) => ColumnDef<OrganizationInvite>[] = (
	revokeAction,
) => [
	{
		accessorKey: "email",
		header: "User",
	},
	{
		accessorKey: "createdAt",
		header: "Invited",
		cell: ({ getValue }) => {
			const formatted = dateFormatter().format(getValue() as number)

			return <div className="font-medium">{formatted}</div>
		},
	},

	{
		accessorKey: "actions",
		cell: ({ row }) => {
			return (
				<InviteOptions revokeAction={revokeAction} emailAdress={row.original.email} inviteId={row.original.publicId} />
			)
		},
	},
]

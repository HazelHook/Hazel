"use client"

import { OrganizationInvite } from "db/src/drizzle/schema"
import { DataTable } from "../../members/data-table"
import { columns } from "../columns"
import type { createOrganizationInvite, revokeOrganizationInvite } from "@//server/actions/organization-invite"

export const TableWrapper = ({
	revokeAction,
	inviteAction,
	invites,
	orgId,
}: {
	revokeAction: typeof revokeOrganizationInvite
	inviteAction: typeof createOrganizationInvite
	invites: OrganizationInvite[]
	orgId: number
}) => {
	return <DataTable columns={columns(revokeAction)} orgId={orgId} createInviteAction={inviteAction} data={invites} />
}

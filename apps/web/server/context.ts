import getSupabaseServerActionClient from "@/core/supabase/action-client"
import db from "@/lib/db"
import requireSession from "@/lib/user/require-session"
import { TRPCError } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { cookies, headers } from "next/headers"

export async function createContext(opts?: FetchCreateContextFnOptions) {
	const newHeaders = new Map(headers())

	const client = getSupabaseServerActionClient()

	const session = await requireSession(client)

	const membershipId = cookies().get("membership_id")?.value

	// if (!membershipId) {
	// 	throw new TRPCError({ message: "User needs to have an Organization Selected", code: "BAD_REQUEST" })
	// }

	const membership = await db.organization.memberships.getOne({ membershipId: membershipId || "" })

	// if (!membership) {
	// 	throw new TRPCError({ message: "User needs to have an valid Organization selected", code: "BAD_REQUEST" })
	// }

	return {
		headers: Object.fromEntries(newHeaders),
		auth: {
			workspaceId: membership?.organization.publicId,
			customerid: session.user.id,
			user: session.user,
		},
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>

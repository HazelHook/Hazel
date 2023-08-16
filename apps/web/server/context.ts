import getSupabaseServerClient from "@/core/supabase/server-client"
import db from "@/lib/db"
import requireSession from "@/lib/user/require-session"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { headers } from "next/headers"

export async function createContext(opts?: FetchCreateContextFnOptions) {
	const newHeaders = new Map(headers())

	const client = getSupabaseServerClient()

	const session = await requireSession(client)

	const organization = await db.organization.getPersonal({ customerId: session.user.id })

	return {
		headers: Object.fromEntries(newHeaders),
		auth: {
			workspaceId: organization?.publicId,
			customerid: session.user.id,
			user: session.user,
		},
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>

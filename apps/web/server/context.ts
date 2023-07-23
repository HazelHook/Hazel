import db from "@/lib/db"
import { getAuth } from "@clerk/nextjs/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

export async function createContext(opts?: FetchCreateContextFnOptions) {
	const auth = getAuth(opts?.req! as any)
	const organization = await db.organization.getPersonal({ customerId: auth.userId || "" })

	return {
		auth: {
			workspaceId: organization?.publicId,
			customerid: auth.userId,
		},
		headers: opts && Object.fromEntries(opts.req.headers),
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>

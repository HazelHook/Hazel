import { headers } from "next/headers"
import { experimental_createServerActionHandler } from "@trpc/next/app-dir/server"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { Context } from "./context"
import db from "@/lib/db"
import requireSession from "@/lib/user/require-session"
import getSupabaseServerActionClient from "@/core/supabase/action-client"

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter(opts) {
		const { shape, error } = opts
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.code === "BAD_REQUEST" && error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		}
	},
})

export const createAction = experimental_createServerActionHandler(t, {
	async createContext() {
		const newHeaders = new Map(headers())

		// If you're using Node 18 before 18.15.0, omit the "connection" header
		newHeaders.delete("connection")

		const client = getSupabaseServerActionClient()

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
	},
})

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.auth.workspaceId || !ctx.auth.customerid) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	if (!ctx.auth.workspaceId) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	return next({
		ctx: {
			auth: {
				workspaceId: ctx.auth.workspaceId,
				customerId: ctx.auth.customerid,
				user: ctx.auth.user,
			},
		},
	})
})

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(isAuthed)

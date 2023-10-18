import { cookies, headers } from "next/headers"
import { experimental_createServerActionHandler } from "@trpc/next/app-dir/server"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import db from "@/lib/db"
import requireSession from "@/lib/user/require-session"

import { Context } from "./context"
import { getSupabaseServerActionClient } from "@hazel/supabase/clients"

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter(opts) {
		const { shape, error } = opts
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === "BAD_REQUEST" && error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		}
	},
})

export const createAction = experimental_createServerActionHandler(t, {
	async createContext() {
		const newHeaders = new Map(headers())

		const client = getSupabaseServerActionClient()

		const session = await requireSession(client)

		const membershipId = cookies().get("membership_id")?.value

		// if (!membershipId) {
		// 	throw new TRPCError({ message: "User needs to have an Organization Selected", code: "BAD_REQUEST" })
		// }

		const membership = await db.organization.memberships.getOne({
			membershipId: membershipId || "",
		})

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
	},
})

const isBaiscAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.auth.customerid) {
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

export const basicProtectedProcedure = t.procedure.use(isBaiscAuthed)
export const protectedProcedure = t.procedure.use(isAuthed)

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest, NextResponse } from "next/server"
import configuration from "./configuration"
import { isPublicRoute } from "./core/route-matcher"

import csrf from "edge-csrf"
import HttpStatusCode from "./core/generic/http-status-code.enum"
import { cookies } from "next/headers"
import db from "./lib/db"

const CSRF_TOKEN_HEADER = "X-CSRF-Token"
const CSRF_SECRET_COOKIE = "csrfSecret"
const CSRF_TOKEN_BODY_FIELD = "csrfToken"
const NEXT_ACTION_HEADER = "next-action"

const publicRoutes: string[] = ["/auth/*", "/api/webhook/:id"]

const csrfMiddleware = csrf({
	cookie: {
		secure: configuration.production,
		name: CSRF_SECRET_COOKIE,
	},
})

export default async function middleware(req: NextRequest) {
	// const res = await withCsrfMiddleware(req)

	return sessionMiddleware(req, NextResponse.next())
}

async function sessionMiddleware(req: NextRequest, res: NextResponse) {
	const supabase = createMiddlewareClient({ req, res })
	const { data } = await supabase.auth.getSession()

	if (data.session) {
		return res
	}

	if (!isPublicRoute(req.nextUrl.pathname, publicRoutes)) {
		const redirectUrl = req.nextUrl.clone()
		redirectUrl.pathname = configuration.paths.signIn
		redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
		return NextResponse.redirect(redirectUrl)
	}

	return res
}

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

async function withCsrfMiddleware(request: NextRequest) {
	const csrfResponse = NextResponse.next()

	// If the request is a Next action
	// we need to decorate the headers with the CSRF token passed in the body
	if (isNextAction(request)) {
		const decorated = await decorateHeadersWithCsrfToken(request)

		// If the request is not JSON, we can't correctly infer the CSRF token
		// so we return the response without the CSRF token
		// and let the action handle the CSRF check itself
		if (!decorated) {
			return csrfResponse
		}
	}

	const csrfError = await csrfMiddleware(request, csrfResponse)

	if (csrfError) {
		return NextResponse.json("Invalid CSRF token", {
			status: HttpStatusCode.Forbidden,
		})
	}

	const token = csrfResponse.headers.get(CSRF_TOKEN_HEADER)

	if (token) {
		const requestHeaders = new Headers(request.headers)
		requestHeaders.set(CSRF_TOKEN_HEADER, token)

		const response = NextResponse.next({
			request: { headers: requestHeaders },
		})

		const nextCsrfSecret = csrfResponse.cookies.get(CSRF_SECRET_COOKIE)?.value ?? ""

		if (nextCsrfSecret) {
			response.cookies.set(CSRF_SECRET_COOKIE, nextCsrfSecret)
		}

		return response
	}

	return csrfResponse
}

/**
 * Check if the request is a Next action
 * @param request
 */
function isNextAction(request: NextRequest) {
	const headers = new Headers(request.headers)

	return headers.has(NEXT_ACTION_HEADER)
}

/**
 * Decorate the headers with the CSRF token passed in the body
 * @param request
 */
async function decorateHeadersWithCsrfToken(request: NextRequest) {
	const { data, type } = await parsePayload(request)

	if (type === "json") {
		if (!Array.isArray(data) || data.length === 0) {
			return false
		}

		const csrfToken = data[0][CSRF_TOKEN_BODY_FIELD]

		if (csrfToken) {
			request.headers.set(CSRF_TOKEN_HEADER, csrfToken)
		}

		return true
	}

	return false
}

/**
 * @name parsePayload
 * @description Parse the payload of the request
 * @param request
 */
async function parsePayload(request: NextRequest) {
	const clone = request.clone()

	try {
		const type = "json"
		const data = await clone.json()

		return {
			type,
			data,
		}
	} catch (e) {
		return {
			type: undefined,
			data: null,
		}
	}
}

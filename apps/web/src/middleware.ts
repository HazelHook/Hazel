import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server"

import configuration from "@hazel/utils/configuration"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import createI18nMiddleware from "next-intl/middleware"

import { isPublicRoute } from "./core/generic/route-matcher"

const publicRoutes: string[] = [
	"/:locale/auth/*",
	"/auth/*",
	"/api/webhook/:id",
	"/api/webhook/sdk",
	"/api/webhook/test",
]

const I18nMiddleware = createI18nMiddleware({
	locales: ["en", "de"],
	defaultLocale: "en",
	localePrefix: "never",
})

const withI18n = (next: NextMiddleware) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		await next(request, _next)
		return I18nMiddleware(request)
	}
}

export default withI18n(async function middleware(req: NextRequest) {
	return sessionMiddleware(req, NextResponse.next())
})

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

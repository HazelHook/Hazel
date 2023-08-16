import { authMiddleware } from "@clerk/nextjs"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import configuration from "./configuration"
import { isPrivateRoute, isPublicRoute } from "./core/route-matcher"

const privateRoutes: string[] = []
const publicRoutes: string[] = ["/auth/*", "/api/webhook/:id"]

export default authMiddleware({
	publicRoutes: ["/api/webhook/:id"],
	async afterAuth(auth, req, evt) {
		const res = NextResponse.next()
		const supabase = createMiddlewareClient({ req, res })
		const { data } = await supabase.auth.getSession()

		if (data.session) {
			// if (data.session.user && !data.session.user.app_metadata.completed_onboarding) {
			// 	if (req.nextUrl.pathname !== configuration.paths.onboarding) {
			// 		const redirectUrl = req.nextUrl.clone()
			// 		redirectUrl.pathname = configuration.paths.onboarding
			// 		return NextResponse.redirect(redirectUrl)
			// 	}
			// }

			return res
		}

		console.log(isPublicRoute(req.nextUrl.pathname, publicRoutes))

		if (!isPublicRoute(req.nextUrl.pathname, publicRoutes)) {
			const redirectUrl = req.nextUrl.clone()
			redirectUrl.pathname = configuration.paths.signIn
			redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
			return NextResponse.redirect(redirectUrl)
		}

		return res
	},
})

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
// import { NextRequest, NextResponse } from "next/server"
// import configuration from "./configuration"
// import { isPublicRoute } from "./core/route-matcher"

// const publicRoutes: string[] = ["/auth/*", "/api/webhook/:id"]

// export async function middleware(req: NextRequest) {
// 	const res = NextResponse.next()
// 	const supabase = createMiddlewareClient({ req, res })
// 	const { data } = await supabase.auth.getSession()

// 	if (data.session) {
// 		// if (data.session.user && !data.session.user.app_metadata.completed_onboarding) {
// 		// 	if (req.nextUrl.pathname !== configuration.paths.onboarding) {
// 		// 		const redirectUrl = req.nextUrl.clone()
// 		// 		redirectUrl.pathname = configuration.paths.onboarding
// 		// 		return NextResponse.redirect(redirectUrl)
// 		// 	}
// 		// }

// 		return res
// 	}

// 	console.log(isPublicRoute(req.nextUrl.pathname, publicRoutes))

// 	if (!isPublicRoute(req.nextUrl.pathname, publicRoutes)) {
// 		const redirectUrl = req.nextUrl.clone()
// 		redirectUrl.pathname = configuration.paths.signIn
// 		redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
// 		return NextResponse.redirect(redirectUrl)
// 	}

// 	return res
// }

// export const config = {
// 	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// }

import { authMiddleware } from "@clerk/nextjs"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

export default authMiddleware({
	publicRoutes: ["/api/webhook/:id"],
	async afterAuth(auth, req, evt) {
		const res = NextResponse.next()
		const supabase = createMiddlewareClient({ req, res })
		const session = await supabase.auth.getSession()

		return res
	},
})

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

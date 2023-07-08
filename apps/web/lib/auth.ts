import { redirect } from "next/navigation"
import { auth as clerkAuth } from "@clerk/nextjs"

export const auth = () => {
	const res = clerkAuth()

	if (!res.userId) {
		redirect("/log-in")
	}

	return res
}

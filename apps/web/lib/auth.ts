import { auth as clerkAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export const auth = () => {
	const res = clerkAuth()

	if (!res.userId) {
		redirect("/log-in")
	}

	return res
}

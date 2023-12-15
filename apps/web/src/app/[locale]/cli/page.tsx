"use client"

import { getSupabaseBrowserClient } from "@hazel/supabase/clients/browser-client"
import { AuthError, Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const CliRedirect = () => {
	const [data, setData] = useState<{ session: Session | null; error: AuthError | null }>()
	const supabase = getSupabaseBrowserClient()

	const getSession = async () => {
		const { data, error } = await supabase.auth.refreshSession()

		if (data.session) {
			fetch("http://127.0.0.1:7878/json", {
				method: "POST",
				body: JSON.stringify(data.session),
				headers: {
					"Content-Type": "application/json",
				},
			})
		}

		setData({ session: data.session, error })
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getSession()
	}, [])

	if (!data) {
		return "Loading"
	}

	return <div>{JSON.stringify(data.session)}</div>
}

export default CliRedirect

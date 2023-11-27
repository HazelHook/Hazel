import { cookies } from "next/headers"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import invariant from "tiny-invariant"

import { Database } from "../database.types"

/**
 * @name createServerActionClient
 * @description Get a Supabase client for use in the Server Action Routes
 * @param params
 */
export function getSupabaseServerActionClient(
	params = {
		admin: false,
	},
) {
	const env = process.env

	invariant(env.NEXT_PUBLIC_SUPABASE_URL, "Supabase URL not provided")

	invariant(env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "Supabase Anon Key not provided")

	if (params.admin) {
		const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

		invariant(serviceRoleKey, "Supabase Service Role Key not provided")

		return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
			auth: {
				persistSession: false,
			},
		})
	}

	return createServerActionClient<Database>({ cookies })
}

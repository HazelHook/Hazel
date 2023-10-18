import type { NextApiRequest, NextApiResponse } from "next"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import invariant from "tiny-invariant"
import type { Database } from "@hazel/db/src/database.types"

/**
 * Get a Supabase client for use in the legacy API routes
 * @param req
 * @param res
 * @param params
 */
export function getSupabaseAPIClient(
	req: NextApiRequest,
	res: NextApiResponse,
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

	return createPagesServerClient<Database>(
		{ req, res },
		{
			supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
			supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		},
	)
}

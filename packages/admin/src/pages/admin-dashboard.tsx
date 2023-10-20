import AdminHeader from "../internal/components/admin-header"
import AdminGuard from "../internal/components/admin-guard"
import { getSupabaseServerClient } from "@hazel/supabase/clients"
import { Container } from "@hazel/ui/container"
import { lago } from "@hazel/utils/lago"
import AdminDashboard from "../internal/components/admin-dashboard"

export async function AdminDashboardPage() {
	const data = await loadData()

	return (
		<div className={"flex flex-col flex-1"}>
			<AdminHeader>Admin</AdminHeader>

			<Container>
				<AdminDashboard data={data} />
			</Container>
		</div>
	)
}

async function loadData() {
	// TODO: USE DRIZZLE AND NOT THIS SHIT
	const client = getSupabaseServerClient({ admin: true })

	const { count: usersCount, data } = await client.from("users").select("*", {
		count: "exact",
		head: true,
	})

	const { count: organizationsCount } = await client.from("organizations").select("*", {
		count: "exact",
		head: true,
	})

	const {
		data: { subscriptions },
	} = await lago.subscriptions.findAllSubscriptions({ per_page: 1000 })

	return {
		usersCount: usersCount || 0,
		organizationsCount: organizationsCount || 0,
		activeSubscriptions: subscriptions.length,
		trialSubscriptions: subscriptions.length,
	}
}

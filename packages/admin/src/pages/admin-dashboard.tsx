import AdminHeader from "../internal/components/admin-header"
import AdminGuard from "../internal/components/admin-guard"
import { getSupabaseServerClient } from "@hazel/supabase/clients"
import { Container } from "@hazel/ui/container"
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
	const client = getSupabaseServerClient({ admin: true })

	const { count: usersCount } = await client.from("users").select("*", {
		count: "exact",
		head: true,
	})

	const { count: organizationsCount } = await client.from("organizations").select("*", {
		count: "exact",
		head: true,
	})

	const { count: activeSubscriptions } = await client
		.from("subscriptions")
		.select("*", {
			count: "exact",
			head: true,
		})
		.eq("status", "active")

	const { count: trialSubscriptions } = await client
		.from("subscriptions")
		.select("*", {
			count: "exact",
			head: true,
		})
		.eq("status", "trialing")

	return {
		usersCount: usersCount || 0,
		organizationsCount: organizationsCount || 0,
		activeSubscriptions: activeSubscriptions || 0,
		trialSubscriptions: trialSubscriptions || 0,
	}
}

import { Container } from "@hazel/ui/container"
import { AdminHeader } from "../../internal/components/admin-header"
import { getPageFromQueryParams } from "../../internal/utils/get-page-from-query-params"
import { getSupabaseServerClient } from "@hazel/supabase/clients"
import { db } from "@hazel/db/src"
import { User } from "@hazel/db/src/drizzle"
import { DataTable } from "@hazel/ui/data-table"
import { columns } from "./column"

export interface UsersAdminPageProps {
	searchParams: {
		page?: string
	}
}

export async function UsersAdminPage({ searchParams }: UsersAdminPageProps) {
	const page = getPageFromQueryParams(searchParams.page)
	const perPage = 20
	const { users, total } = await loadUsers(page, perPage)
	const pageCount = Math.ceil(total / perPage)

	return (
		<div className={"flex flex-1 flex-col"}>
			<AdminHeader>Users</AdminHeader>

			<Container>
				<DataTable columns={columns} data={users} disableRedirect />
			</Container>
		</div>
	)
}

export default UsersAdminPage

async function loadAuthUsers(page = 1, perPage = 20) {
	const client = getSupabaseServerClient({ admin: true })

	const response = await client.auth.admin.listUsers({
		page,
		perPage,
	})

	if (response.error) {
		throw response.error
	}

	return response.data
}

async function loadUsers(page = 1, perPage = 20) {
	const { users: authUsers, total } = await loadAuthUsers(page, perPage)

	const ids = authUsers.map((user) => user.id)
	const usersData = await db.db.query.user.findMany({ where: (user, { inArray }) => inArray(user.id, ids) })

	const users = authUsers
		.map((user) => {
			const data = usersData.find((u) => u.id === user.id) as User
			const banDuration = "banned_until" in user ? (user.banned_until as string) : "none"

			return {
				id: user.id,
				email: user.email,
				phone: user.phone,
				createdAt: user.created_at,
				updatedAt: user.updated_at,
				lastSignInAt: user.last_sign_in_at,
				banDuration,
				data,
			}
		})
		.filter(Boolean)

	return {
		total,
		users,
	}
}

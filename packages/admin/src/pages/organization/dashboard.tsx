import { getSupabaseServerClient } from "@hazel/supabase/clients"
import { getPageFromQueryParams } from "../../internal/utils/get-page-from-query-params"
import { AdminHeader } from "../../internal/components/admin-header"
import { Container } from "@hazel/ui/container"
import { TextFieldInput } from "@hazel/ui/text-field"
import { SimpleDataTable } from "@hazel/ui/data-table"
import { columns } from "./column"
import { db } from "@hazel/db"

export interface OrganizationsAdminPageProps {
	searchParams: {
		page?: string
		search?: string
	}
}

export async function OrganizationsAdminPage({ searchParams }: OrganizationsAdminPageProps) {
	const page = getPageFromQueryParams(searchParams.page)
	const client = getSupabaseServerClient({ admin: true })
	const perPage = 20
	const search = searchParams.search || ""

	// const { organizations, count } = use(getOrganizations(client, search, page))
	// const pageCount = count ? Math.ceil(count / perPage) : 0

	const data = await db.db.query.organizations.findMany({ with: { members: true } })

	return (
		<div className={"flex flex-1 flex-col"}>
			<AdminHeader>Manage Organizations</AdminHeader>

			<Container>
				<div className={"flex flex-col space-y-4"}>
					<form method={"GET"}>
						<TextFieldInput name={"search"} defaultValue={search} placeholder={"Search Organization..."} />
					</form>
					<SimpleDataTable disableRedirect columns={columns} data={data} />
				</div>
			</Container>
		</div>
	)
}

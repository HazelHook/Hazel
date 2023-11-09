import { Container } from "@hazel/ui/container"
import { PageHeader } from "@hazel/ui/page-header"
import { ProjectPicker } from "./components/project-picker"
import { auth } from "@/lib/auth"

import tiny from "@/lib/tiny"
import db from "@/lib/db"
import { getTableParams } from "@/lib/data-table-helpers"
import { errorPageSearchParamsSchema } from "@/lib/validators/params"
import { DataTable } from "@hazel/ui/data-table"
import { columns } from "./column"
import { DatePicker } from "../_component/DatePicker"

type ErrorPageProps = {
	searchParams: any
}

const ErrorPage = async ({ searchParams }: ErrorPageProps) => {
	const { workspaceId } = await auth()

	const { dest, offset, limit } = getTableParams(searchParams, errorPageSearchParamsSchema)

	const resPromise = tiny.response.get({
		workspace_id: workspaceId,
		success: false,
		destination_id: dest,
		offset,
		limit,
	})

	const destPromise = db.destination.getMany({ workspaceId })

	const [responses, destinations] = await Promise.all([resPromise, destPromise])

	return (
		<Container>
			<PageHeader title="Errors" subtitle="Error things" />
			<div>
				<ProjectPicker
					data={destinations.map((dest) => ({ id: dest.publicId, name: dest.name }))}
					searchParamKey="dest"
				/>
				<DatePicker />
			</div>
			<DataTable
				data={responses.data}
				columns={columns}
				maxItems={responses.rows_before_limit_at_least || responses.rows || responses.data.length}
			/>
		</Container>
	)
}

export default ErrorPage

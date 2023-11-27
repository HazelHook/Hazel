import { auth } from "@/lib/auth"
import { getTableParams } from "@/lib/data-table-helpers"
import { errorPageSearchParamsSchema } from "@/lib/validators/params"

import { db } from "@hazel/db"
import tiny from "@hazel/tinybird"
import { Container } from "@hazel/ui/container"
import { AdvancedDataTable } from "@hazel/ui/data-table"
import { PageHeader } from "@hazel/ui/page-header"

import { DatePicker } from "../_component/date-picker"
import { columns } from "./column"
import { ProjectPicker } from "./components/project-picker"

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
					data={destinations.map((dest) => ({
						id: dest.publicId,
						name: dest.name,
					}))}
					searchParamKey="dest"
				/>
				<DatePicker />
			</div>
			<AdvancedDataTable
				data={responses.data}
				columns={columns}
				maxItems={responses.rows_before_limit_at_least || responses.rows || responses.data.length}
			/>
		</Container>
	)
}

export default ErrorPage

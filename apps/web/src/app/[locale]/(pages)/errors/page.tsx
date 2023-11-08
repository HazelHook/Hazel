import { Container } from "@hazel/ui/container"
import { PageHeader } from "@hazel/ui/page-header"
import { ProjectPicker } from "./components/project-picker"
import { auth } from "@/lib/auth"

import tiny from "@/lib/tiny"
import db from "@/lib/db"
import { getTableParams } from "@/lib/data-table-helpers"
import { errorPageSearchParamsSchema } from "@/lib/validators/params"

type ErrorPageProps = {
	searchParams: any
}

const ErrorPage = async ({ searchParams }: ErrorPageProps) => {
	const { workspaceId } = await auth()

	const { dest } = getTableParams(searchParams, errorPageSearchParamsSchema)

	const resPromise = tiny.response.get({ workspace_id: workspaceId, success: true, destination_id: dest })

	const destPromise = db.destination.getMany({ workspaceId })

	const [responses, destinations] = await Promise.all([resPromise, destPromise])

	return (
		<Container>
			<PageHeader title="Error" subtitle="Error things" />
			<div>
				<ProjectPicker
					data={destinations.map((dest) => ({ id: dest.publicId, name: dest.name }))}
					searchParamKey="dest"
				/>
			</div>
			<div className="flex flex-col gap-2">
				{responses.data.map((response) => (
					<div key={response.id}>{response.id}</div>
				))}
			</div>
		</Container>
	)
}

export default ErrorPage

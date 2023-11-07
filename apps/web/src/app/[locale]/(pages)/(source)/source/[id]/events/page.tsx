import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import tiny from "@/lib/tiny"
import { PromiseType } from "@/lib/ts/helpers"
import { TableWrapper } from "@/app/[locale]/(pages)/(source)/source/[id]/events/table"
import { getTableParams } from "@/lib/data-table-helpers"

interface EventsPageProps {
	params: {
		id: string
	}
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

async function fetchData({
	workspace_id,
	source_id,
	offset,
	limit,
}: {
	workspace_id: string
	source_id: string
	offset: number
	limit: number
}) {
	const [req, res] = await Promise.all([
		tiny.request.get({
			workspace_id,
			source_id,
			offset,
			limit,
		}),
		tiny.response.get({
			workspace_id,
			source_id,
			offset,
			limit,
		}),
	])

	const merged = req.data.map((d) => {
		const responses = res.data.filter((r) => r.request_id === d.id)
		return Object.assign(d, { responses })
	})

	return {
		data: merged,
		rows: req.rows,
		rows_before_limit_at_least: req.rows_before_limit_at_least,
	}
}

export type EventDataRowType = PromiseType<ReturnType<typeof fetchData>>["data"][number]

const EventsPage = async ({ params, searchParams }: EventsPageProps) => {
	const { workspaceId } = await auth()
	const source = await getCachedSource({ publicId: params.id })

	if (!source) {
		notFound()
	}

	const { offset, limit } = getTableParams(searchParams)

	const sources = await fetchData({
		workspace_id: workspaceId,
		source_id: params.id,
		offset,
		limit,
	})

	return (
		<div>
			<div className="w-full">
				<TableWrapper
					data={sources.data}
					maxItems={sources.rows_before_limit_at_least || sources.data.length}
					source={source}
				/>
			</div>
		</div>
	)
}

// export const runtime = "edge"

export default EventsPage

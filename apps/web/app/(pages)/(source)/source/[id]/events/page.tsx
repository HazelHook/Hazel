import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import tiny from "@/lib/tiny"
import { PromiseType } from "@/lib/ts/helpers"
import { TableWrapper } from "@/app/(pages)/(source)/source/[id]/events/table"

interface EventsPageProps {
	params: {
		id: string
	}
}

async function fetchData({
	customer_id,
	source_id,
}: {
	customer_id: string
	source_id: string
}) {
	const [req, res] = await Promise.all([
		tiny.requests.get({
			customer_id,
			source_id,
			limit: undefined,
			offset: undefined, // TODO
			request_id: undefined,
		}),
		tiny.responses.get({
			customer_id,
			source_id,
			destination_id: undefined, // TODO
			request_id: undefined,
			response_id: undefined,
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

const EventsPage = async ({ params }: EventsPageProps) => {
	const { userId } = auth()
	const source = await getCachedSource({ publicId: params.id })

	if (!source) {
		notFound()
	}

	const sources = await fetchData({
		customer_id: userId,
		source_id: params.id,
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

export default EventsPage

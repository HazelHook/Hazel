import { Tiny } from "db/src/tinybird"

import { auth } from "@/lib/auth"
import { getCachedConnection } from "@/lib/orm"
import { notFound } from "next/navigation"
import { DataTable } from "./data-table"
import { columns } from "./column"

interface EventsPageProps {
	params: {
		id: string
	}
}

const EventsPage = async ({ params }: EventsPageProps) => {
	const { userId } = auth()
	const tiny = Tiny(process.env.TINY_TOKEN as string)

	const connection = await getCachedConnection({ publicId: params.id })

	if (!connection) {
		notFound()
	}

	const { data, rows_before_limit_at_least } = await tiny.getRes({
		customer_id: userId,
		source_id: connection.source?.publicId,
		destionation_id: connection.destination?.publicId,
	})

	return (
		<div>
			<div className="w-full">
				<DataTable columns={columns} data={data} maxItems={rows_before_limit_at_least || data.length} />
			</div>
		</div>
	)
}

export default EventsPage

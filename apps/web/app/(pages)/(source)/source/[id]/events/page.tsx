import { Tiny } from "db/src/tinybird"

import { auth } from "@/lib/auth"

import { columns } from "./column"
import { DataTable } from "./data-table"

const EventsPage = async () => {
	const { userId } = auth()
	const tiny = Tiny(process.env.TINY_TOKEN as string)

	const reqs = await tiny.getReq({
		customer_id: userId,
	})

	return (
		<div>
			<div className="w-full">
				<DataTable columns={columns} data={reqs.data} maxItems={reqs.rows_before_limit_at_least || reqs.data.length} />
			</div>
		</div>
	)
}

export default EventsPage

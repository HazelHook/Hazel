import { auth } from "@/lib/auth"
import { Tiny } from "db/src/tinybird"
import { DataTable } from "./data-table"
import { columns } from "./column"

const EventsPage = async () => {
	const { userId } = auth()
	const tiny = Tiny(process.env.TINY_TOKEN as string)

	const reqs = await tiny.getReq({
		customer_id: userId,
	})

	console.log(reqs)

	return (
		<div>
			<div className="w-full">
				<DataTable columns={columns} data={reqs.data} maxItems={reqs.rows_before_limit_at_least || reqs.data.length} />
			</div>
		</div>
	)
}

export default EventsPage

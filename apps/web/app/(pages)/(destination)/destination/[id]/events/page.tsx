import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedDestination } from "@/lib/orm"
import tiny from "@/lib/tiny"
import { PromiseType } from "@/lib/ts/helpers"
import { TableWrapper } from "@/app/(pages)/(destination)/destination/[id]/events/table"

interface EventsPageProps {
	params: {
		id: string
	}
}

async function fetch({
	customer_id,
	destination_id,
}: {
	customer_id: string
	destination_id: string
}) {
	const destinations = await tiny.responses.get({
		customer_id,
		destination_id,
		request_id: undefined, // TODO
		response_id: undefined,
		source_id: undefined,
	})

	return destinations
}

export type EventDataRowType = PromiseType<ReturnType<typeof fetch>>["data"][number]

const EventsPage = async ({ params }: EventsPageProps) => {
	const { userId } = auth()
	const destination = await getCachedDestination({ publicId: params.id })

	if (!destination) {
		notFound()
	}

	const destinations = await fetch({
		customer_id: userId,
		destination_id: params.id,
	})

	return (
		<div>
			<div className="w-full">
				<TableWrapper
					data={destinations.data}
					maxItems={destinations.rows_before_limit_at_least || destinations.data.length}
					destination={destination}
				/>
			</div>
		</div>
	)
}

export default EventsPage

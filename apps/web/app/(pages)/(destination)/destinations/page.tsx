import Link from "next/link"
import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import { AddIcon } from "@/components/icons/pika/add"

import { PromiseType } from "@/lib/ts/helpers"
import { deleteDestinationAction, updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { DestinationTable } from "@/app/(pages)/(destination)/_components/DestinationTable"
import { Container } from "@/components/ui/container"

async function dataFetch({
	customerId,
}: {
	customerId: string
}) {
	const destinations = await db.destination.getMany({
		customerId,
	})

	return destinations
}

export type DestinationsDataRowType = PromiseType<ReturnType<typeof dataFetch>>[number]

const DestinationsPage = async () => {
	const { userId } = auth()

	const destinations = await dataFetch({
		customerId: userId,
	})

	if (!destinations) {
		notFound()
	}

	return (
		<Container>
			<div className="flex flex-row justify-between p-1">
				<h3 className="text-xl font-semibold">Destinations</h3>
				<Link href="/destination/new" className={buttonVariants()}>
					<AddIcon className="mr-2" />
					New Destination
				</Link>
			</div>
			<DestinationTable
				updateAction={updateDestinationAction}
				deleteAction={deleteDestinationAction}
				destination={destinations}
			/>
		</Container>
	)
}

export const runtime = "edge"

export default DestinationsPage

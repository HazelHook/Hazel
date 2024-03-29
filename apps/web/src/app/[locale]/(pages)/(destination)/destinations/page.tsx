import Link from "next/link"
import { notFound } from "next/navigation"

import { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"
import { auth } from "@/lib/auth"
import { PromiseType } from "@/lib/ts/helpers"
import { DestinationTable } from "@/app/[locale]/(pages)/(destination)/_components/DestinationTable"

import { db } from "@hazel/db"
import { buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { IconPlus } from "@tabler/icons-react"

async function dataFetch({ workspaceId }: { workspaceId: string }) {
	const destinations = await db.destination.getMany({
		workspaceId,
	})

	return destinations
}

export type DestinationsDataRowType = PromiseType<ReturnType<typeof dataFetch>>[number]

const DestinationsPage = async () => {
	const { workspaceId } = await auth()

	const destinations = await dataFetch({
		workspaceId,
	})

	if (!destinations) {
		notFound()
	}

	return (
		<Container>
			<div className="flex flex-row justify-between p-1">
				<h3 className="text-xl font-semibold">Destinations</h3>
				<Link href="/destination/new" className={buttonVariants()}>
					<IconPlus className="mr-2" />
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

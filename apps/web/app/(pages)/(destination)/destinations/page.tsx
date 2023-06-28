import Link from "next/link"
import { getDestinations } from "db/src/orm/destination"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

import { columns } from "./columns"
import { AddIcon } from "@/components/icons/pika/add"

const DestinationsPage = async () => {
	const { userId } = auth()

	const destinations = await getDestinations({
		customerId: userId,
		db: db,
	})

	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<h3 className="text-xl font-semibold">Destinations</h3>
				<Link href="/destination/new" className={buttonVariants()}>
					<AddIcon className="mr-2" />
					New Destination
				</Link>
			</div>
			<DataTable rootPath="/destination" columns={columns} data={destinations} />
		</main>
	)
}

export const runtime = "edge"

export default DestinationsPage

import Link from "next/link"
import { getDestinations } from "db/src/orm/destination"
import { getSources } from "db/src/orm/source"
import { PlusIcon } from "lucide-react"

import { appConfig } from "@/lib/config"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"

import { columns } from "./columns"
import { DataTable } from "./data-table"

const DestinationsPage = async () => {
	const destinations = await getDestinations({
		customerId: appConfig.devUser,
		db: db,
	})

	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<h3 className="text-xl font-semibold">Destinations</h3>
				<Link href="/destination/new" className={buttonVariants()}>
					<PlusIcon className="mr-2" />
					New Destination
				</Link>
			</div>
			<DataTable columns={columns} data={destinations} />
		</main>
	)
}

export default DestinationsPage

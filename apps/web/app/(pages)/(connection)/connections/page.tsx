import { getConnections } from "db/src/orm/connection"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

const ConnectionsPage = async () => {
	const { userId } = auth()
	const connections = await getConnections({
		customerId: userId,
		db,
	})

	return (
		<main className="p-4">
			<div className="flex flex-row justify-between mb-4">
				<h3 className="text-xl font-semibold">Connections</h3>
				<Link href="/connection/new" className={buttonVariants()}>
					<PlusIcon className="mr-2" />
					New Connection
				</Link>
			</div>
			<DataTable rootPath="/connection" columns={columns} data={connections} />
		</main>
	)
}

export const runtime = "edge"

export default ConnectionsPage

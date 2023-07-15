import Link from "next/link"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { DataTable } from "@/components/ui/data-table"
import { AddIcon } from "@/components/icons/pika/add"

import { columns } from "./columns"

const ConnectionsPage = async () => {
	const { userId } = auth()
	const connections = await db.connection.getMany({
		customerId: userId,
	})

	return (
		<Container>
			<div className="flex flex-row justify-between p-1">
				<h3 className="text-xl font-semibold">Connections</h3>
				<Link href="/connection/new" className={buttonVariants()}>
					<AddIcon className="mr-2" />
					New Connection
				</Link>
			</div>
			<DataTable rootPath="/connection" columns={columns} data={connections} />
		</Container>
	)
}

export const runtime = "edge"

export default ConnectionsPage

import Link from "next/link"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { AddIcon } from "@/components/icons/pika/add"

import { PromiseType } from "@/lib/ts/helpers"
import { deleteConnectionAction, updateConnectionAction } from "@/app/(pages)/(connection)/_actions"
import { ConnectionTable } from "@/app/(pages)/(connection)/_components/ConnectionTable"

const fetchData = async ({ customerId }: { customerId: string }) => {
	return await db.connection.getMany({
		customerId,
	})
}

export type ConnectionDataRowType = PromiseType<ReturnType<typeof fetchData>>[number]

const ConnectionsPage = async () => {
	const { userId } = auth()

	const connections = await fetchData({
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
			<ConnectionTable deleteAction={deleteConnectionAction} updateAction={updateConnectionAction} data={connections} />
		</Container>
	)
}

export const runtime = "edge"

export default ConnectionsPage

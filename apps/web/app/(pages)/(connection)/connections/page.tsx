import Link from "next/link"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { PromiseType } from "@/lib/ts/helpers"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { AddIcon } from "@/components/icons/pika/add"
import { deleteConnectionAction, pauseConnectionAction, updateConnectionAction } from "@/server/actions/connections"
import { ConnectionTable } from "@/app/(pages)/(connection)/_components/ConnectionTable"

const fetchData = async ({ workspaceId }: { workspaceId: string }) => {
	return await db.connection.getMany({
		workspaceId,
	})
}

export type ConnectionDataRowType = PromiseType<ReturnType<typeof fetchData>>[number]

const ConnectionsPage = async () => {
	const { workspaceId } = await auth()

	const connections = await fetchData({
		workspaceId,
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
			<ConnectionTable deleteAction={deleteConnectionAction} pauseAction={pauseConnectionAction} data={connections} />
		</Container>
	)
}

// export const runtime = "edge"

export default ConnectionsPage

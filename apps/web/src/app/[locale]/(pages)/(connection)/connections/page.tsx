import Link from "next/link"

import { deleteConnectionAction, pauseConnectionAction } from "@/server/actions/connections"
import { auth } from "@/lib/auth"
import { PromiseType } from "@/lib/ts/helpers"
import { ConnectionTable } from "@/app/[locale]/(pages)/(connection)/_components/connection-table"

import { db } from "@hazel/db"
import { buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { IconPlus } from "@tabler/icons-react"

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
					<IconPlus className="mr-2" />
					New Connection
				</Link>
			</div>
			<ConnectionTable
				deleteAction={deleteConnectionAction}
				pauseAction={pauseConnectionAction}
				data={connections}
			/>
		</Container>
	)
}

export const runtime = "edge"

export default ConnectionsPage

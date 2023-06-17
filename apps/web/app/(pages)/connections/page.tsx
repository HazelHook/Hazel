import { getConnections } from "db/src/orm/connection"

import { appConfig } from "@/lib/config"
import db from "@/lib/db"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"

const ConnectionsPage = async () => {
	const { userId } = auth()
	const connections = await getConnections({
		customerId: userId,
		db,
	})

	return (
		<main className="container py-6">
			{connections.map((conn) => (
				<div className="space-y-2 max-w-2xl">
					<h3 className="text-lg font-semibold">{conn.name}</h3>
					<div className="flex flex-row group">
						<Card className="max-w-xs w-full group-hover:border-primary">
							<CardHeader>
								<CardTitle>{conn.source?.name}</CardTitle>
							</CardHeader>
						</Card>
						<div className="w-full flex justify-center items-center ">
							<div className="bg-[length:200%_100%] w-full h-[1px] bg-border group-hover:bg-primary bg-gradient-to-r from-border to-slate-300 delay-700 animate-run" />
						</div>
						<Card className="max-w-xs w-full group-hover:border-primary">
							<CardHeader>
								<CardTitle>{conn.destination?.name}</CardTitle>
							</CardHeader>
						</Card>
					</div>
				</div>
			))}
		</main>
	)
}

export const runtime = "edge"

export default ConnectionsPage

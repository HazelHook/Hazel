import db from "@/lib/db"

import { Flow } from "./_components/Flow"
import { getConnections } from "db/src/orm/connection"

const ConnectionsOverview = async () => {
	const connections = await getConnections({
		customerId: "cus_8NiWC2t_SZVKALuy",
		db,
	})
	return (
		<div className="h-full">
			<Flow connections={connections} />
		</div>
	)
}

export default ConnectionsOverview

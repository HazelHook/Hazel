import { getFullProjects } from "db/src/orm/project"

import db from "@/lib/db"

import { Flow } from "./_components/Flow"

const ConnectionsOverview = async () => {
	const projects = await getFullProjects({
		customerId: "cus_8NiWC2t_SZVKALuy",
		db,
	})
	return (
		<div className="h-full">
			{/* rome-ignore lint/suspicious/noExplicitAny: <explanation> */}
			<Flow projects={projects as any} />
		</div>
	)
}

export default ConnectionsOverview

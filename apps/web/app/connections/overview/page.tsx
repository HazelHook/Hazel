import { getFullProjects } from "db/src/orm/project"
import { Flow } from "./_components/Flow"
import db from "@/lib/db"

const ConnectionsOverview = async () => {
	const projects = await getFullProjects({ customerId: "cus_8NiWC2t_SZVKALuy", db })
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	return <Flow projects={projects as any} />
}

export default ConnectionsOverview

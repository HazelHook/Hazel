import { IntegrationToolCard } from "@/app/(pages)/(integration)/_components/IntegrationToolCard"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { INTEGRATIONS } from "db/src/drizzle/integrations/data"
import { IntegrationsTable } from "@/app/(pages)/(integration)/_components/IntegrationTable"
import { PromiseType } from "@/lib/ts/helpers"
import { deleteIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"

export type IntegrationToolColumn = PromiseType<ReturnType<typeof db.integration.getMany>>[number]

const IntegrationsPage = async () => {
	const { userId } = auth()
	const integrations = await db.integration.getMany({
		customerId: userId,
	})

	return (
		<main className="p-4">
			<div className="flex flex-col justify-between mb-4 gap-4 container p-8">
				<h2 className="text-xl font-semibold">Active Integrations</h2>
				<IntegrationsTable integrations={integrations} deleteAction={deleteIntegrationAction} />
				<h2 className="text-xl font-semibold">Integrations</h2>
				<div className="grid grid-flow-row-dense md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{Object.values(INTEGRATIONS).map((item, index) => (
						<IntegrationToolCard key={index} integration={item} />
					))}
				</div>
			</div>
		</main>
	)
}

export const runtime = "edge"

export default IntegrationsPage

import { INTEGRATIONS, IntegrationTools, createZodIntegrationSchema } from "@hazel/integrations/web"

import { deleteIntegrationAction, updateIntegrationAction } from "@/server/actions/integrations"
import { auth } from "@/lib/auth"
import { db } from "@hazel/db"
import { PromiseType } from "@/lib/ts/helpers"
import { IntegrationsTable } from "@/app/[locale]/(pages)/(integration)/_components/IntegrationTable"
import { IntegrationToolCard } from "@/app/[locale]/(pages)/(integration)/_components/IntegrationToolCard"

export type IntegrationToolColumn = PromiseType<ReturnType<typeof db.integration.getMany>>[number]

const IntegrationsPage = async () => {
	const { workspaceId } = await auth()

	const integrations = await db.integration.getMany({
		workspaceId: workspaceId,
	})

	return (
		<main className="p-4">
			<div className="flex flex-col justify-between mb-4 gap-4 container p-8">
				<h2 className="text-xl font-semibold">Active Integrations</h2>
				<IntegrationsTable
					integrations={integrations}
					updateAction={updateIntegrationAction}
					deleteAction={deleteIntegrationAction}
				/>
				<h2 className="text-xl font-semibold">Integrations</h2>
				<div className="grid grid-flow-row-dense md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{Object.keys(INTEGRATIONS).map((key, index) => (
						<IntegrationToolCard key={index} integrationKey={key as IntegrationTools} />
					))}
				</div>
			</div>
		</main>
	)
}

// export const runtime = "edge"

export default IntegrationsPage

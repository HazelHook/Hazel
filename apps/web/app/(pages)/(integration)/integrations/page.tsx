"use client"
import { INTEGRATIONS } from "@/app/(pages)/(integration)/integrations/data"
import { IntegrationCard } from "@/app/(pages)/_component/IntegrationCard"

const IntegrationsPage = async () => {
	return (
		<main className="p-4">
			<div className="flex flex-col justify-between mb-4 gap-3 container p-8 space-y-4">
				<h3 className="text-xl font-semibold">Integrations</h3>
				<div className="grid grid-flow-row-dense md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{Object.values(INTEGRATIONS).map((item, index) => (
						<IntegrationCard
							key={index}
							{...item}
						/>
					))}
				</div>
			</div>
		</main>
	)
}

export const runtime = "edge"

export default IntegrationsPage

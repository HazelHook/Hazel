import { IntegrationCard } from "@/app/(pages)/(integration)/_components/IntegrationCard"
import { INTEGRATIONS, INTEGRATION_CATERGORIES, INTEGRATION_FEATURES } from "@/app/(pages)/(integration)/_statics"

export interface IntegrationCategoryData {
	name: string
	slug: string
}

export type IntegrationCategory = keyof typeof INTEGRATION_CATERGORIES

export interface IntegrationFeatureData {
	name: string
	slug: string
	icon: React.FC
}

export type IntegrationFeature = keyof typeof INTEGRATION_FEATURES

export interface Integration {
	name: string
	slug: string
	subtitle?: string
	categories: IntegrationCategory[]
	features?: IntegrationFeature[]
}

const IntegrationsPage = async () => {
	return (
		<main className="p-4">
			<div className="flex flex-col justify-between mb-4 gap-3 container p-8 space-y-4">
				<h3 className="text-xl font-semibold">Integrations</h3>
				<div className="grid grid-flow-row-dense md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{INTEGRATIONS.map((item, index) => (
						<IntegrationCard key={index} {...item} />
					))}
				</div>
			</div>
		</main>
	)
}

export const runtime = "edge"

export default IntegrationsPage

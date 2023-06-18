import { getCachedConnection } from "@/lib/orm"
import { Flow } from "../_components/Flow"
import { Card } from "@/components/ui/card"
import { FlowProvider } from "../_components/Provider"

const AdvancedPage = async ({ params }: { params: { id: string } }) => {
	const connection = await getCachedConnection({ publicId: params.id })
	return (
		<main className="h-full">
			<Card className="h-full overflow-hidden">
				<FlowProvider>
					<Flow connection={connection} />
				</FlowProvider>
			</Card>
		</main>
	)
}

export default AdvancedPage

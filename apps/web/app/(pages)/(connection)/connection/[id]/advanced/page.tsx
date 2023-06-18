import { getCachedConnection } from "@/lib/orm"
import { Flow } from "../_components/Flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlowProvider } from "../_components/Provider"
import { Nodebar } from "../_components/NodeBar"

const AdvancedPage = async ({ params }: { params: { id: string } }) => {
	const connection = await getCachedConnection({ publicId: params.id })
	return (
		<main className="h-full w-full">
			<FlowProvider>
				<div className="flex flex-row gap-2 w-full h-full">
					<Card className="h-full w-full overflow-hidden">
						<Flow connection={connection} />
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Custom Nodes</CardTitle>
						</CardHeader>
						<CardContent>
							<Nodebar />
						</CardContent>
					</Card>
				</div>
			</FlowProvider>
		</main>
	)
}

export default AdvancedPage

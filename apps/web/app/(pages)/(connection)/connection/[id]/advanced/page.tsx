import { getCachedConnection } from "@/lib/orm"
import { Flow, FullConnection } from "../_components/Flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlowProvider } from "../_components/Provider"
import { Nodebar } from "../_components/NodeBar"

import type { Edge, Node } from "reactflow"

const transformProjectsToFlowElements = (connection: FullConnection): { nodes: Node[]; edges: Edge[] } => {
	const nodes: Node[] = []
	const edges: Edge[] = []

	const position = { x: 0, y: 0 }

	// Add connection as node
	// nodes.push({
	// 	id: connection.publicId,
	// 	type: "group",
	// 	data: { label: connection.name },
	// 	position: position,
	// 	className: "w-[1000px]",
	// 	style: {
	// 		height: 500 + 100,
	// 	},
	// })

	if (connection.source) {
		if (!nodes.find((node) => node.id === connection.source?.publicId)) {
			nodes.push({
				id: connection.source.publicId,
				type: "source",
				data: {
					stats: {
						day: 12012,
						month: 100000000,
					},
					source: connection.source,
					url: `https://api.hazelhook.dev/webhook/${connection.source.publicId}`,
				},
				position,
				draggable: false,
			})
		}
	}

	// If there's a destination, add it as a node and connect it to the connection

	if (connection.destination) {
		if (!nodes.find((node) => node.id === connection.destination?.publicId)) {
			nodes.push({
				id: connection.destination.publicId,
				type: "destination",
				data: {
					stats: {
						day: 12012,
						month: 100000000,
					},
					destination: connection.destination,
				},
				position,
				draggable: false,
			})
		}
	}

	if (connection.destination && connection.source) {
		edges.push({
			id: `src-${connection.source.publicId}-d${connection.destination.publicId}`,
			source: connection.source.publicId,
			target: connection.destination.publicId,
			type: "button",
			animated: false,
			deletable: false,
		})
	}

	return { nodes, edges }
}

const AdvancedPage = async ({ params }: { params: { id: string } }) => {
	const connection = await getCachedConnection({ publicId: params.id })

	const { nodes, edges } = transformProjectsToFlowElements(connection)

	return (
		<main className="h-full max-h-[80%]">
			<FlowProvider>
				<div className="flex flex-row gap-2 w-full h-full">
					<Card className="h-full w-full overflow-hidden">
						<Flow initalNodes={nodes} initalEdges={edges} />
					</Card>
					{/* <Card>
						<CardHeader>
							<CardTitle>Custom Nodes</CardTitle>
						</CardHeader>
						<CardContent>
							<Nodebar />
						</CardContent>
					</Card> */}
				</div>
			</FlowProvider>
		</main>
	)
}

export default AdvancedPage

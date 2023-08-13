import type { Edge, Node } from "reactflow"

import { getCachedConnection } from "@/lib/orm"
import { Card } from "@/components/ui/card"

import { Flow, FullConnection } from "../_components/Flow"
import { FlowProvider } from "../_components/Provider"

const transformProjectsToFlowElements = (connection: FullConnection): { nodes: Node[]; edges: Edge[] } => {
	const nodes: Node[] = []
	const edges: Edge[] = []

	const position = { x: 0, y: 0 }

	// Add connection as node
	nodes.push({
		id: connection.publicId,
		type: "connection",
		data: { label: connection.name },
		position: position,
	})

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
				parentNode: connection.publicId,
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
				parentNode: connection.publicId,
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
			zIndex: 49,
		})
	}

	return { nodes, edges }
}

const AdvancedPage = async ({ params }: { params: { id: string } }) => {
	const connection = await getCachedConnection({ publicId: params.id })

	const { nodes, edges } = transformProjectsToFlowElements(connection)

	return (
		<main className="relative h-full max-h-[80%] w-full">
			<FlowProvider>
				<div className="flex flex-row gap-2 w-full h-full">
					<Card className="w-full overflow-hidden">
						<Flow initalNodes={nodes} initalEdges={edges} />
					</Card>
				</div>
			</FlowProvider>
		</main>
	)
}

// export const runtime = "edge"

export default AdvancedPage

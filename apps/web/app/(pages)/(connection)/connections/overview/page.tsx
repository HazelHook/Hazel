import { Edge, Node } from "reactflow"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { Card } from "@/components/ui/card"

import { Flow, FullConnection } from "../../connection/[id]/_components/Flow"
import { FlowProvider } from "../../connection/[id]/_components/Provider"

const transformProjectsToFlowElements = (connections: FullConnection[]): { nodes: Node[]; edges: Edge[] } => {
	const nodes: Node[] = []
	const edges: Edge[] = []

	const position = { x: 0, y: 0 }

	// Add connection as node
	connections.forEach((connection) => {
		// nodes.push({
		// 	id: connection.publicId,
		// 	type: "connection",
		// 	data: { label: connection.name },
		// 	position: position,
		// 	draggable: false,
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
					// parentNode: connection.publicId,
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
					// parentNode: connection.publicId,
					position,
					draggable: false,
				})
			}
		}

		if (connection.destination && connection.source) {
			const edgeId = `${connection.source.publicId}-${connection.destination.publicId}`
			if (!edges.find((edge) => edge.id === edgeId)) {
				edges.push({
					id: `${connection.source.publicId}-${connection.destination.publicId}`,
					source: connection.source.publicId,
					target: connection.destination.publicId,
					type: "button",
					animated: false,
					deletable: false,
					zIndex: 49,
				})
			} else {
				console.log("HI")
			}
		}
	})

	return { nodes, edges }
}

const ConnectionsOverview = async () => {
	const { workspaceId } = await auth()
	const connections = await db.connection.getMany({
		workspaceId: workspaceId,
	})

	const { nodes, edges } = transformProjectsToFlowElements(connections)

	return (
		<div className="h-full">
			<FlowProvider>
				<div className="flex flex-row gap-2 w-full h-full">
					<Card className="h-full w-full overflow-hidden">
						<Flow initalNodes={nodes} initalEdges={edges} />
					</Card>
				</div>
			</FlowProvider>
		</div>
	)
}

export const runtime = "edge"

export default ConnectionsOverview

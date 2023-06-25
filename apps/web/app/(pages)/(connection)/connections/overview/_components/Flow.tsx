"use client"

import ReactFlow, { Background, Controls, Edge, Node, NodeTypes } from "reactflow"

import "@/components/ui/flow/Flow.css"

import dagre from "dagre"
import { Connection, Destination, Source } from "db/src/schema"

import { DefaultNode } from "@/components/ui/flow/nodes/DefaultNode"
import { GroupNode } from "@/components/ui/flow/nodes/Group"
import { OutputNode } from "@/components/ui/flow/nodes/OutputNode"

const nodeTypes: NodeTypes = {
	default: DefaultNode,
	output: OutputNode,
	group: GroupNode,
}

export type FullConnection = Connection & {
	source: Source | null
	destination: Destination | null
}

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 172
const nodeHeight = 36

// const getLayoutedElements = ({ nodes, edges, direction }) => {
// 	const isHorizontal = direction === "LR"
// 	dagreGraph.setGraph({ rankdir: direction })

// 	nodes.forEach((node) => {
// 		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
// 	})

// 	edges.forEach((edge) => {
// 		dagreGraph.setEdge(edge.source, edge.target)
// 	})

// 	dagre.layout(dagreGraph)

// 	nodes.forEach((node) => {
// 		const nodeWithPosition = dagreGraph.node(node.id)
// 		node.targetPosition = isHorizontal ? "left" : "top"
// 		node.sourcePosition = isHorizontal ? "right" : "bottom"

// 		// We are shifting the dagre node position (anchor=center center) to the top left
// 		// so it matches the React Flow node anchor point (top left).
// 		node.position = {
// 			x: nodeWithPosition.x - nodeWidth / 2,
// 			y: nodeWithPosition.y - nodeHeight / 2,
// 		}

// 		return node
// 	})

// 	return { nodes, edges }
// }

const transformProjectsToFlowElements = (connections: FullConnection[]): { nodes: Node[]; edges: Edge[] } => {
	const nodes: Node[] = []
	const edges: Edge[] = []

	const yPadding = 200
	const labelPadding = 70
	let yPosition = labelPadding

	// projects.forEach((project) => {
	// Add project as node
	// nodes.push({
	// 	id: project.publicId,
	// 	type: "group",
	// 	data: { label: project.name },
	// 	position: { x: 0, y: yPosition - labelPadding },
	// 	className: "w-[1000px]",
	// 	style: {
	// 		height: connection.length * 300 + labelPadding,
	// 	},
	// })

	connections.forEach((connection) => {
		// Add connection as node
		nodes.push({
			id: connection.publicId,
			type: "group",
			data: { label: connection.name },
			position: { x: 0, y: yPosition - labelPadding },
			className: "w-[1000px]",
			style: {
				height: 500 + labelPadding,
			},
		})

		// If there's a destination, add it as a node and connect it to the connection
		if (connection.destination) {
			if (!nodes.find((node) => node.id === connection.destination?.publicId)) {
				nodes.push({
					id: connection.destination.publicId,
					type: "output",
					data: { label: connection.destination.name },
					position: { x: 500, y: yPosition },
				})

				yPosition += yPadding
			}

			// Add edge from connection to destination
			// edges.push({
			// 	id: `edge-${connection.publicId}-${connection.destination.publicId}`,
			// 	source: connection.publicId,
			// 	target: connection.destination.publicId,
			// 	type: "default",
			// 	animated: true,
			// })
		}

		if (connection.source) {
			if (!nodes.find((node) => node.id === connection.source?.publicId)) {
				nodes.push({
					id: connection.source.publicId,
					type: "output",
					data: { label: connection.source.name },
					position: { x: 500, y: yPosition },
				})

				yPosition += yPadding
			}

			// Add edge from connection to destination
		}

		if (connection.destination && connection.source) {
			edges.push({
				id: `src-${connection.source.publicId}-d${connection.destination.publicId}`,
				source: connection.source.publicId,
				target: connection.destination.publicId,
				type: "default",
				animated: true,
			})
		}
	})

	return { nodes, edges }
}

export const Flow = ({ connections }: { connections: FullConnection[] }) => {
	const { nodes, edges } = transformProjectsToFlowElements(connections)
	return (
		<ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} fitView className="bg-background">
			<Background />
			<Controls />
		</ReactFlow>
	)
}

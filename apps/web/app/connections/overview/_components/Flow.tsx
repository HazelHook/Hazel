"use client"

import ReactFlow, { Background, Controls, Edge, Node, NodeTypes } from "reactflow"
import "./Flow.css"
import { DefaultNode } from "./nodes/DefaultNode"
import { InputNode } from "./nodes/InputNode"
import { OutputNode } from "./nodes/OutputNode"
import { GroupNode } from "./nodes/Group"
import { Connection, Destination, Project, Source } from "db/src/schema"

const nodeTypes: NodeTypes = {
	default: DefaultNode,
	input: InputNode,
	output: OutputNode,
	group: GroupNode,
}

export type FullProject = Project & {
	connection: FullConnection[]
}

export type FullConnection = Connection & { source?: Source; destination?: Destination }

export interface FlowInterface {
	projects: FullProject[]
}

const transformProjectsToFlowElements = (projects: FullProject[]): { nodes: Node[]; edges: Edge[] } => {
	const nodes: Node[] = []
	const edges: Edge[] = []

	const yPadding = 200
	let yPosition = 10

	projects.forEach((project) => {
		// Add project as node
		nodes.push({
			id: project.publicId,
			type: "group",
			data: { label: project.name },
			position: { x: 0, y: yPosition - 45 },
			className: "w-[1000px]",
			style: {
				height: project.connection.length * 300 + 45,
			},
		})

		project.connection.forEach((connection) => {
			// Add connection as node
			nodes.push({
				id: connection.publicId,
				type: "input",
				data: { label: connection.name },
				position: { x: 100, y: yPosition },
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
				edges.push({
					id: `edge-${connection.publicId}-${connection.destination.publicId}`,
					source: connection.publicId,
					target: connection.destination.publicId,
					type: "default",
					animated: true,
				})
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
				edges.push({
					id: `edge-${connection.publicId}-d${connection.source.publicId}`,
					source: connection.publicId,
					target: connection.source.publicId,
					type: "default",
					animated: true,
				})
			}
		})
	})

	return { nodes, edges }
}

export const Flow = ({ projects }: FlowInterface) => {
	const { nodes, edges } = transformProjectsToFlowElements(projects)
	return (
		<ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} fitView className="bg-background">
			<Background />
			<Controls />
		</ReactFlow>
	)
}

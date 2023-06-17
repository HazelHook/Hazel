"use client"

import ReactFlow, { Background, Controls, Edge, Node, NodeTypes } from "reactflow"

import "./Flow.css"

import { Connection, Destination, Source } from "db/src/schema"

import { DefaultNode } from "./nodes/DefaultNode"
import { GroupNode } from "./nodes/Group"
import { InputNode } from "./nodes/InputNode"
import { OutputNode } from "./nodes/OutputNode"

const nodeTypes: NodeTypes = {
	default: DefaultNode,
	input: InputNode,
	output: OutputNode,
	group: GroupNode,
}

export type FullConnection = Connection & {
	source: Source | null
	destination: Destination | null
}

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
			type: "input",
			data: { label: connection.name },
			position: { x: 50, y: yPosition },
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

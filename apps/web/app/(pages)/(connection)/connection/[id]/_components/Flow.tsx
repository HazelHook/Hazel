"use client"

import ReactFlow, {
	Background,
	Controls,
	Edge,
	EdgeTypes,
	Node,
	NodeTypes,
	addEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "reactflow"

import "@/components/ui/flow/Flow.css"

import dagre from "dagre"
import { Connection, Destination, Source } from "db/src/schema"
import { DefaultNode } from "@/components/ui/flow/nodes/DefaultNode"
import { InputNode } from "@/components/ui/flow/nodes/InputNode"
import { GroupNode } from "@/components/ui/flow/nodes/Group"
import { OutputNode } from "@/components/ui/flow/nodes/OutputNode"
import { useCallback, useLayoutEffect, useState } from "react"
import { EdgeButton } from "@/components/ui/flow/edges/ButtonEdge"
import ELK, { type ElkNode, type ElkExtendedEdge, type LayoutOptions } from "elkjs/lib/elk.bundled.js"

const nodeTypes: NodeTypes = {
	default: DefaultNode,
	input: InputNode,
	output: OutputNode,
	group: GroupNode,
}

const edgeTypes: EdgeTypes = {
	button: EdgeButton,
}

export type FullConnection = Connection & {
	source: Source | null
	destination: Destination | null
}

const elkOptions = {
	"elk.algorithm": "layered",
	"elk.layered.spacing.nodeNodeBetweenLayers": "100",
	"elk.spacing.nodeNode": "80",
}

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const elk = new ELK()

const getLayoutedElements = async (nodes: Node[], edges: Edge[], options: LayoutOptions = {}) => {
	const isHorizontal = options?.["elk.direction"] === "RIGHT"
	const graph: ElkNode = {
		id: "root",
		layoutOptions: options,
		children: nodes.map((node) => ({
			...node,
			// Adjust the target and source handle positions based on the layout
			// direction.
			targetPosition: isHorizontal ? "left" : "top",
			sourcePosition: isHorizontal ? "right" : "bottom",

			// Hardcode a width and height for elk to use when layouting.
			width: 150,
			height: 50,
		})),
		edges: edges as unknown as ElkExtendedEdge[],
	}

	return elk
		.layout(graph)
		.then((layoutedGraph) => ({
			nodes: layoutedGraph.children?.map((node) => ({
				...node,
				// React Flow expects a position property on the node instead of `x`
				// and `y` fields.
				position: { x: node.x, y: node.y },
			})),

			edges: layoutedGraph.edges,
		}))
		.catch(console.error)
}

const transformProjectsToFlowElements = (connection: FullConnection): { nodes: Node[]; edges: Edge[] } => {
	const nodes: Node[] = []
	const edges: Edge[] = []

	const position = { x: 0, y: 0 }

	// Add connection as node
	nodes.push({
		id: connection.publicId,
		type: "group",
		data: { label: connection.name },
		position: position,
		className: "w-[1000px]",
		style: {
			height: 500 + 100,
		},
	})

	if (connection.source) {
		if (!nodes.find((node) => node.id === connection.source?.publicId)) {
			nodes.push({
				id: connection.source.publicId,
				type: "input",
				data: { label: connection.source.name },
				position,
			})
		}
	}

	// If there's a destination, add it as a node and connect it to the connection

	if (connection.destination) {
		if (!nodes.find((node) => node.id === connection.destination?.publicId)) {
			nodes.push({
				id: connection.destination.publicId,
				type: "ouput",
				data: { label: connection.destination.name },
				position,
			})
		}
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

	return { nodes, edges }
}

export const Flow = ({ connection }: { connection: FullConnection }) => {
	const inital = transformProjectsToFlowElements(connection)
	const [nodes, setNodes, onNodesChange] = useNodesState([])
	const [edges, setEdges, onEdgesChange] = useEdgesState([])

	const { fitView } = useReactFlow()

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [])
	const onLayout = useCallback(
		({ direction = "DOWN", useInitialNodes = false }) => {
			const opts = { "elk.direction": direction, ...elkOptions }
			const ns = useInitialNodes ? inital.nodes : nodes
			const es = useInitialNodes ? inital.edges : edges

			getLayoutedElements(ns, es, opts).then((layouted) => {
				if (layouted) {
					setNodes(layouted.nodes as Node[])
					setEdges(layouted.edges as unknown as Edge[])

					window.requestAnimationFrame(() => fitView())
				}
			})
		},
		[nodes, edges],
	)

	useLayoutEffect(() => {
		onLayout({ direction: "RIGHT", useInitialNodes: true })
	}, [])

	return (
		<ReactFlow
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			onConnect={onConnect}
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			fitView
			className="bg-background"
		>
			<Background />
			<Controls />
		</ReactFlow>
	)
}

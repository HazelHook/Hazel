"use client"

import ReactFlow, {
	Background,
	Controls,
	Edge,
	EdgeTypes,
	Node,
	NodeTypes,
	ReactFlowInstance,
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
import { useCallback, useLayoutEffect, useRef, useState } from "react"
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

export interface FlowProps {
	initalEdges: Edge[]
	initalNodes: Node[]
}

export const Flow = ({ initalEdges, initalNodes }: FlowProps) => {
	const firstRender = useRef<boolean>(true)
	const reactFlowWrapper = useRef<HTMLDivElement>(null)

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any>>()

	const [nodes, setNodes, onNodesChange] = useNodesState([])
	const [edges, setEdges, onEdgesChange] = useEdgesState([])

	const { fitView } = useReactFlow()

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onConnect = useCallback((params: any) => {
		setEdges((eds) => addEdge(params, eds))
	}, [])

	const onLayout = useCallback(
		({ direction = "DOWN", useInitialNodes = false }: { direction: "DOWN" | "RIGHT"; useInitialNodes: boolean }) => {
			const opts = { "elk.direction": direction, ...elkOptions }
			const ns = useInitialNodes ? initalNodes : nodes
			const es = useInitialNodes ? initalEdges : edges

			getLayoutedElements(ns, es, opts).then((layouted) => {
				if (layouted) {
					setNodes(layouted.nodes as Node[])
					setEdges(layouted.edges as unknown as Edge[])

					window.requestAnimationFrame(() => fitView({ duration: 800 }))
				}
			})
		},
		[nodes, edges],
	)

	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onDragOver = useCallback((event: any) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = "move"
	}, [])

	const onDrop = useCallback(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		(event: any) => {
			event.preventDefault()

			const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect()
			const type = event.dataTransfer.getData("application/reactflow")

			// check if the dropped element is valid
			if (typeof type === "undefined" || !type) {
				return
			}

			const position = reactFlowInstance?.project({
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
				x: event.clientX - reactFlowBounds?.left!,
				// rome-ignore lint/style/noNonNullAssertion: <explanation>
				y: event.clientY - reactFlowBounds?.top!,
			})
			const newNode = {
				id: `${Math.random() * Math.random()}`,
				type,
				position,
				data: { label: `${type} node` },
			}

			// @ts-expect-error
			setNodes((nds) => nds.concat(newNode))
		},
		[reactFlowInstance],
	)

	useLayoutEffect(() => {
		onLayout({ direction: "RIGHT", useInitialNodes: true })

		firstRender.current = false
	}, [])

	return (
		<div className="h-full w-full" ref={reactFlowWrapper}>
			<ReactFlow
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onConnect={onConnect}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onInit={setReactFlowInstance}
				onDrop={onDrop}
				onDragOver={onDragOver}
				fitView
				className="bg-background"
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	)
}

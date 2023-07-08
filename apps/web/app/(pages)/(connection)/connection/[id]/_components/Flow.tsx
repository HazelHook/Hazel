"use client";

import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

import "@/components/ui/flow/Flow.css";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Connection, Destination, Source } from "db/src/schema";
import ELK, {
  type ElkExtendedEdge,
  type ElkNode,
  type LayoutOptions,
} from "elkjs/lib/elk.bundled.js";

import { EdgeButton } from "@/components/ui/flow/edges/ButtonEdge";
import { ConnectionGroupNode } from "@/components/ui/flow/nodes/ConnectionGroup";
import { DefaultNode } from "@/components/ui/flow/nodes/DefaultNode";
import { DestinationNode } from "@/components/ui/flow/nodes/DestinationNode";
import { GroupNode } from "@/components/ui/flow/nodes/Group";
import { OutputNode } from "@/components/ui/flow/nodes/OutputNode";
import { SourceNode } from "@/components/ui/flow/nodes/SourceNode";

const nodeTypes: NodeTypes = {
  default: DefaultNode,
  source: SourceNode,
  destination: DestinationNode,
  connection: ConnectionGroupNode,
  output: OutputNode,
  group: GroupNode,
};

const edgeTypes: EdgeTypes = {
  button: EdgeButton,
};

export type FullConnection = Connection & {
  source: Source | null;
  destination: Destination | null;
};

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const elk = new ELK();

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";

  const size = { width: 200, height: 160 };

  const computedNodes: Map<string, ElkNode> = new Map();

  nodes.forEach((node) => {
    if (node.parentNode) {
      const parent = computedNodes.get(node.parentNode);

      if (!parent) {
        console.error(
          `Parent should be defined before child. Parent: ${node.parentNode}`
        );
        return;
      }

      const newNode: ElkNode = {
        ...node,
        // @ts-expect-errors
        targetPosition: isHorizontal ? "left" : "top",
        sourcePosition: isHorizontal ? "right" : "bottom",
        width: size.width,
        height: size.height,
      };

      parent.children = [...(parent.children || []), newNode];

      computedNodes.set(node.parentNode, parent);

      return;
    }

    computedNodes.set(node.id, {
      ...node,
      // @ts-expect-errors
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      properties: { "elk.padding": "[top=60, left=30, bottom=60, right=30]" },
      width: size.width,
      height: size.height,
    });
  });

  const graph: ElkNode = {
    id: "root",
    layoutOptions: options,
    children: Array.from(computedNodes.values()),
    edges: edges as unknown as ElkExtendedEdge[], // If you have control over `edges` structure, try to avoid type casting
  };

  const layout = await elk.layout(graph);

  const flatNodes: Node[] = [];

  layout.children?.forEach((child) => {
    // @ts-expect-errors
    flatNodes.push({
      ...child,
      style: {
        width: child.width,
        height: child.height,
      },
      position: { x: child.x || 0, y: child.y || 0 },
    });

    child.children?.forEach((nested) => {
      // @ts-expect-errors
      flatNodes.push({
        ...nested,
        position: { x: nested.x || 0, y: nested.y || 0 },
      });
    });
  });

  return {
    nodes: flatNodes,
    edges: layout.edges as unknown as Edge[],
  };
};

export interface FlowProps {
  initalEdges: Edge[];
  initalNodes: Node[];
}

export const Flow = ({ initalEdges, initalNodes }: FlowProps) => {
  const firstRender = useRef<boolean>(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<any, any>>();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { fitView } = useReactFlow();

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onLayout = useCallback(
    ({
      direction = "DOWN",
      useInitialNodes = false,
    }: {
      direction: "DOWN" | "RIGHT";
      useInitialNodes: boolean;
    }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const ns = useInitialNodes ? initalNodes : nodes;
      const es = useInitialNodes ? initalEdges : edges;

      getLayoutedElements(ns, es, opts).then((layouted) => {
        if (layouted) {
          setNodes(layouted.nodes as Node[]);
          setEdges(layouted.edges as unknown as Edge[]);

          window.requestAnimationFrame(() => fitView({ duration: 800 }));
        }
      });
    },
    [nodes, edges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds =
        reactFlowWrapper?.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds?.left!,
        y: event.clientY - reactFlowBounds?.top!,
      });
      const newNode = {
        id: `${Math.random() * Math.random()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      // @ts-expect-error
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useLayoutEffect(() => {
    onLayout({ direction: "RIGHT", useInitialNodes: true });

    firstRender.current = false;
  }, []);

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
        <Controls className="!bg-card" />
      </ReactFlow>
    </div>
  );
};

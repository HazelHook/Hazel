"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"

export const Nodebar = () => {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType)
		event.dataTransfer.effectAllowed = "move"
	}

	return (
		<aside className="space-y-4">
			<div className="description">You can drag these nodes to the pane on the right.</div>
			<div className="flex flex-row gap-2 flex-wrap">
				<Badge className="dndnode input" onDragStart={(event) => onDragStart(event, "input")} draggable>
					Input Node
				</Badge>
				<Badge className="dndnode" onDragStart={(event) => onDragStart(event, "default")} draggable>
					Default Node
				</Badge>
				<Badge className="dndnode output" onDragStart={(event) => onDragStart(event, "output")} draggable>
					Output Node
				</Badge>
			</div>
		</aside>
	)
}

import React from "react"
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from "reactflow"

import { useDrag, useDrop } from "react-dnd"

import { RoundPlusIcon } from "@/components/icons/RoundPlus"
import { Popover, PopoverContent, PopoverTrigger } from "../../popover"

const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
	evt.stopPropagation()
	alert(`remove ${id}`)
}

export const EdgeButton = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
}: EdgeProps) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})

	return (
		<>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						// everything inside EdgeLabelRenderer has no pointer events by default
						// if you have an interactive element, set pointer-events: all
						pointerEvents: "all",
					}}
					className="nodrag nopan flex justify-center z-50"
				>
					<Popover>
						<PopoverTrigger asChild>
							<button type="button" className="rounded-full bg-secondary">
								<RoundPlusIcon />
							</button>
						</PopoverTrigger>
						<PopoverContent>
							<div>Wow</div>
						</PopoverContent>
					</Popover>
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

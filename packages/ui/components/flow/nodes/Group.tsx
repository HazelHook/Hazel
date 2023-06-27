import React, { memo } from "react"
import { NodeProps } from "reactflow"

interface DefaultNode extends NodeProps {
	data: {
		label: string
	}
}

export const GroupNode = memo(({ data }: DefaultNode) => {
	return (
		<div className="border bg-card/40 w-full h-full rounded-md min-h-[50px] min-w-[150px]">
			<div className="p-2 bg-cyan-500 border w-max rounded-br-sm">
				<h3 className="font-semibold">{data.label}</h3>
			</div>
		</div>
	)
})

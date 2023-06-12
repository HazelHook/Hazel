import React, { memo } from "react"
import { Handle, Position } from "reactflow"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DefaultNode {
	data: {
		label: string
	}
}

export const OutputNode = memo(({ data }: DefaultNode) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{data.label}</CardTitle>
			</CardHeader>

			<Handle type="target" position={Position.Left} />
		</Card>
	)
})

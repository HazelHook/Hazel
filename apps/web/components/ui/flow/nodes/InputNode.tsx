import React, { memo } from "react"
import { Position } from "reactflow"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Handle } from "../base/Handle"

interface DefaultNode {
	data: {
		label: string
	}
}

export const InputNode = memo(({ data }: DefaultNode) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{data.label}</CardTitle>
			</CardHeader>

			<Handle type="source" position={Position.Right} />
		</Card>
	)
})

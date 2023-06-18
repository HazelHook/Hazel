"use client"

import { ReactFlowProvider } from "reactflow"
import { ReactNode } from "react"

export const FlowProvider = ({ children }: { children: ReactNode }) => {
	return <ReactFlowProvider>{children}</ReactFlowProvider>
}

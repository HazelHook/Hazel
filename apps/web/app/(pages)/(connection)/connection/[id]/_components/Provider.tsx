"use client"

import { ReactNode } from "react"
import { ReactFlowProvider } from "reactflow"

export const FlowProvider = ({ children }: { children: ReactNode }) => {
	return <ReactFlowProvider>{children}</ReactFlowProvider>
}

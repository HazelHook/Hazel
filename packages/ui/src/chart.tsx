"use client"

import "./styles/apexcharts.css"

import dynamic from "next/dynamic"
import type { Props } from "react-apexcharts"

const ReactChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export const Chart = (props: Props) => {
	return <ReactChart {...props} />
}

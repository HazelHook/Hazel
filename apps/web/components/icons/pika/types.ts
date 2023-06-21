import { SVGProps } from "react"

export interface IconProps extends Partial<SVGProps<SVGSVGElement>> {
	size?: string | number
	absoluteStrokeWidth?: boolean
}

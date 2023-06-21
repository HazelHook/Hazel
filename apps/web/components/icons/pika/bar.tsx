import { IconProps } from "./types"

export const BarIcon = (props: IconProps) => (
	<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M21 21H7a4 4 0 0 1-4-4V3m5 14v-4m5 4V6m5 11V9"
		/>
		<title>barIcon</title>
	</svg>
)
